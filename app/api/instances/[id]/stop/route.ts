import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { stopOpenClawTask } from '@/lib/aws/ecs';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
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
  if (!instance.ecs_task_arn) {
    return NextResponse.json({ error: 'No running task' }, { status: 400 });
  }

  await stopOpenClawTask(instance.ecs_task_arn);

  await supabase
    .from('openclaw_instances')
    .update({
      status: 'stopped',
      ecs_task_arn: null,
      setup_phase: null,
      setup_started_at: null,
      stopped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return NextResponse.json({ status: 'stopped' });
}
