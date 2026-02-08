import Link from 'next/link';
import { getAuthenticatedMember } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Bot,
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
  AlertTriangle,
  ChevronDown,
  Quote,
} from 'lucide-react';

export default async function LandingPage() {
  const auth = await getAuthenticatedMember();
  if (auth) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg">Molinar Business</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="#use-cases"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Use Cases
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm text-indigo-700 mb-8">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              <span>Secure &middot; Isolated &middot; Enterprise-grade AWS infrastructure</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Your AI employee.{' '}
              <br className="hidden sm:block" />
              Secure, isolated, always on.{' '}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop babysitting servers at 3am. We deploy the world&apos;s most popular
              open-source AI agent in your own isolated container on AWS. Handle clients,
              customers, and daily ops through Telegram — without exposing your business data.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2 w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted-foreground">
                No credit card required &middot; Plans from $49/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span><strong className="text-foreground">176K+</strong> GitHub Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span><strong className="text-foreground">Isolated</strong> Containers</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span><strong className="text-foreground">Encrypted</strong> API Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Powered by <strong className="text-foreground">AWS</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Differentiator */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your business deserves better than shared AI
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Most AI tools share infrastructure between users. Molinar Business gives
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Every business owner needs an AI employee
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
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

      {/* The 6-Agent Stack */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Not one assistant. An entire team.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The top 1% of AI-powered businesses don&apos;t run one agent — they run six.
              Each one specialized, working 24/7, feeding insights to the next.
              We call it the 6-Agent Stack.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              emoji="🔍"
              name="Scout"
              role="Research & Trends"
              description="Monitors your market every few hours. Finds what competitors are doing, what customers are saying, and what content is working."
            />
            <AgentCard
              emoji="✍️"
              name="Writer"
              role="Content Creation"
              description="Drafts posts, emails, and campaigns in your brand voice — based on real data from Scout, not guesswork."
            />
            <AgentCard
              emoji="📡"
              name="Poster"
              role="Distribution"
              description="Publishes approved content across platforms at optimal times. Spaces posts, adds hashtags, handles media."
            />
            <AgentCard
              emoji="💬"
              name="Engage"
              role="Community & Replies"
              description="Replies to mentions, joins relevant conversations, answers DMs. Builds relationships while you sleep."
            />
            <AgentCard
              emoji="📊"
              name="Analyst"
              role="Metrics & Optimization"
              description="Tracks what's working, reports daily insights, and feeds winning patterns back to Writer. Your playbook gets smarter every day."
            />
            <AgentCard
              emoji="🎯"
              name="Hunter"
              role="Lead Gen & Sales"
              description="Finds people struggling with problems you solve. Qualifies prospects, drafts outreach, builds your pipeline automatically."
            />
          </div>
          <div className="mt-12 text-center">
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Most founders stop at building the product and wonder why nobody notices.{' '}
              <strong className="text-foreground">The 6-Agent Stack runs your entire go-to-market — research, content, distribution, engagement, analytics, and sales — on autopilot.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Sixty seconds.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
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
      <section id="pricing" className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your business. Scale up anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="rounded-xl border bg-white shadow p-8">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Starter</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">$49</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For small teams getting started</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
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
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-primary text-primary hover:bg-primary/5 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Pro */}
            <div className="rounded-xl border-2 border-primary bg-white shadow-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pro</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold tracking-tight">$149</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">For growing teams that need more power</p>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
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
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            You bring your own Anthropic API key. Usage costs billed directly by Anthropic.
          </p>
        </div>
      </section>

      {/* Why Not DIY */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              &ldquo;Can&apos;t I just set this up myself?&rdquo;
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              You can. Most people try. Here&apos;s what they discover.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Setup takes hours</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                VPS, SSH, Docker, Tailscale, SSL certs, firewall rules. One wrong config and your agent crashes at 3am.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Security is your problem</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Shared VPS hosts are already getting exploited. Your client data on a $9 server with no isolation? That&apos;s a liability.
              </p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Maintenance never ends</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Updates break things. Cron jobs fail silently. SSH tunnels drop. You wanted an AI employee, not a second job.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-foreground">
              We handle all of this. You just click &ldquo;Launch.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 sm:py-20 bg-muted/30 border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white border p-6">
              <Quote className="h-5 w-5 text-primary/40 mb-3" />
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;It designed my entire go-to-market strategy, manages my PR pipeline, and replaced what would&apos;ve been a 5-person team.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">— OpenClaw user running on a single machine</p>
            </div>
            <div className="rounded-xl bg-white border p-6">
              <Quote className="h-5 w-5 text-primary/40 mb-3" />
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;I fully autonomized money making. I have not physically touched any marketing for my apps for a week. Money is coming in.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">— AI-first founder, 29 days autonomous</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-6">
            <FaqItem
              question="Do I need technical knowledge?"
              answer="No. If you can create a Telegram bot (we walk you through it) and paste an API key, you're good. No servers, no Docker, no terminal."
            />
            <FaqItem
              question="What are the API costs on top of the subscription?"
              answer="You bring your own Anthropic API key (BYOK). API usage is billed directly by Anthropic — typically $5-50/month depending on how much your agent works. We never mark up your API costs."
            />
            <FaqItem
              question="Is my business data safe?"
              answer="Each instance runs in its own isolated container on AWS Fargate with egress-only networking. Your API keys are encrypted with AWS SSM. We never access your conversations or data."
            />
            <FaqItem
              question="Can I use models other than Claude?"
              answer="We currently support Claude Haiku (Starter) and Claude Sonnet + Haiku (Pro). Support for GPT, Gemini, and open-source models is coming soon."
            />
            <FaqItem
              question="What happens if I cancel?"
              answer="Your instances stop immediately. Your data is never retained after cancellation. No lock-in, no exit fees."
            />
            <FaqItem
              question="How is this different from ChatGPT or Claude.ai?"
              answer="ChatGPT and Claude are chat interfaces. Molinar Business is an always-on AI agent that runs 24/7, connects to Telegram, has persistent memory, and can take actions autonomously — like a real employee."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your business deserves an AI that works as hard as you do
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Secure, isolated, always on. Launch your AI assistant today and
            start giving your customers the attention they deserve — 24/7.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors gap-2"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-primary-foreground">
              <Bot className="h-3 w-3" />
            </div>
            <span>Molinar Business</span>
          </div>
          <p>Built by Molinar AI</p>
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
    <div className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
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
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
        {step}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
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
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
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
    <div className="rounded-xl border bg-white p-6">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function AgentCard({
  emoji,
  name,
  role,
  description,
}: {
  emoji: string;
  name: string;
  role: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border bg-white p-6 cursor-pointer">
      <summary className="flex items-center justify-between font-semibold text-foreground list-none">
        {question}
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </details>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span>{text}</span>
    </li>
  );
}
