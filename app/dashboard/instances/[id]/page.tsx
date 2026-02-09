'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstanceStatusBadge } from '@/components/instance-status-badge';
import { SetupProgress } from '@/components/setup-progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Play, Square, Trash2, Copy, Check } from 'lucide-react';
import { useInstanceRealtime } from '@/hooks/use-instance-realtime';

const MODEL_NAMES: Record<string, string> = {
  'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
  'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
  'claude-opus-4-6': 'Claude Opus 4.6',
};

function getModelName(model: string): string {
  return MODEL_NAMES[model] || model;
}

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const truncated = `${id.slice(0, 8)}...${id.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
      title={id}
    >
      {truncated}
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function InstanceSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Skeleton className="h-9 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  );
}

export default function InstanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { instance, loading, refetch } = useInstanceRealtime(params.id as string);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleStart = async () => {
    setActionLoading(true);
    await fetch(`/api/instances/${params.id}/start`, { method: 'POST' });
    await refetch();
    setActionLoading(false);
  };

  const handleStop = async () => {
    setActionLoading(true);
    await fetch(`/api/instances/${params.id}/stop`, { method: 'POST' });
    await refetch();
    setActionLoading(false);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setDeleteDialogOpen(false);
    await fetch(`/api/instances/${params.id}`, { method: 'DELETE' });
    router.refresh();
    router.push('/dashboard');
  };

  if (loading) {
    return <InstanceSkeleton />;
  }

  if (!instance) {
    return <div className="text-center py-12">Instance not found</div>;
  }

  const isSettingUp = !!instance.setup_phase;

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" onClick={() => router.push('/dashboard')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{instance.name}</h1>
          <CopyableId id={instance.id} />
        </div>
        <InstanceStatusBadge status={instance.status} />
      </div>

      <div className="flex gap-2">
        {(instance.status === 'stopped' || instance.status === 'error') && (
          <Button onClick={handleStart} disabled={actionLoading}>
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
        )}
        {(instance.status === 'running' || instance.status === 'starting') && (
          <Button variant="outline" onClick={handleStop} disabled={actionLoading}>
            <Square className="mr-2 h-4 w-4" /> Stop
          </Button>
        )}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={actionLoading}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete instance</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{instance.name}&rdquo;? This action cannot be undone. All associated secrets will be removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Conditional: Setup stepper vs normal detail view */}
      {isSettingUp ? (
        <SetupProgress instance={instance} onRefetch={refetch} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span>{getModelName(instance.model)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(instance.created_at).toLocaleDateString()}</span>
                </div>
                {instance.started_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Started</span>
                    <span>{new Date(instance.started_at).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {instance.system_prompt || 'No system prompt configured'}
                </p>
              </CardContent>
            </Card>
          </div>

          {instance.ecs_task_arn && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ECS Task</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-xs break-all">{instance.ecs_task_arn}</code>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
