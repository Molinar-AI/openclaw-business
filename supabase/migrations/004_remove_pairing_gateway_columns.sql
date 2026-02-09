-- Remove dead columns: pairing_code and gateway_ip are no longer used.
-- Pairing is now handled via ECS Exec (openclaw pairing approve telegram <code>)
-- instead of the gateway HTTP API.
ALTER TABLE openclaw_instances
  DROP COLUMN IF EXISTS pairing_code,
  DROP COLUMN IF EXISTS gateway_ip;

-- Update setup_phase CHECK constraint: remove 'pairing' (no longer a valid phase)
ALTER TABLE openclaw_instances
  DROP CONSTRAINT IF EXISTS openclaw_instances_setup_phase_check;

ALTER TABLE openclaw_instances
  ADD CONSTRAINT openclaw_instances_setup_phase_check
    CHECK (setup_phase IN (
      'provisioning', 'configuring', 'doctor', 'nginx',
      'gateway', 'ready', NULL
    ));
