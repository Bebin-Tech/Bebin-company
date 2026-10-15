# Bebin Tech on Vercel

Complete Next.js application with a Turso SQLite database, private Vercel Blob image storage, and database-backed administrator sessions. The public interface has no admin navigation. The original Cloudflare deployment remains separate.

## Hosting resources

- Vercel project: `bebin-tech-projects`
- Turso database: `bebin-tech-projects-db`, Mumbai region, existing Starter plan
- Private Blob store: `bebin-tech-projects-images`, Mumbai region
- Blob authorization uses rotating Vercel OIDC credentials. No permanent Blob read-write token is required.

## Administrator login

The dashboard is at `/admin`. Sign in using the account in the private, deployment-excluded `outputs/initial-admin-login.txt` file. The password is randomly generated; only its salted scrypt hash is configured on Vercel. Sessions are random 256-bit tokens in secure HttpOnly SameSite cookies. Only token hashes are persisted in the database. Session validity also depends on the configured password hash, so rotating the hash invalidates existing sessions. Sign-in attempts are rate limited.

Keep credentials out of source control and deployment archives. The output file is excluded by both `.gitignore` and `.vercelignore`. Change the configured password hash through the Vercel project environment settings when rotating credentials.

## Development

1. `npm ci`
2. Use the Vercel CLI to pull Development environment variables into `.env.local`.
3. `node scripts/local-admin-env.mjs` restores the separately saved admin hash after an env pull.
4. `npm run db:migrate` applies unapplied, checksum-verified schema migrations. No catalogue data is seeded by migrations.
5. `npm run dev`

Production and Preview share the newly provisioned Turso database; tests and preview writes must be clearly identified and cleaned up. The first authenticated dashboard visit initializes the confirmed services and technologies. Projects and completed-product listings remain empty until the owner supplies their real catalogue.

## Validation & deployment

`npm run check` and `npm run build` validate types and the production app. `node --env-file=.env.local tests/integration.mjs` exercises authentication, persistence, CRUD, enquiry/order requests, image uploads, and session revocation against a running local app. It removes the records it creates. Admin credentials are never printed.

Use the already linked Vercel project and deploy with the authenticated CLI. Never include `outputs`, `.env*`, database files, or test fixtures in deployments. Schema migrations are applied independently before deployment; production runtime does not mutate schema.

The Vercel deployment uses the same logo, founder photo, content, and hidden public admin navigation as the original site. Cloudflare-specific identity headers and storage bindings are not used in this copy.

## Software store (October 2026)

`/projects` now reads real Shopify products tagged `bebin-software`. Shopify is the source of truth for product publication, images, descriptions, tags, variant availability, and price. Add `department:IT`, `department:BCA`, `department:B.Sc Computer Science`, `department:AI & Data Science`, etc. for filters, and `technology:Python` etc. for technology chips. The project detail URL uses the Shopify handle. Do not add unrelated physical products to this tag.

The seven software products are published in Shopify, which remains the catalogue source. Checkout uses personal UPI with manual bank confirmation, not Shopify payment checkout. Server-side prices are snapshotted when an order is created. Generated QR codes include the recipient, INR amount and unique order reference; a personal UPI app may allow amount edits, so the administrator must check the exact credit independently.

At /admin/digital, authenticated administrators enter the verified 12-digit bank UPI reference and confirm receipt before approval. Approval transactionally creates a private, seven-day ZIP delivery and queues a download email. Duplicate approvals are idempotent; bank references cannot be reused. Rejected or pending orders cannot download. Order status uses a random bearer secret retained in sessionStorage; reload customers can use Check previous order in the same tab. No paid ZIPs or customer secrets are public.

Gmail delivery uses server-only GMAIL_USER and GMAIL_APP_PASSWORD. Configure a Gmail app password, not a normal account password. The ignored local outputs/gmail-delivery.env is the private handoff file and must never be committed. Without SMTP credentials, approved downloads work but the email remains pending_email. Authenticated admins can retry emails after credentials are configured; SMTP failures show email_failed. Vercel needs redeployment after env changes. Production Gmail SMTP delivery and the emailed private download URL were verified using an owner-only, labelled zero-value QA order. Gmail accepted the email; inbox placement is not guaranteed.

Validation: tests/manual-upi.mjs uses an isolated SQLite database, local Next server and temporary private Blob ZIP. It checks server-owned prices, UPI QR data, authorization, pending locks, approval, exact ZIP bytes, duplicate approval, reused bank references, rejected orders and pending-email behavior. No real payment is made. Requires the local paid ZIP fixture and storage credentials; paid source ZIPs remain outside Git.


Website redesign (15 October 2026): shared responsive visual system, new server-rendered homepage with the live Shopify catalogue, reusable illustrated software cards, searchable/filterable store, improved UPI checkout, payment review workspace and admin UI. Technology links now resolve into store searches. Browser storage and non-JSON/network failures render helpful messages. Expired/revoked delivery links remain unavailable; expired links are not emailed. Approval/rejection is transactionally consistent. Interrupted SMTP sends can be retried after a five-minute lease. Migration 0004 adds the attempt timestamp without changing customer data.

Verification: production build and TypeScript pass; production dependency audit has zero known vulnerabilities at the time of this release. Isolated regression tests cover manual UPI price/QR generation, admin auth, pending/rejected/expired download locks, duplicate references, concurrent approve/reject consistency, ZIP byte equality, signed webhook protection, persistent contact enquiries and authenticated content create/edit. Browser checks cover mobile navigation, store search/department/sort, technology-to-project links, admin login, all public page layouts and no horizontal overflow at 390px.


Payment screenshot approval (15 October 2026): checkout collects the customer name, phone and delivery email, with server-owned project price. Payment requests move pending → submitted only after a private, bounded PNG/JPEG/WebP upload is decoded and re-encoded as JPEG. Only authenticated administrators can stream screenshots; raw Blob URLs are not sent to the browser. Submitted requests remain locked and create no delivery or email outbox record. Approval requires explicit bank-verification confirmation and a unique 12-digit bank reference, creates one private ZIP grant/outbox record transactionally, and records an admin audit. Rejections record a reason. Production webhook events cannot bypass manual review. Private download and email queries independently require approved manual-order status.

Email duplicate protection: a per-order atomic send lock and sent status block concurrent/repeated sends. An interrupted or ambiguous SMTP attempt is not automatically resent; the admin must inspect Gmail Sent. This avoids claiming exactly-once SMTP delivery, which Gmail cannot guarantee. Definite failures can be retried through the authenticated dashboard. Private ZIP download links continue to be emailed after approval; source ZIPs stay off public URLs and Git. Migration 0005 adds proof, customer, submission and audit fields; existing approved deliveries remain available.
