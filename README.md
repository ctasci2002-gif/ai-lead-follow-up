# ai-lead-follow-up
AI-powered lead follow-up automation SaaS

## Environment variables

Set these in `.env.local` (never commit this file):

| Variable | Used for | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Claude lead scoring/message generation | server-only |
| `ANTHROPIC_MODEL` | Claude model id | e.g. `claude-sonnet-5` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | safe to expose client-side |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | safe to expose client-side, scoped by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Daily reminder job (reads across all users, bypassing RLS) | **server-only, never expose to the client** |
| `RESEND_API_KEY` | Sending reminder emails via [Resend](https://resend.com) | server-only |
| `EMAIL_FROM` | Optional sender address, e.g. `AI Lead Follow-Up <you@yourdomain.com>` | defaults to Resend's sandbox sender `onboarding@resend.dev` if unset |
| `CRON_SECRET` | Shared secret that protects `/api/send-daily-reminders` from being triggered by anyone else | any random string |
| `TAVILY_API_KEY` | Web search for AI Prospect Finder ([tavily.com](https://tavily.com)) | server-only |

## Daily follow-up reminder emails

`POST /api/send-daily-reminders` finds every lead across all users whose `next_follow_up_at` is today or earlier, groups them by user, and emails each user a digest of only their own due leads (looked up via Supabase Admin, independent of RLS — isolation is enforced in application code by grouping on `user_id` before sending).

The route is protected by a shared secret and does nothing without it.

**Test it manually:**

```bash
curl -X POST http://localhost:3000/api/send-daily-reminders \
  -H "x-cron-secret: <your CRON_SECRET value>"
```

Response is a JSON summary, e.g. `{"usersWithDueLeads":1,"emailsSent":1,"failures":[]}`. A non-empty `failures` array (per user id) means the digest wasn't actually delivered to that user — check `error` for why (e.g. Resend's sandbox mode only delivers to the account's own signup email until a sending domain is verified at resend.com/domains).

**Running it daily:** this route doesn't schedule itself — point any scheduler (Vercel Cron, a GitHub Actions cron workflow, an external uptime/cron pinger, etc.) at it once a day with the `x-cron-secret` header set to `CRON_SECRET`.

## AI Prospect Finder

`/prospects` (protected, signed-in users only) lets a user describe a target company profile (location, industry, company size, or free text) and get back AI-scored, AI-analyzed prospect companies.

Flow: [Tavily](https://tavily.com) search → dedupe by domain against the user's existing `prospects` and `leads` → **one** batched Claude call analyzes every candidate at once (not one call per company) and returns a score, reason, and a personalized outreach message per company, built only from what the search results actually say. Results are stored per-user in a new `prospects` table (RLS-scoped, same pattern as `leads`) and can be converted into a real lead with one click ("Lead'e Kaydet"), which just inserts into the existing `leads` table via the normal browser client — there's no separate/parallel CRM.

A server-side daily quota (20 prospects/user/day, counted from the `prospects` table) is enforced in `app/api/prospects/search/route.ts` before any search or Claude call is made, so it can't be bypassed from the client and doesn't burn API budget once exhausted.

Run the `prospects` table SQL from `supabase/schema.sql` once in the Supabase SQL editor before using this feature.
