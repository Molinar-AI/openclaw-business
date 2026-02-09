'use client';

import { StytchB2B } from '@stytch/nextjs/b2b';
import { AuthFlowType, B2BProducts } from '@stytch/vanilla-js/b2b';


const config = {
  products: [B2BProducts.emailMagicLinks, B2BProducts.oauth],
  authFlowType: AuthFlowType.Discovery,
  sessionOptions: {
    sessionDurationMinutes: 60 * 24 * 7, // 7 days
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border mb-4">
            <img src="/molinar-logo.svg" alt="Molinar" className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Molinar</h1>
          <p className="mt-2 text-muted-foreground">Sign in to manage your AI agents</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border">
          <StytchB2B config={config} />
        </div>
      </div>
    </div>
  );
}
