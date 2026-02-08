import { getAuthenticatedMember } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';
import { InstanceCard } from '@/components/instance-card';
import type { OpenClawInstance } from '@/types/instance';

export default async function DashboardPage() {
  const auth = await getAuthenticatedMember();
  if (!auth) redirect('/login');

  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('stytch_org_id', auth.organization.organization_id)
    .single();

  let instances: OpenClawInstance[] = [];
  if (org) {
    const { data } = await supabase
      .from('openclaw_instances')
      .select('*')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false });
    instances = (data as OpenClawInstance[]) || [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your AI Agents</h1>
          <p className="text-muted-foreground">Manage your AI agent instances</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/instances/new">
            <Plus className="mr-2 h-4 w-4" />
            New Instance
          </Link>
        </Button>
      </div>
      {instances.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No instances yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first AI agent to get started.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/instances/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Instance
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instances.map((instance) => (
            <InstanceCard key={instance.id} instance={instance} />
          ))}
        </div>
      )}
    </div>
  );
}
