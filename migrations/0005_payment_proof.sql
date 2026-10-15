ALTER TABLE manual_orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE manual_orders ADD COLUMN phone TEXT NOT NULL DEFAULT '';
ALTER TABLE manual_orders ADD COLUMN payment_proof_url TEXT;
ALTER TABLE manual_orders ADD COLUMN customer_reference TEXT;
ALTER TABLE manual_orders ADD COLUMN submitted_at TEXT;
ALTER TABLE manual_orders ADD COLUMN rejection_reason TEXT;
CREATE TABLE manual_payment_audit(id TEXT PRIMARY KEY,order_id TEXT NOT NULL REFERENCES manual_orders(id),actor TEXT NOT NULL,action TEXT NOT NULL,created_at TEXT NOT NULL);
