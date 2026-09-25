# AWS SES Email Function Guide

[日本語 (Japanese)](ses-email-guide.ja.md)

This document explains how the tarophotos.com contact form sends email with AWS SES (Simple Email Service).

> **Last Updated**: 2026-09-23
>
> Production runs on **Google Cloud Run** (not AWS Amplify; Amplify was deleted on 2026-09-01). SES is called with **keyless federation** (Google OIDC → AWS `AssumeRoleWithWebIdentity`); no static IAM keys are used.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Setup](#-setup)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [SES Sandbox Mode](#-ses-sandbox-mode)
- [Pricing](#-pricing)
- [Troubleshooting](#-troubleshooting)

---

## 📋 Overview

### Features

- Server-side email sending with a **Next.js Route Handler** (`POST /api/contact`)
- SES integration with **AWS SDK v3** (`@aws-sdk/client-ses` / `SendEmailCommand`)
- **Keyless authentication** in production: the Cloud Run runtime service account's Google ID token is exchanged for AWS credentials (`fromWebToken` in `@aws-sdk/credential-providers`)
- Required-field / email-format validation driven by `apps/web/docs/forms/contact_form_fields.json`
- Spam guard: honeypot, time gate (3 s) and per-IP rate limit (5 requests / 10 min, in-memory per instance)
- Two HTML + text emails per submission: a notification to `SES_TO_EMAIL` (Reply-To = submitter) and an auto-response to the submitter

### Architecture

```
┌──────────────┐ POST ┌─────────────────────────┐ ID token ┌──────────────────┐
│  Contact     │──────│  Next.js on Cloud Run   │──────────│  GCP metadata    │
│  Form        │      │  /api/contact           │          │  server          │
│  (Client)    │      │  (runtime SA)           │          └──────────────────┘
└──────────────┘      └─────────────────────────┘
                                   │ AssumeRoleWithWebIdentity
                                   ▼
                      ┌─────────────────────────┐          ┌──────────────────┐
                      │  AWS STS                │─────────▶│  AWS SES         │
                      │  role:                  │ SendEmail│  Email           │
                      │  tarophotos-ses-        │          │                  │
                      │  federation             │          │                  │
                      └─────────────────────────┘          └──────────────────┘
```

1. The runtime service account (`tarophotos-runtime@iwillink-web.iam.gserviceaccount.com`) fetches a Google-signed ID token (audience `sts.amazonaws.com`) from the metadata server.
2. The token is used to call `AssumeRoleWithWebIdentity` on the role set in `SES_AWS_ROLE_ARN` (`tarophotos-ses-federation`).
3. The temporary credentials call `ses:SendEmail`.

The AWS-side role is recorded in [willink-infra `docs/aws-federation`](https://github.com/i-Willink-LLC/willink-infra/tree/main/docs/aws-federation/tarophotos-ses-federation).

### How credentials are resolved

`getSesClient()` in `apps/web/src/app/api/_lib/process-form-submission.ts` picks credentials in this order:

| Order | Condition | Credentials |
|-------|-----------|-------------|
| 1 | `SES_AWS_ROLE_ARN` is set | Federation via the GCP metadata server (works only on GCP, e.g. Cloud Run) |
| 2 | `SES_AWS_ACCESS_KEY_ID` / `SES_AWS_SECRET_ACCESS_KEY` are set | Static keys — backward-compatibility code left from the Amplify era. **Do not use.** |
| 3 | Neither | AWS SDK default credential provider chain (e.g. an SSO profile via `AWS_PROFILE`) |

---

## 🔧 Setup

### Prerequisites

| Item | Required | Description |
|------|----------|-------------|
| AWS Account | ✅ | To use SES |
| Verified SES identity | ✅ | `SES_FROM_EMAIL` (or its domain) must be verified in SES |
| Federation role | ✅ (production) | `tarophotos-ses-federation`, trusted for the Cloud Run runtime SA (managed in willink-infra) |
| AWS CLI with SSO | Local sending only | Temporary credentials via `aws sso login` |

> [!IMPORTANT]
> **Domain Verification vs Email Address Verification**
>
> - **Email Address Verification**: Only specific email addresses can be used as sender
> - **Domain Verification**: All email addresses under the domain can be used as sender (Recommended)

### 1. Environment Variable Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `SES_FROM_EMAIL` | ✅ | Sender address. Falls back to `CONTACT_FROM_EMAIL`. If both are missing, `/api/contact` returns 500 |
| `SES_TO_EMAIL` | ✅ | Notification recipient. Falls back to `CONTACT_NOTIFICATION_EMAIL`. If both are missing, `/api/contact` returns 500 |
| `SES_REGION` | - | SES region (default: `ap-northeast-1`) |
| `SES_AWS_ROLE_ARN` | Production only | Federation role ARN. **Do not set locally** (there is no GCP metadata server) |

#### Local Development Environment

There is no "skip sending" or log-only mode: `/api/contact` always calls SES.

- **UI-only check**: leave `SES_FROM_EMAIL` unset. Submissions return 500 (`Email delivery is not configured.`) and nothing is sent.
- **Actually sending**: create `apps/web/.env.local` (see `apps/web/.env.local.example`) with the SES addresses, and run the dev server with a temporary-credential AWS profile. Do not put static access keys in the file.

```bash
# apps/web/.env.local
SES_FROM_EMAIL=noreply@yourdomain.com
SES_TO_EMAIL=contact@yourdomain.com
# SES_REGION=ap-northeast-1
# Do NOT set SES_AWS_ROLE_ARN locally
```

```bash
aws sso login --profile your-profile
AWS_PROFILE=your-profile pnpm dev
```

The profile needs `ses:SendEmail` for the sender identity, and SES sandbox restrictions apply (see [SES Sandbox Mode](#-ses-sandbox-mode)).

#### Production Environment (Cloud Run)

Runtime environment variables are managed as GitHub **repository variables** (not secrets): **Settings → Secrets and variables → Actions → Variables**.

| Repository variable | Description |
|---------------------|-------------|
| `SES_REGION` | SES region |
| `SES_FROM_EMAIL` | Sender address |
| `SES_TO_EMAIL` | Notification recipient |
| `SES_AWS_ROLE_ARN` | ARN of `tarophotos-ses-federation` |

`.github/workflows/deploy-gcp.yml` passes them to Cloud Run with `gcloud run deploy --update-env-vars`, so a change takes effect on the next deploy (push to `main` or a manual run of the workflow).

> ⚠️ If `SES_AWS_ROLE_ARN` is unset, the deploy **fails closed** (it never silently falls back to static keys).

### 2. SES Domain Verification (Recommended)

Domain verification allows sending from all email addresses under that domain.

#### Method A: CDK (`infra/`)

`infra/lib/ses-stack.ts` defines the SES identity (`SesStack`) and, if `ROUTE53_HOSTED_ZONE_ID` is set, creates the DKIM CNAME records in Route53. It is **not applied from CI**, and currently must not be deployed at all (see the warning below).

> [!WARNING]
> The stack name `SesStack` collides with the i-willink.com stack in the same AWS account/region, which holds that site's production SES identity (see the comment at the end of `.github/workflows/ci.yml`). A `cdk deploy` would overwrite it. Do not deploy `SesStack` until the name collision is resolved; until then, use Method B or the console/CLI steps.

```bash
# infra/.env (see infra/.env.example)
SES_DOMAIN=yourdomain.com
ROUTE53_HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
```

```bash
cd infra
npx cdk synth
```

Without `ROUTE53_HOSTED_ZONE_ID`, the stack outputs 3 DKIM tokens instead, to be added manually (Method B, step 3).

#### Method B: Manual DNS Record Setup

1. **Create the domain identity** (AWS Console → SES → Verified identities → Create identity → Domain).

2. **Check the 3 DKIM tokens** shown for the identity.

3. **Add CNAME Records in DNS**

   The `tarophotos.com` zone is on Route53. Add CNAME records for each token in the following format:

   | Name | Type | Value |
   |------|------|-------|
   | `{token1}._domainkey.yourdomain.com` | CNAME | `{token1}.dkim.amazonses.com` |
   | `{token2}._domainkey.yourdomain.com` | CNAME | `{token2}.dkim.amazonses.com` |
   | `{token3}._domainkey.yourdomain.com` | CNAME | `{token3}.dkim.amazonses.com` |

4. **Verify Completion**
   ```bash
   aws sesv2 get-email-identity --email-identity yourdomain.com --query "DkimAttributes.Status"
   # Complete if "SUCCESS" is displayed
   ```

### 3. SES Email Address Verification (Simple)

To verify only specific email addresses:

#### Verify via AWS Console

1. AWS Console → SES → Verified identities
2. "Create identity" → Select "Email address"
3. Enter sender email address
4. Click the link in the verification email sent

#### Verify via CLI

```bash
aws sesv2 create-email-identity --email-identity noreply@yourdomain.com --region ap-northeast-1
# Click the verification link in the received email
```

---

## 📧 Usage

### Contact Page

- **URL**: `/contact`
- **Page**: `apps/web/src/app/contact/page.tsx`
- **Form component**: `apps/web/src/components/contact/ContactForm.tsx`

```bash
pnpm dev
# Access http://localhost:3000/contact
```

### Adding Another Form

`processFormSubmission()` in `apps/web/src/app/api/_lib/process-form-submission.ts` is shared. A new Route Handler calls it with its own `formKey`, `notificationEmail`, `fieldDefinitions`, `subject` and optional `autoResponse` (see `apps/web/src/app/api/contact/route.ts` for a complete example).

---

## 📖 API Reference

### POST /api/contact

API endpoint for sending email from the contact form.

#### Request

```json
{
  "fields": {
    "category": "General Inquiry",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "",
    "message": "Content of the inquiry here.",
    "agree": "同意する"
  },
  "website": "",
  "elapsedMs": 8000
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields` | object | ✅ | Form values. Keys, labels and required flags come from `apps/web/docs/forms/contact_form_fields.json` (`category` / `name` / `email` / `message` / `agree` are required; `email` must be a valid address) |
| `website` | string | - | Honeypot. Must be empty |
| `elapsedMs` | number | ✅ | Milliseconds from form mount to submit. Missing or under 3000 is treated as a bot |

> `website` and `elapsedMs` are sent at the top level (not in `fields`) so they never appear in the notification email.

#### Response

All responses are JSON with a `message` field.

| Status | `message` | Meaning |
|--------|-----------|---------|
| 200 | `Contact request received.` | Sent. **Also returned when the spam guard silently drops the request** (honeypot / time gate) |
| 400 | `Invalid JSON body` | Body is not JSON |
| 400 | `Missing required field: <label>` | Required field empty |
| 400 | `Invalid email format: <label>` | Invalid email |
| 429 | `Too many requests. Please try again later.` | More than 5 requests from the same IP within 10 minutes |
| 500 | `Email delivery is not configured.` | `SES_FROM_EMAIL` is not set |
| 500 | `Contact notification email is not configured.` | `SES_TO_EMAIL` is not set |
| 500 | `Email delivery failed: ...` / `Failed to send email.` | SES / credential error (details in `error`) |

---

## ⚠️ SES Sandbox Mode

### What is Sandbox Mode

**New AWS accounts operate SES in Sandbox Mode.**

Sandbox Mode has the following limitations:

| Limitation | Content |
|------------|---------|
| Recipients | **Only verified email addresses** can be recipients |
| Volume | Up to 200 emails/day |
| Rate | Up to 1 email/sec |

> In sandbox mode the auto-response to the submitter fails unless the submitter's address is verified.

### How to Move out of Sandbox

To use email function in production, you need to request production access.

1. AWS Console → SES → Account dashboard
2. Click "Request production access"
3. Enter information:
   - **Mail type**: Transactional
   - **Website URL**: Your website URL
   - **Use case description**: Explain purpose
     - Ex: "Used for notification emails from contact form"
4. Submit and wait for AWS approval (Usually 24-48 hours)

### Handling during Development

Development and testing are possible in Sandbox Mode:

1. **Verify Sender Email Address**
   - SES → Verified identities → Create identity
   - Click link in confirmation email

2. **Verify Recipient Email Address**
   - Validation required for recipient address during dev
   - Validate in SES similarly

3. **Test between verified email addresses**
   - Sending possible if both sender/recipient are verified

---

## 💰 Pricing

AWS SES pricing is very low cost. See official pricing page for details.

📌 **[AWS SES Pricing](https://aws.amazon.com/ses/pricing/)**

### Pricing Overview

| Item | Price |
|------|-------|
| Outbound email | $0.10/1,000 emails |
| Attachments | $0.12/GB |

> **Note**: Above are estimates. Free tier conditions change over time; please check the [Official Pricing Page](https://aws.amazon.com/ses/pricing/) for the latest pricing.

### Cost Example

One contact submission sends **2 emails** (notification + auto-response).

| Use Case | Monthly Submissions | Monthly Emails | Estimated Cost |
|----------|---------------------|----------------|----------------|
| Typical | 50 | 100 | Approx $0.01 |
| Busy | 2,500 | 5,000 | Approx $0.50 |

---

## 🔍 Troubleshooting

### Common Errors

#### "Email delivery is not configured."

**Cause**: `SES_FROM_EMAIL` (and `CONTACT_FROM_EMAIL`) not set

**Solution**:
1. Local: set it in `apps/web/.env.local` and restart `pnpm dev`
2. Production: check the `SES_FROM_EMAIL` repository variable, then re-deploy

#### "Contact notification email is not configured."

**Cause**: `SES_TO_EMAIL` (and `CONTACT_NOTIFICATION_EMAIL`) not set

**Solution**: Same as above, for `SES_TO_EMAIL`

#### "Email delivery failed: Address not verified or spam detected."

**Cause**: SES `MessageRejected` — sender (or, in sandbox, recipient) not verified

**Solution**:
1. Verify the identity in the SES console
2. Check `SES_FROM_EMAIL`
3. In sandbox, verify the recipient or request production access

#### "Email delivery failed: Access denied. Check IAM permissions."

**Cause**: The assumed role (or local profile) lacks `ses:SendEmail` for the sender identity

**Solution**: Check the permissions of `tarophotos-ses-federation` in willink-infra (locally: the SSO profile's permissions)

#### "Failed to send email." (credential errors)

| `error` / log content | Cause | Solution |
|-----------------------|-------|----------|
| `GCP metadata identity token fetch failed: ...` or a fetch error to `metadata.google.internal` | `SES_AWS_ROLE_ARN` is set outside GCP (e.g. locally), or the runtime SA cannot mint ID tokens | Remove `SES_AWS_ROLE_ARN` locally; in production check the Cloud Run runtime SA |
| `Not authorized to perform sts:AssumeRoleWithWebIdentity` etc. | Trust policy of `tarophotos-ses-federation` does not match the token (audience / subject) | Check the role in willink-infra `docs/aws-federation` |
| `Could not load credentials from any providers` | Local: no role ARN and no AWS profile/credentials | `aws sso login` and run with `AWS_PROFILE` |

#### The form shows success but no email arrives

**Cause**: The spam guard dropped the request silently (it returns 200 on purpose)

**Solution**: Look for `[forms:contact] submission dropped: honeypot` or `too_fast` in the server logs. When calling the API directly, send `elapsedMs` of 3000 or more.

### Checking Logs

Successful sends log `[forms:contact] email sent to ...`; failures log `contact email send failed` and `SES Error Name: ...`.

```bash
# Development
pnpm dev
# Check error message in console

# Production (Cloud Run)
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="tarophotos"' \
  --project=iwillink-web --limit=50
# Or: Google Cloud Console → Cloud Run → tarophotos → Logs
```

---

## 📁 Related Files

| File | Description |
|------|-------------|
| `apps/web/src/app/api/_lib/process-form-submission.ts` | SES client, credential resolution, validation and email building |
| `apps/web/src/app/api/_lib/spam-guard.ts` | Honeypot / time gate / rate limit |
| `apps/web/src/app/api/contact/route.ts` | Contact API Endpoint |
| `apps/web/src/components/contact/ContactForm.tsx` | Contact form (client) |
| `apps/web/docs/forms/contact_form_fields.json` | Contact form field definitions |
| `apps/web/.env.local.example` | Local env variable template |
| `.github/workflows/deploy-gcp.yml` | Wires repository variables into Cloud Run |
| `infra/lib/ses-stack.ts` | SES identity CDK definition (not deployed; stack name collision) |
| `infra/.env.example` | Infrastructure env variable template |
