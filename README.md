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

The connected Shopify sandbox currently has no published products. The private local release folder outside this repository contains seven software ZIPs, validated setup guides, checksums, and a Shopify CSV with the confirmed prices as **drafts**. Those paid source archives are deliberately not committed to this public repository.

Checkout is in preview mode by default. `COMMERCE_MODE=test` allows a configured test project to use Shopify's real cart API, but successful hosted payment checkout still requires the merchant's Shopify admin and test-payment setup. Live checkout is explicitly disabled until the real email delivery service can be implemented and verified after domain ownership. Do not set a live flag expecting customer emails to send.

`/api/webhooks/shopify` verifies the raw-body HMAC, store, topic, paid status, currency and test/live mode. It persists an order and a unique delivery for each registered private package transactionally. Replayed paid events do not create duplicate deliveries. Delivery URLs use random 256-bit tokens stored only as hashes. The queued token is AES-256-GCM encrypted with a separate 32-byte base64 `DELIVERY_ENCRYPTION_KEY`. Download links expire in seven days and respect order revocation. ZIPs must be stored privately, never under `public/` or the image-media endpoint.

`/admin/digital` is protected by the existing administrator session and shows package and outbox status. Test events create `test_captured` records without sending email. Live email sending is **not configured**: Resend provisioning is pending an owned, verified sender domain. `pending_domain` is an honest queue status, not proof of email delivery.

Validation: `tests/commerce.mjs` runs against an isolated local SQLite database, a temporary private Blob ZIP, and a local Next.js server. It tests invalid/unpaid-event rejection, a locally signed simulated paid event, duplicate fulfilment protection, encrypted test capture, ZIP byte equality, and invalid/revoked/expired-link denial. It also calls the real Shopify catalogue and confirms that an unpublished project cannot start checkout. This is not a completed Shopify payment or a delivered email. Requires the local `../project-releases/healthwise-ai.zip` fixture and current development OIDC credentials; the test never uses the production database. `npm run build` checks the deployable application.

After importing and reviewing the Shopify drafts, publish each selected software product to the storefront, then run `node --env-file=.env.local scripts/register-project-package.mjs <handle>`. This command verifies the local release checksum and the approved price against the actual Shopify variant before storing the ZIP privately and registering it. It does not enable live checkout. Keep old Blob package versions until every delivery referencing them has expired.
