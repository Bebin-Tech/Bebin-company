CREATE TABLE admin_sessions (token_hash TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL, credential_version TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX sessions_expiry ON admin_sessions(expires_at);
ALTER TABLE media ADD COLUMN blob_url TEXT;
CREATE INDEX catalogue_visibility ON content(kind,published,position);
CREATE INDEX enquiries_created ON enquiries(created_at);
CREATE INDEX orders_created ON orders(created_at);
CREATE INDEX limits_expiry ON rate_limits(expires_at);
