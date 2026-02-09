'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, Circle } from 'lucide-react';
import { PairingApproval } from '@/components/pairing-approval';
import type { OpenClawInstance, SetupPhase } from '@/types/instance';

const PHASES: { key: SetupPhase; label: string; description: string }[] = [
  { key: 'provisioning', label: 'Provisioning', description: 'Launching container on AWS Fargate' },
  { key: 'configuring', label: 'Configuring', description: 'Setting up environment and configuration' },
  { key: 'doctor', label: 'Health Check', description: 'Running openclaw doctor diagnostics' },
  { key: 'nginx', label: 'Web Server', description: 'Starting nginx reverse proxy' },
  { key: 'gateway', label: 'Gateway', description: 'Starting openclaw gateway service' },
  { key: 'ready', label: 'Telegram Pairing', description: 'Instance is running. Message your bot and paste the pairing code below.' },
];

function getPhaseIndex(phase: SetupPhase | null): number {
  if (!phase) return -1;
  return PHASES.findIndex(p => p.key === phase);
}

function ElapsedTime({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState('0s');

  useEffect(() => {
    const start = new Date(startedAt).getTime();

    const update = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      if (diff < 60) {
        setElapsed(`${diff}s`);
      } else {
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        setElapsed(`${mins}m ${secs}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return <span className="text-sm text-muted-foreground font-mono">{elapsed}</span>;
}

interface SetupProgressProps {
  instance: OpenClawInstance;
  onRefetch: () => void;
}

export function SetupProgress({ instance, onRefetch }: SetupProgressProps) {
  const currentIndex = getPhaseIndex(instance.setup_phase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Setting up {instance.name}</h2>
          <p className="text-sm text-muted-foreground">
            {instance.setup_phase === 'ready'
              ? 'Your instance is running. Message your Telegram bot to get a pairing code.'
              : 'Your instance is starting up. This usually takes around 5 minutes.'}
          </p>
        </div>
        {instance.setup_started_at && (
          <ElapsedTime startedAt={instance.setup_started_at} />
        )}
      </div>

      {/* Vertical stepper */}
      <div className="space-y-0">
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const isReadyPhase = phase.key === 'ready' && isCurrent;

          return (
            <div key={phase.key} className="flex gap-4">
              {/* Vertical line + icon column */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0
                  ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                  ${isCurrent ? 'border-primary bg-primary/10' : ''}
                  ${isFuture ? 'border-muted-foreground/30 text-muted-foreground/30' : ''}
                `}>
                  {isCompleted && <Check className="h-4 w-4" />}
                  {isCurrent && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                  {isFuture && <Circle className="h-3 w-3 fill-current" />}
                </div>
                {/* Connector line */}
                {index < PHASES.length - 1 && (
                  <div className={`w-0.5 grow min-h-[24px] ${
                    isCompleted ? 'bg-emerald-500' : 'bg-muted-foreground/20'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${isFuture ? 'opacity-40' : ''}`}>
                <p className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                  {phase.label}
                </p>
                <p className="text-xs text-muted-foreground">{phase.description}</p>

                {/* Pairing input — shown when instance is ready */}
                {isReadyPhase && (
                  <div className="mt-3">
                    <PairingApproval
                      instanceId={instance.id}
                      onApproved={onRefetch}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground border rounded-lg p-3 bg-muted/50">
        You can safely leave this page and return later. Your setup will continue in the background.
      </p>
    </div>
  );
}
