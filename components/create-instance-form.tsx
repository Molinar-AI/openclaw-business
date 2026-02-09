'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { KbdShortcut } from '@/components/kbd-shortcut';
import type { Organization } from '@/types/organization';

const steps = [
  { number: 1, label: 'Basics' },
  { number: 2, label: 'Channels' },
  { number: 3, label: 'Configure' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((s, i) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                s.number < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : s.number === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {s.number < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.number
              )}
            </div>
            <span className={`text-xs ${s.number === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 mb-5 transition-colors ${
                s.number < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function CreateInstanceForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);

  const onTrial = org ? !org.customer_id && !!org.trial_ends_at && new Date(org.trial_ends_at) > new Date() : false;
  const trialExpired = org ? !org.customer_id && !!org.trial_ends_at && new Date(org.trial_ends_at) <= new Date() : false;

  useEffect(() => {
    fetch('/api/organization')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setOrg(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (trialExpired) router.push('/dashboard/billing');
  }, [trialExpired, router]);

  useEffect(() => {
    if (onTrial) setForm((f) => ({ ...f, model: 'claude-haiku-4-5-20251001' }));
  }, [onTrial]);

  const [form, setForm] = useState({
    name: '',
    anthropic_api_key: '',
    telegram_bot_token: '',
    system_prompt: '',
    model: 'claude-sonnet-4-5-20250929',
  });

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create instance');
      }
      const instance = await res.json();

      // Auto-start the instance immediately after creation
      await fetch(`/api/instances/${instance.id}/start`, { method: 'POST' });

      router.push(`/dashboard/instances/${instance.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [form, router]);

  const canAdvanceStep1 = form.name && form.anthropic_api_key;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (step === 1 && canAdvanceStep1) setStep(2);
        else if (step === 2) setStep(3);
        else if (step === 3 && !loading) handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, canAdvanceStep1, loading, handleSubmit]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create AI Agent</h1>
      </div>

      <StepIndicator currentStep={step} />

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Info & API Key</CardTitle>
            <CardDescription>Name your agent and provide your Anthropic API key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Instance Name</Label>
              <Input
                id="name"
                placeholder="My Support Bot"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">Anthropic API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-ant-..."
                value={form.anthropic_api_key}
                onChange={(e) => setForm({ ...form, anthropic_api_key: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Your key is encrypted and stored securely in AWS. Don&apos;t have one?{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Get your free API key from Anthropic →
                </a>
              </p>
            </div>
            <Button onClick={() => setStep(2)} disabled={!form.name || !form.anthropic_api_key}>
              Next <KbdShortcut />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Channel Configuration</CardTitle>
            <CardDescription>Connect your agent to messaging platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
              <p className="text-sm font-medium">Create a Telegram bot first:</p>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>
                  Open{' '}
                  <a
                    href="https://t.me/BotFather"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
                  >
                    @BotFather <ExternalLink className="h-3 w-3" />
                  </a>
                  {' '}on Telegram
                </li>
                <li>Send <code className="bg-muted px-1 py-0.5 rounded text-xs">/newbot</code> and follow the prompts</li>
                <li>Choose a name and username (must end in &ldquo;Bot&rdquo;)</li>
                <li>Copy the bot token and paste it below</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram Bot Token</Label>
              <Input
                id="telegram"
                type="password"
                placeholder="123456:ABC-DEF..."
                value={form.telegram_bot_token}
                onChange={(e) => setForm({ ...form, telegram_bot_token: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next <KbdShortcut /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
            <CardDescription>Customize your agent&apos;s behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">System Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="You are a helpful customer support agent..."
                rows={6}
                value={form.system_prompt}
                onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={form.model} onValueChange={(value) => setForm({ ...form, model: value })} disabled={onTrial}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {!onTrial && <SelectItem value="claude-sonnet-4-5-20250929">Claude Sonnet 4.5</SelectItem>}
                  <SelectItem value="claude-haiku-4-5-20251001">Claude Haiku 4.5</SelectItem>
                </SelectContent>
              </Select>
              {onTrial && (
                <p className="text-xs text-muted-foreground">Free trial includes Claude Haiku. <Link href="/dashboard/billing" className="text-primary hover:underline">Upgrade for Sonnet.</Link></p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : <> Create &amp; Launch <KbdShortcut /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
