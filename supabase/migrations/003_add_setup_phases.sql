ALTER TABLE openclaw_instances
  ADD COLUMN setup_phase TEXT DEFAULT NULL
    CHECK (setup_phase IN (
      'provisioning', 'configuring', 'doctor', 'nginx',
      'gateway', 'pairing', 'ready', NULL
    )),
  ADD COLUMN pairing_code TEXT DEFAULT NULL,
  ADD COLUMN gateway_ip TEXT DEFAULT NULL,
  ADD COLUMN setup_started_at TIMESTAMPTZ DEFAULT NULL;

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE openclaw_instances;
