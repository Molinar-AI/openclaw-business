'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageCircle } from 'lucide-react';

interface PairingApprovalProps {
  instanceId: string;
  onApproved: () => void;
}

export function PairingApproval({ instanceId, onApproved }: PairingApprovalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/instances/${instanceId}/approve-pairing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to approve pairing');
        return;
      }
      onApproved();
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageCircle className="h-4 w-4 text-primary" />
          Telegram Pairing
        </div>
        <p className="text-xs text-muted-foreground">
          Message your bot on Telegram. It will reply with a pairing code. Paste it below to connect.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Paste pairing code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApprove()}
            className="font-mono"
          />
          <Button onClick={handleApprove} disabled={loading || !code.trim()} size="sm">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Approve
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
