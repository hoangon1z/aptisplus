CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),email text UNIQUE NOT NULL,name text NOT NULL,password_hash text NOT NULL,role text NOT NULL DEFAULT 'student' CHECK(role IN ('student','admin')),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE sessions(id text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,ip_hash text NOT NULL,user_agent text NOT NULL,expires_at timestamptz NOT NULL,revoked_at timestamptz);
CREATE INDEX ON sessions(user_id);
CREATE TABLE auth_events(id bigserial PRIMARY KEY,ip_hash text NOT NULL,email_hash text NOT NULL,event text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON auth_events(ip_hash,created_at);
CREATE INDEX ON auth_events(email_hash,created_at);
CREATE TABLE auth_limits(key text PRIMARY KEY,hits int NOT NULL,window_start timestamptz NOT NULL);
