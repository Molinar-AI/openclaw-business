import Link from 'next/link';
import { getAuthenticatedMember } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Zap,
  Shield,
  ShieldCheck,
  ArrowRight,
  Home,
  UtensilsCrossed,
  Users,
  Megaphone,
  ShoppingBag,
  GraduationCap,
  Github,
  Clock,
  Lock,
  Server,
  KeyRound,
  Container,
} from 'lucide-react';

export default async function LandingPage() {
  const auth = await getAuthenticatedMember();
  if (auth) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/10">
              <img src="/molinar-logo.svg" alt="Molinar" className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg text-white">Molinar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#pricing"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="#use-cases"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Use Cases
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full text-sm font-medium h-9 px-5 py-2 bg-green-500 text-black shadow hover:bg-green-400 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.08),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-sm text-gray-300 mb-8 whitespace-nowrap backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              <span className="hidden sm:inline">Secure &middot; Isolated &middot; Enterprise-grade AWS infrastructure</span>
              <span className="sm:hidden">Secure &middot; Isolated &middot; AWS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              The open source{' '}
              <br className="hidden sm:block" />
              alternative to{' '}
              <span className="text-green-400">ai.com</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Deploy your own AI agent in 3 steps. Each agent runs in its own
              isolated container on AWS. Open source, BYOK, and your keys never touch our database.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full text-base font-medium h-12 px-8 bg-green-500 text-black shadow-lg shadow-green-500/20 hover:bg-green-400 transition-colors gap-2 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-gray-500">
                No credit card required &middot; Plans from $49/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span><strong className="text-white">200+</strong> Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span><strong className="text-white">176K+</strong> GitHub Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span><strong className="text-white">Isolated</strong> Containers</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span><strong className="text-white">Encrypted</strong> API Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Powered by <strong className="text-white">AWS</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Differentiator */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Your business deserves better than shared AI
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Most AI tools share infrastructure between users. Molinar gives
              every instance its own isolated environment — your data never touches anyone else&apos;s.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SecurityCard
              icon={<Container className="h-5 w-5" />}
              title="Isolated containers"
              description="Each AI assistant runs in its own dedicated container on AWS Fargate. No shared compute, no noisy neighbors."
            />
            <SecurityCard
              icon={<KeyRound className="h-5 w-5" />}
              title="Encrypted secrets"
              description="API keys stored with AWS SSM SecureString encryption. Never logged, never shared, never exposed."
            />
            <SecurityCard
              icon={<Shield className="h-5 w-5" />}
              title="Egress-only networking"
              description="No inbound connections to your agent. It reaches out to Telegram and APIs — nothing reaches in."
            />
            <SecurityCard
              icon={<Lock className="h-5 w-5" />}
              title="Your keys, your control"
              description="Bring your own Anthropic API key. Stop or delete your instance anytime. We never access your conversations."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Every business owner needs an AI employee
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Whether you&apos;re running your first business or scaling your tenth,
              Molinar handles the work that keeps you from growing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<Home className="h-5 w-5" />}
              title="Real Estate"
              description="Draft follow-up messages to leads, summarize property details, and manage showing reminders — all from Telegram."
            />
            <UseCaseCard
              icon={<UtensilsCrossed className="h-5 w-5" />}
              title="Restaurants"
              description="Handle reservation confirmations, respond to online reviews, and post daily specials to social media."
            />
            <UseCaseCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="Coaches & Consultants"
              description="Send session prep questions, follow up with action items, and handle scheduling — hands-free."
            />
            <UseCaseCard
              icon={<Megaphone className="h-5 w-5" />}
              title="Marketing Agencies"
              description="Spin up a dedicated AI assistant for each client. Maintain brand voice across accounts."
            />
            <UseCaseCard
              icon={<ShoppingBag className="h-5 w-5" />}
              title="E-Commerce"
              description="Answer shipping questions, handle return policies, and manage customer support 24/7."
            />
            <UseCaseCard
              icon={<Users className="h-5 w-5" />}
              title="Teams"
              description="Give every department their own AI assistant — sales, support, ops, engineering."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Three steps. Sixty seconds.
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              No servers. No Docker. No terminal. Just click and go.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              step="1"
              title="Sign up"
              description="Create your account in seconds with email or Google."
            />
            <StepCard
              step="2"
              title="Enter your keys"
              description="Add your Anthropic API key and Telegram bot token. We encrypt and store them securely."
            />
            <StepCard
              step="3"
              title="Launch"
              description="Click one button. Your AI assistant is live on Telegram in under 60 seconds."
            />
          </div>
        </div>
      </section>

      {/* Why Business Owners Choose Us */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Built for business owners who take security seriously
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Clock className="h-5 w-5" />}
              title="Get hours back every week"
              description="Client follow-ups, scheduling, customer questions, review responses — your AI handles the busywork so you can focus on growth."
            />
            <ValueCard
              icon={<Shield className="h-5 w-5" />}
              title="Security you can trust"
              description="Isolated containers, encrypted keys, egress-only networking. Your client data and business conversations stay private."
            />
            <ValueCard
              icon={<Zap className="h-5 w-5" />}
              title="Works while you sleep"
              description="Your AI assistant runs 24/7 on AWS. Customers get instant answers at 2am. No server to babysit, no downtime."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Choose the plan that fits your business. Scale up anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-8">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Starter</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight text-white">$49</span>
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">For small teams getting started</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-300">
                <PricingFeature text="Up to 3 AI agent instances" />
                <PricingFeature text="Claude Haiku model" />
                <PricingFeature text="Telegram integration" />
                <PricingFeature text="Isolated containers on AWS" />
                <PricingFeature text="Encrypted API key storage" />
                <PricingFeature text="Email support" />
              </ul>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full text-sm font-medium h-11 px-8 border border-white/20 text-white hover:bg-white/10 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border border-green-500/30 bg-white/[0.05] backdrop-blur-xl p-8 relative shadow-lg shadow-green-500/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-black text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pro</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight text-white">$149</span>
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">For growing teams that need more power</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-300">
                <PricingFeature text="Unlimited AI agent instances" />
                <PricingFeature text="Claude Sonnet & Haiku models" />
                <PricingFeature text="Telegram integration" />
                <PricingFeature text="Isolated containers on AWS" />
                <PricingFeature text="Custom system prompts" />
                <PricingFeature text="Priority support" />
              </ul>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full text-sm font-medium h-11 px-8 bg-green-500 text-black shadow hover:bg-green-400 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            You bring your own Anthropic API key. Usage costs billed directly by Anthropic.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Your business deserves an AI that works as hard as you do
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
            Secure, isolated, always on. Launch your AI assistant today and
            start giving your customers the attention they deserve — 24/7.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full text-base font-medium h-12 px-8 bg-green-500 text-black shadow-lg shadow-green-500/20 hover:bg-green-400 transition-colors gap-2"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 border border-white/10">
              <img src="/molinar-logo.svg" alt="Molinar" className="h-4 w-4" />
            </div>
            <span>Molinar</span>
          </div>
          <p>Built by Molinar</p>
        </div>
      </footer>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 hover:bg-white/[0.08] transition-colors">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-black text-lg font-bold mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="h-4 w-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span>{text}</span>
    </li>
  );
}
