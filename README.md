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
