'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import type { OpenClawInstance } from '@/types/instance';

export function useInstanceRealtime(instanceId: string) {
  const [instance, setInstance] = useState<OpenClawInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchInstance = useCallback(async () => {
    try {
      const res = await fetch(`/api/instances/${instanceId}`);
      if (res.ok) {
        setInstance(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    // Initial fetch
    fetchInstance();

    // Subscribe to Realtime changes on this specific instance
    const channel = supabaseClient
      .channel(`instance-${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'openclaw_instances',
          filter: `id=eq.${instanceId}`,
        },
        (payload) => {
          setInstance(payload.new as OpenClawInstance);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [instanceId, fetchInstance]);

  // Adaptive polling: faster during setup, slower when running
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const isSettingUp = instance?.status === 'starting' && instance?.setup_phase;
    const pollInterval = isSettingUp ? 3000 : 5000;

    intervalRef.current = setInterval(fetchInstance, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [instance?.status, instance?.setup_phase, fetchInstance]);

  return { instance, loading, refetch: fetchInstance };
}
