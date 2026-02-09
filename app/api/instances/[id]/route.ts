import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { describeOpenClawTask, stopOpenClawTask } from '@/lib/aws/ecs';
import { getSetupPhaseFromLogs } from '@/lib/aws/cloudwatch';
import { deleteSecret } from '@/lib/aws/ssm';
import type { SetupPhase } from '@/types/instance';

// GET /api/instances/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: instance } = await supabase
    .from('openclaw_instances')
    .select('*')
    .eq('id', id)
    .eq('org_id', org.id)
    .single();

  if (!instance) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Phase ordering for forward-only advancement (startup phases only — pairing is post-ready)
  const PHASE_ORDER: SetupPhase[] = ['provisioning', 'configuring', 'doctor', 'nginx', 'gateway', 'ready'];

  // Update status from ECS if task is running/starting
  if (instance.ecs_task_arn && (instance.status === 'starting' || instance.status === 'running')) {
    try {
      const task = await describeOpenClawTask(instance.ecs_task_arn);
      let newStatus = instance.status;

      if (task?.lastStatus === 'STOPPED') {
        newStatus = 'stopped';
      } else if (task?.lastStatus === 'PENDING' || task?.lastStatus === 'PROVISIONING') {
        newStatus = 'starting';
      } else if (task?.lastStatus === 'RUNNING') {
        // Parse logs during startup to advance setup phase
        if (instance.setup_phase && instance.status === 'starting') {
          const { phase } = await getSetupPhaseFromLogs(instance.ecs_task_arn);

          const currentIdx = instance.setup_phase ? PHASE_ORDER.indexOf(instance.setup_phase) : -1;
          const newIdx = PHASE_ORDER.indexOf(phase);
          const updates: Record<string, unknown> = {};

          // Only advance startup phase forward, never regress
          if (newIdx > currentIdx) {
            updates.setup_phase = phase;
            instance.setup_phase = phase;
          }

          // If ready → transition to running but KEEP setup_phase='ready' (awaiting user pairing)
          if (phase === 'ready' || (newIdx > currentIdx && PHASE_ORDER[newIdx] === 'ready')) {
            newStatus = 'running';
            updates.setup_phase = 'ready';
            updates.started_at = new Date().toISOString();
            instance.setup_phase = 'ready';
          }

          if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date().toISOString();
            if (newStatus !== instance.status) updates.status = newStatus;
            await supabase.from('openclaw_instances').update(updates).eq('id', id);
            instance.status = newStatus;
          }
        }
      }

      // Handle status-only changes (stopped, etc.)
      if (newStatus !== instance.status && task?.lastStatus !== 'RUNNING') {
        await supabase
          .from('openclaw_instances')
          .update({
            status: newStatus,
            ...(newStatus === 'stopped' ? {
              stopped_at: new Date().toISOString(),
              ecs_task_arn: null,
              setup_phase: null,
              setup_started_at: null,
            } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        instance.status = newStatus;
      }
    } catch {
      // ECS describe failed, keep current status
    }
  }

  return NextResponse.json(instance);
}

// PATCH /api/instances/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const { name, system_prompt, model } = body;

  const { data: instance, error } = await supabase
    .from('openclaw_instances')
    .update({
      ...(name && { name }),
      ...(system_prompt !== undefined && { system_prompt }),
      ...(model && { model }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  return NextResponse.json(instance);
}

// DELETE /api/instances/[id]
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const auth = await getAuthenticatedMember();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Fetch instance to check if it has a running task
  const { data: instance } = await supabase
    .from('openclaw_instances')
    .select('ecs_task_arn')
    .eq('id', id)
    .eq('org_id', org.id)
    .single();

  if (!instance) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Stop the ECS task if it's still running
  if (instance.ecs_task_arn) {
    try {
      await stopOpenClawTask(instance.ecs_task_arn);
    } catch {
      // Task may already be stopped
    }
  }

  // Clean up SSM secrets
  await deleteSecret(`/openclaw/${org.id}/${id}/anthropic-key`);
  await deleteSecret(`/openclaw/${org.id}/${id}/telegram-token`);

  await supabase
    .from('openclaw_instances')
    .delete()
    .eq('id', id)
    .eq('org_id', org.id);

  return NextResponse.json({ ok: true });
}
