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

const solidButtonStyle = {
  background: '#ffffff',
  color: '#000000',
};

export default async function LandingPage() {
  const auth = await getAuthenticatedMember();
  if (auth) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/10">
              <img src="/molinar-logo.svg" alt="Molinar" className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-white">Molinar</span>
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
            <a
              href="https://discord.gg/khn8zNepXC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Discord
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full text-sm font-semibold h-9 px-5 py-2 text-white shadow transition-transform hover:scale-105"
              style={solidButtonStyle}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Video background */}
        <video
          src="/multiverse.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-black/70" style={{ zIndex: 1 }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 w-full" style={{ zIndex: 2 }}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-sm text-gray-300 mb-8 whitespace-nowrap backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-white flex-shrink-0" />
              <span className="hidden sm:inline">Powered by OpenClaw &middot; Secure &middot; Isolated &middot; AWS</span>
              <span className="sm:hidden">Powered by OpenClaw &middot; AWS</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              The open source{' '}
              <br className="hidden sm:block" />
              alternative to{' '}
              ai.com
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Deploy your own AI agent in 3 steps. Each agent runs in its own
              isolated container on AWS. Open source, BYOK, and your keys never touch our database.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full text-base font-semibold h-14 px-10 text-white shadow-2xl transition-transform hover:scale-105 gap-2 w-full sm:w-auto"
                style={solidButtonStyle}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="text-sm text-gray-500">
                No credit card required &middot; Plans from $49/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-white/5 bg-black">
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
      <section className="py-24 sm:py-32 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Your business deserves better than shared AI
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
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
      <section id="use-cases" className="py-24 sm:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Every business owner needs an AI employee
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
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

      {/* How It Works — Full-bleed gradient */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #134e4a 70%, #0f172a 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)',
            backgroundSize: '300% 300%',
            animation: 'shimmer 6s ease infinite',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Three steps. Sixty seconds.
            </h2>
            <p className="mt-6 text-lg text-gray-300">
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
      <section className="py-24 sm:py-32 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
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
      <section id="pricing" className="py-24 sm:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Choose the plan that fits your business. Scale up anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Starter</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-white">$49</span>
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
                  className="inline-flex items-center justify-center rounded-full text-sm font-medium h-11 px-8 border border-white/20 text-white hover:bg-white/10 transition-all duration-300 w-full gap-2"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Pro */}
            <div className="rounded-3xl border-2 border-transparent bg-white/5 backdrop-blur-xl p-8 relative hover:-translate-y-1 transition-all duration-300" style={{ borderImage: 'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82) 1' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className="text-white text-xs font-semibold px-4 py-1 rounded-full"
                  style={solidButtonStyle}
                >
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pro</p>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-white">$149</span>
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
                  className="inline-flex items-center justify-center rounded-full text-sm font-semibold h-11 px-8 text-white shadow transition-transform hover:scale-105 w-full gap-2"
                  style={solidButtonStyle}
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
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #2dd4bf 0%, #c084fc 100%)',
            clipPath: 'polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Your business deserves an AI that works as hard as you do
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
            Secure, isolated, always on. Launch your AI assistant today and
            start giving your customers the attention they deserve — 24/7.
          </p>
          <div className="mt-12">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full text-base font-semibold h-14 px-10 text-white shadow-2xl transition-transform hover:scale-105 gap-2"
              style={solidButtonStyle}
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 border border-white/10">
              <img src="/molinar-logo.svg" alt="Molinar" className="h-4 w-4" />
            </div>
            <span>Molinar</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://discord.gg/khn8zNepXC" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p>Built on <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">OpenClaw</a></p>
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
    <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/[0.1] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
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
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white text-xl font-bold mb-6 shadow-lg"
        style={{
          background:
            'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)',
          backgroundSize: '300% 300%',
          animation: 'shimmer 3s ease infinite',
        }}
      >
        {step}
      </div>
      <h3 className="font-bold text-xl text-white">{title}</h3>
      <p className="mt-3 text-sm text-gray-300 leading-relaxed">{description}</p>
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
    <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 text-center hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-white">{title}</h3>
      <p className="mt-3 text-sm text-gray-400 leading-relaxed">{description}</p>
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
    <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/[0.1] transition-all duration-300 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <svg className="h-4 w-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span>{text}</span>
    </li>
  );
}
