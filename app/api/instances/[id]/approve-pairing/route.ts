import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { execCommandInTask } from '@/lib/aws/ecs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

  if (!instance.ecs_task_arn || instance.status !== 'running') {
    return NextResponse.json({ error: 'Instance is not running' }, { status: 400 });
  }

  // Read the pairing code from the request body
  const body = await request.json();
  const { code } = body;
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Pairing code is required' }, { status: 400 });
  }

  // Sanitize code — only allow alphanumeric and hyphens to prevent injection
  const sanitized = code.trim().replace(/[^a-zA-Z0-9-]/g, '');
  if (!sanitized) {
    return NextResponse.json({ error: 'Invalid pairing code' }, { status: 400 });
  }

  try {
    // Execute the pairing approval command inside the container
    await execCommandInTask(
      instance.ecs_task_arn,
      `openclaw pairing approve telegram ${sanitized}`,
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to approve pairing: ${err instanceof Error ? err.message : 'unknown error'}` },
      { status: 502 },
    );
  }

  // Pairing complete — clear setup_phase to finish setup entirely
  await supabase
    .from('openclaw_instances')
    .update({
      setup_phase: null,
      setup_started_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return NextResponse.json({ status: 'approved' });
}
