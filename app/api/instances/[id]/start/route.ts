import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { runOpenClawTask } from '@/lib/aws/ecs';
import { getSecret } from '@/lib/aws/ssm';

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
  if (instance.status === 'running' || instance.status === 'starting') {
    return NextResponse.json({ error: 'Instance is already running' }, { status: 400 });
  }

  // Read secrets from SSM
  const anthropicKey = await getSecret(`/openclaw/${org.id}/${id}/anthropic-key`);
  if (!anthropicKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 400 });
  }

  const telegramToken = await getSecret(`/openclaw/${org.id}/${id}/telegram-token`);

  // Build environment variables
  const gatewayToken = randomBytes(32).toString('hex');
  const envVars: Record<string, string> = {
    ANTHROPIC_API_KEY: anthropicKey,
    OPENCLAW_GATEWAY_PORT: '18789',
    OPENCLAW_GATEWAY_TOKEN: gatewayToken,
  };
  if (telegramToken) envVars.TELEGRAM_BOT_TOKEN = telegramToken;
  if (instance.system_prompt) envVars.SYSTEM_PROMPT = instance.system_prompt;

  // Launch ECS task
  const task = await runOpenClawTask(envVars);
  if (!task?.taskArn) {
    return NextResponse.json({ error: 'Failed to start task' }, { status: 500 });
  }

  // Update instance status with setup tracking fields
  await supabase
    .from('openclaw_instances')
    .update({
      status: 'starting',
      ecs_task_arn: task.taskArn,
      setup_phase: 'provisioning',
      setup_started_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return NextResponse.json({ status: 'starting', taskArn: task.taskArn }, { status: 202 });
}
