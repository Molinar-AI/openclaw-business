export type SetupPhase = 'provisioning' | 'configuring' | 'doctor' | 'nginx' | 'gateway' | 'ready';

export interface OpenClawInstance {
  id: string;
  org_id: string;
  name: string;
  status: 'stopped' | 'starting' | 'running' | 'error';
  system_prompt: string | null;
  model: string;
  ecs_task_arn: string | null;
  setup_phase: SetupPhase | null;
  setup_started_at: string | null;
  started_at: string | null;
  stopped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInstanceInput {
  name: string;
  system_prompt?: string;
  model?: string;
  anthropic_api_key: string;
  telegram_bot_token?: string;
}
