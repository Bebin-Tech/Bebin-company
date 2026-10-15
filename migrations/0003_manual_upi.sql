CREATE TABLE manual_orders(id TEXT PRIMARY KEY, access_hash TEXT UNIQUE NOT NULL, handle TEXT NOT NULL, title TEXT NOT NULL, email TEXT NOT NULL, amount TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', reference TEXT, created_at TEXT NOT NULL, approved_at TEXT, approved_by TEXT);
CREATE UNIQUE INDEX manual_reference_unique ON manual_orders(reference) WHERE reference IS NOT NULL;
