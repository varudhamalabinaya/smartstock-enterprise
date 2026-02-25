-- ============================================================
-- SmartStock Enterprise - Schema (PostgreSQL / Supabase)
-- ============================================================

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    mobile_number TEXT NOT NULL UNIQUE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id             BIGSERIAL PRIMARY KEY,
    name           TEXT          NOT NULL,
    category       TEXT          NOT NULL,
    stock_quantity INTEGER       NOT NULL DEFAULT 0,
    price          NUMERIC(10,2) NOT NULL,
    version        BIGINT        NOT NULL DEFAULT 0
);

-- Product locks table (7-minute atomic lock)
CREATE TABLE IF NOT EXISTS product_locks (
    id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id BIGINT  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id    BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity   INTEGER NOT NULL,
    locked_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    status     TEXT NOT NULL DEFAULT 'LOCKED'
                   CHECK (status IN ('LOCKED', 'RELEASED', 'PURCHASED'))
);

-- Inventory logs table (admin audit trail)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id             BIGSERIAL PRIMARY KEY,
    product_id     BIGINT  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    admin_id       TEXT    NOT NULL,
    quantity_added INTEGER NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_locks_product_id ON product_locks(product_id);
CREATE INDEX IF NOT EXISTS idx_product_locks_user_id    ON product_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_product_locks_status     ON product_locks(status);
CREATE INDEX IF NOT EXISTS idx_product_locks_expires_at ON product_locks(expires_at);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product   ON inventory_logs(product_id);
