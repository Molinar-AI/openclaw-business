# OpenClaw Business - CLAUDE.md

## Project Overview
B2B SaaS platform where businesses launch isolated OpenClaw AI agents on AWS ECS Fargate. Dashboard at `business.molinar.ai`, built with Next.js 14 App Router + TypeScript.

## Tech Stack
- **Framework**: Next.js 14 App Router, TypeScript
- **Auth**: Stytch B2B (Discovery flow, magic links, organizations)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (project ID: `crjgcefmdlnbcowppxqc`, region: us-west-1)
- **Container Runtime**: AWS ECS Fargate (FARGATE_SPOT), us-west-2
- **Docker Images**: `coollabsio/openclaw` (agent) + `coollabsio/openclaw-browser` (Chromium sidecar)
- **Secrets**: AWS SSM Parameter Store (SecureString)
- **Hosting**: Vercel

## Build & Dev Commands
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build (also runs type checking)
npm run lint         # ESLint
```

## Project Structure
```
app/
  layout.tsx                    # Root layout with StytchProvider
  login/page.tsx                # Stytch B2B Discovery flow login
  authenticate/page.tsx         # Stytch callback redirect handler
  dashboard/
    layout.tsx                  # Sidebar + auth-protected layout
    page.tsx                    # Instance list (server component)
    instances/
      new/page.tsx              # Create instance wizard
      [id]/page.tsx             # Instance detail (client, realtime + polling)
    settings/page.tsx           # Placeholder
  api/
    auth/callback/route.ts      # Server-side Stytch token exchange
    instances/route.ts          # GET list, POST create
    instances/[id]/route.ts     # GET detail (with ECS sync), PATCH, DELETE
    instances/[id]/start/route.ts  # POST -> ECS RunTask
    instances/[id]/stop/route.ts   # POST -> ECS StopTask
    webhooks/stytch/route.ts    # Org/member sync webhook

components/
  dashboard-sidebar.tsx         # Sidebar nav + logout
  dashboard-header.tsx          # Mobile-only sidebar trigger (md:hidden)
  create-instance-form.tsx      # 3-step wizard with step indicator + BotFather instructions
  instance-card.tsx             # Card for instance grid
  instance-status-badge.tsx     # Status badge with colored dots
  setup-progress.tsx            # Vertical stepper UI for instance setup phases
  stytch-provider.tsx           # Client-side StytchB2BProvider wrapper
  ui/                           # shadcn/ui components

lib/
  auth.ts                       # getAuthenticatedMember() - reads stytch_session cookie
  stytch.ts                     # Server-side Stytch B2B client
  stytch-client.ts              # Browser-side Stytch B2B UI client
  supabase.ts                   # Server-side Supabase client (service role key) — NEVER import in 'use client' files
  supabase-client.ts            # Browser-side Supabase client (anon key, for Realtime) — safe for 'use client' imports
  aws/ecs.ts                    # RunTask, StopTask, DescribeTasks
  aws/ssm.ts                    # PutParameter, GetParameter, DeleteParameter
  aws/cloudwatch.ts             # CloudWatch log parser for setup phase detection

hooks/
  use-instance-realtime.ts      # Combined polling + Supabase Realtime hook
```

## Key Architectural Decisions

### Authentication Flow (Stytch B2B Discovery)
1. User visits `/login` -> Stytch B2B UI component renders
2. Stytch redirects to `/authenticate?token=...&stytch_token_type=discovery`
3. `/authenticate` (client page) forwards to `/api/auth/callback` (server route)
4. Server route exchanges the discovery token, sets `stytch_session` cookie, redirects to `/dashboard`

**CRITICAL**: The Stytch redirect URL must be set to `{domain}/authenticate` in Stytch dashboard. The `/authenticate` page MUST wrap `useSearchParams()` in a `<Suspense>` boundary or Next.js build will fail.

### Stytch Discovery Token Exchange
The Stytch `discovered_organizations` array items have an optional `organization` property. Always use optional chaining or null assertion:
```typescript
const firstOrg = authResp.discovered_organizations[0];
if (firstOrg) {
  // firstOrg.organization may still be undefined per the types
  organization_id: firstOrg.organization!.organization_id,
}
```

### Stytch Domain Allowlist
Stytch requires all domains (including localhost) to be registered in the Stytch dashboard under SDK Configuration > Authorized Domains. If you see "This website has not been registered as an allowed domain", the domain needs to be added there.

### Cookie-Based Auth (Not Stytch Session SDK)
We use a simple `stytch_session` cookie set server-side, NOT the Stytch frontend session SDK. The `middleware.ts` checks for this cookie on `/dashboard/*` routes and redirects to `/login` if missing. The `lib/auth.ts` `getAuthenticatedMember()` function reads this cookie and calls `stytch.sessions.authenticate()` server-side.

### Instance Lifecycle
- Create: POST /api/instances -> stores in Supabase + secrets in SSM, **then auto-starts** (POST to start route before redirecting to detail page)
- Start: POST /api/instances/[id]/start -> reads SSM secrets, calls ECS RunTask, generates ephemeral `OPENCLAW_GATEWAY_TOKEN` (required by entrypoint but not persisted), passes `TELEGRAM_DM_POLICY=open`, sets `setup_phase: 'provisioning'`
- Stop: POST /api/instances/[id]/stop -> calls ECS StopTask, clears setup fields
- Delete: DELETE /api/instances/[id] -> **stops running ECS task first**, then deletes Supabase row + SSM secrets
- Detail page uses combined polling + Supabase Realtime; polls every 3s during setup, 5s when running
- GET /api/instances/[id] parses CloudWatch logs during startup (`status === 'starting'`) to advance `setup_phase`

### Setup Phase Tracking
During startup, `setup_phase` tracks: `provisioning` → `configuring` → `doctor` → `nginx` → `gateway` → `ready`. Phase only advances forward (never regresses). When `ready`, instance transitions to `status='running'` and `setup_phase` is set to `null` (fully done). The stepper is shown whenever `setup_phase` is non-null.

### Telegram DM Policy
Instances use `TELEGRAM_DM_POLICY=open` so the bot accepts all DMs without pairing. This requires `allowFrom: ["*"]` in the config JSON, which can't be set via env vars. The RunTask command override includes a background patcher that polls for the config file (written by `configure`), patches `allowFrom` before `doctor` reads it, then exits. BotFather instructions are shown in creation wizard Step 2.

### SSM Secret Paths
Secrets are stored at: `/openclaw/{org_id}/{instance_id}/{key_name}`
Keys: `anthropic-key`, `telegram-bot-token`

## Database Schema (Supabase)
Three tables: `organizations`, `members`, `openclaw_instances`
- Migration files: `supabase/migrations/001_initial_schema.sql`, `002_add_stripe_billing.sql`, `003_add_setup_phases.sql`, `004_remove_pairing_gateway_columns.sql`
- `openclaw_instances.status` CHECK constraint: stopped | starting | running | error
- `openclaw_instances.setup_phase` CHECK constraint: provisioning | configuring | doctor | nginx | gateway | ready | NULL
- Supabase Realtime enabled on `openclaw_instances` (via `supabase_realtime` publication)

## Common Gotchas

1. **`useSearchParams` requires Suspense**: Any page using `useSearchParams()` must extract that into a child component wrapped in `<Suspense>`. Next.js 14 static generation fails otherwise.

2. **Stytch types are deeply optional**: The Stytch SDK types have many optional fields even on objects that logically should exist (like `discovered_organizations[0].organization`). Use non-null assertions (`!`) after runtime checks.

3. **Mobile sidebar**: The sidebar is hidden on mobile by default. `dashboard-header.tsx` provides a `SidebarTrigger` visible only below md breakpoint (`md:hidden`).

4. **Model name mapping**: Raw model IDs like `claude-sonnet-4-5-20250929` are mapped to friendly names via a `MODEL_NAMES` record in `instance-card.tsx` and the instance detail page. Update both when adding new models.

5. **shadcn/ui Select vs native select**: Always use shadcn `<Select>` component, not native `<select>`. The `onValueChange` prop (not `onChange`) is used for value updates.

6. **CSS theme**: Primary color is indigo (`238 76% 54%`), set in `globals.css` `:root` section. All UI components use `bg-primary`/`text-primary` tokens.

7. **Delete must stop running tasks**: The DELETE route must check for a running ECS task and stop it before cleaning up SSM secrets and the DB row. Always fetch the instance first to check `ecs_task_arn`.

8. **CloudWatch log stream naming**: ECS Fargate log streams follow the pattern `{prefix}/{container-name}/{task-id}`. The task ID is the last segment of the full task ARN (split by `/`). Log group is `/ecs/openclaw-instances`.

9. **Setup phase must only advance forward**: When parsing CloudWatch logs, the phase should never regress (e.g., from `gateway` back to `doctor`). Compare phase indices and only update if the new index is higher. Logs can arrive out of order.

10. **Supabase server and browser clients MUST be in separate files**: `lib/supabase.ts` (server, service role key) and `lib/supabase-client.ts` (browser, anon key). NEVER put both in the same file — when a `'use client'` component imports from a file, Next.js bundles the entire file for the browser. If the server client is in that bundle, it tries to evaluate `process.env.SUPABASE_SERVICE_ROLE_KEY` (undefined client-side) and causes a blank screen / crash. Always import `supabaseClient` from `lib/supabase-client.ts` in client components.

11. **Telegram dmPolicy=open requires config patching**: The `open` policy needs `allowFrom: ["*"]` in the config JSON, but there's no env var for it. The RunTask command override includes a background patcher (python3 one-liner) that patches the config between the `configure` and `doctor` steps of the entrypoint.

12. **`OPENCLAW_GATEWAY_TOKEN` is required by entrypoint**: OpenClaw's entrypoint script refuses to start without this env var. We generate a random token each start (`randomBytes(32).toString('hex')`) but don't persist it — it's ephemeral since we don't call the gateway API.

## AWS Infrastructure
- **ECS Cluster**: `openclaw-production` (FARGATE_SPOT)
- **Task Definition**: `openclaw-agent` (latest revision, 2 vCPU / 4 GB)
- **Security Group**: Egress-only (no inbound required)
- **Task Role**: `openclaw-task`
- **Execution Role**: `openclaw-task-execution`
- **Subnets**: (set via ECS_SUBNETS env var)
- **Account**: (set via AWS credentials), us-west-2
- **Terraform**: In `Molinar-AI/molinar` repo, branch `infra/ecs-migration`, module `infra/modules/openclaw/`
- **AWS CLI Profile**: Use `molinar-personal` for manual AWS operations (e.g. `AWS_PROFILE=molinar-personal aws ecs ...`)
- **CloudWatch Logs**: `/ecs/openclaw-instances` (agent prefix: `openclaw/`, browser prefix: `browser/`)

### ECS Task Definition Details
The task definition `openclaw-agent` has two containers:

1. **`openclaw-agent`** (essential): The main OpenClaw agent
   - Image: `coollabsio/openclaw`
   - Entrypoint: `/app/scripts/entrypoint.sh` (image default)
   - Task def sets `entryPoint: ["sh", "-c"]` + `command` for `/etc/hosts` injection; our RunTask overrides `command` to also run a background config patcher (for dmPolicy=open `allowFrom`)
   - The `/etc/hosts` hack maps `browser` → `127.0.0.1` because Fargate `awsvpc` doesn't support `extraHosts` and the nginx config inside the image references `upstream "browser"` by hostname

2. **`openclaw-browser`** (non-essential): Headless Chromium sidecar for web browsing
   - Image: `coollabsio/openclaw-browser:latest` (based on `lscr.io/linuxserver/chromium`)
   - Exposes port 3000 (KasmVNC web UI) and port 9223 (CDP reverse proxy → Chrome's port 9222)
   - Env: `CHROME_CLI=--remote-debugging-port=9222 --disable-dev-shm-usage`
   - `--disable-dev-shm-usage` is required because Fargate doesn't support `sharedMemorySize`

**Key env vars on agent container**: `BROWSER_CDP_URL=http://browser:9223` (resolves via /etc/hosts to localhost)

### Fargate Limitations (learned the hard way)
- **No `extraHosts`** with `networkMode=awsvpc` — must use `/etc/hosts` injection via entrypoint override
- **No `sharedMemorySize`** — use `--disable-dev-shm-usage` Chrome flag instead
- **No inter-container DNS** — containers in same task share `localhost`, but hostnames don't resolve automatically (unlike Docker Compose service DNS)
- **256 CPU / 512 MB is too small** — OpenClaw OOMs at 512 MB. Minimum viable is 1 vCPU / 2 GB; current config is 2 vCPU / 4 GB to accommodate the browser sidecar

## Stripe Billing Integration
- **Library**: `stripe` npm package, core functions in `lib/stripe.ts`
- **Config**: `lib/stripe-config.ts` — plan definitions with environment-aware price IDs
- **API Routes**:
  - `POST /api/stripe/create-checkout` — Creates Stripe Checkout session (requires auth)
  - `POST /api/stripe/create-portal` — Opens Stripe Customer Portal for billing management
  - `POST /api/webhook/stripe` — Handles Stripe webhook events
- **Components**:
  - `components/pricing.tsx` — Pricing cards with plan features
  - `components/button-checkout.tsx` — Subscribe button that redirects to Stripe Checkout
  - `components/button-portal.tsx` — Manage Billing button that opens Stripe portal
- **Pages**: `/dashboard/billing` — Shows pricing (if no subscription) or current plan + manage button
- **Database**: `organizations` table extended with `customer_id`, `price_id`, `has_access` (migration: `002_add_stripe_billing.sql`)
- **Webhook Events**: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
- **Flow**: Billing is per-organization (B2B). `client_reference_id` is the Stytch org ID, used in webhooks to match organizations.

## Environment Variables (.env.local)
```
STYTCH_PROJECT_ID          # Stytch B2B project ID
STYTCH_SECRET              # Stytch B2B API secret
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN  # Stytch public token (exposed to client)
SUPABASE_URL               # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY  # Supabase service role key (NOT anon key)
AWS_ACCESS_KEY_ID          # IAM credentials for ECS/SSM
AWS_SECRET_ACCESS_KEY
AWS_REGION                 # us-west-2
ECS_CLUSTER_ARN            # Full ARN of openclaw-production cluster
ECS_TASK_DEFINITION        # Task definition name (openclaw-agent)
ECS_SUBNETS                # Comma-separated subnet IDs
ECS_SECURITY_GROUP         # Security group ID for tasks
STRIPE_SECRET_KEY          # Stripe API secret key
STRIPE_WEBHOOK_SECRET      # Stripe webhook signing secret
NEXT_PUBLIC_AMPLITUDE_API_KEY  # Amplitude project API key (public, client-side)
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL (public, for Realtime)
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key (public, for Realtime)
```

## Amplitude Analytics
- **Library**: `@amplitude/analytics-browser` + `@amplitude/plugin-session-replay-browser`
- **Provider**: `components/amplitude-provider.tsx` — client component, initializes SDK with session replay plugin (100% sample rate)
- **Init**: Wrapped in root `layout.tsx` via `<AmplitudeProvider>`, autocapture enabled (page views, sessions, form interactions)
- **Session Replay**: Enabled via `sessionReplayPlugin({ sampleRate: 1 })` — captures all sessions
- **Project ID**: 777864
