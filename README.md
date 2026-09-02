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
