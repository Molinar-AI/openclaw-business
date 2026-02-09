import { CloudWatchLogsClient, GetLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import type { SetupPhase } from '@/types/instance';

const logs = new CloudWatchLogsClient({ region: process.env.AWS_REGION || 'us-west-2' });

const LOG_GROUP = '/ecs/openclaw-instances';

/**
 * Extracts the ECS task ID from a full task ARN.
 * ARN format: arn:aws:ecs:region:account:task/cluster-name/task-id
 */
function taskIdFromArn(taskArn: string): string {
  const parts = taskArn.split('/');
  return parts[parts.length - 1];
}

/**
 * Reads CloudWatch logs for an ECS task and determines the current setup phase.
 * Returns the most advanced startup phase detected.
 */
export async function getSetupPhaseFromLogs(taskArn: string): Promise<{ phase: SetupPhase }> {
  const taskId = taskIdFromArn(taskArn);
  const logStreamName = `openclaw/openclaw-agent/${taskId}`;

  try {
    const command = new GetLogEventsCommand({
      logGroupName: LOG_GROUP,
      logStreamName,
      startFromHead: false,
      limit: 200,
    });

    const result = await logs.send(command);
    const events = result.events || [];

    // Phase order for forward-only advancement
    const phaseOrder: SetupPhase[] = ['provisioning', 'configuring', 'doctor', 'nginx', 'gateway', 'ready'];
    let maxPhaseIndex = 0;

    for (const event of events) {
      const msg = event.message || '';

      // Configuring: entrypoint or configure messages
      if (msg.includes('[entrypoint]') || msg.includes('[configure]')) {
        const idx = phaseOrder.indexOf('configuring');
        if (idx > maxPhaseIndex) maxPhaseIndex = idx;
      }

      // Doctor: "Doctor complete" or "openclaw doctor"
      if (msg.includes('Doctor complete') || msg.includes('openclaw doctor')) {
        const idx = phaseOrder.indexOf('doctor');
        if (idx > maxPhaseIndex) maxPhaseIndex = idx;
      }

      // Nginx: "[entrypoint] starting nginx"
      if (msg.includes('starting nginx')) {
        const idx = phaseOrder.indexOf('nginx');
        if (idx > maxPhaseIndex) maxPhaseIndex = idx;
      }

      // Gateway: "[entrypoint] starting openclaw gateway"
      if (msg.includes('starting openclaw gateway')) {
        const idx = phaseOrder.indexOf('gateway');
        if (idx > maxPhaseIndex) maxPhaseIndex = idx;
      }

      // Ready: gateway is listening / heartbeat started / telegram started
      if (msg.includes('[gateway] listening on') || msg.includes('[heartbeat] started')) {
        const idx = phaseOrder.indexOf('ready');
        if (idx > maxPhaseIndex) maxPhaseIndex = idx;
      }
    }

    return { phase: phaseOrder[maxPhaseIndex] };
  } catch {
    // Log stream may not exist yet → still provisioning
    return { phase: 'provisioning' };
  }
}
