-- ============================================================
-- RevisiónPro - Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: shops
-- Represents an individual auto repair shop (taller mecánico)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shops (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  owner_name  TEXT NOT NULL,
  phone       TEXT,
  -- settings is a JSONB blob for flexible configuration per shop
  -- e.g. { "whatsapp_template": "...", "reminder_days_before": 7 }
  settings    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: customers
-- A customer associated with a shop (cliente del taller)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id     UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL, -- WhatsApp-capable phone number (e.g. +34600000000)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_shop_id ON public.customers(shop_id);

-- ============================================================
-- TABLE: vehicles
-- A vehicle owned by a customer
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id    UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  license_plate  TEXT NOT NULL,           -- Matrícula (e.g. "1234 ABC")
  brand_model    TEXT,                    -- e.g. "Seat León 2019"
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_license_plate ON public.vehicles(license_plate);

-- ============================================================
-- TABLE: maintenance_records
-- Each service record tied to a vehicle
-- ============================================================
CREATE TYPE IF NOT EXISTS maintenance_service_type AS ENUM (
  'ITV',           -- Inspección Técnica de Vehículos
  'OilChange',     -- Cambio de Aceite
  'TimingBelt',    -- Correa de Distribución
  'General'        -- Revisión General
);

CREATE TYPE IF NOT EXISTS maintenance_status AS ENUM (
  'pending',    -- Aviso no enviado aún
  'notified',   -- WhatsApp enviado al cliente
  'completed'   -- Servicio completado / confirmado
);

CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id      UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_type    maintenance_service_type NOT NULL,
  date_performed  DATE NOT NULL,             -- Fecha en que se realizó el servicio
  next_due_date   DATE NOT NULL,             -- Fecha del próximo aviso / revisión
  status          maintenance_status NOT NULL DEFAULT 'pending',
  notes           TEXT,                      -- Notas adicionales del mecánico
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id  ON public.maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_next_due    ON public.maintenance_records(next_due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_status      ON public.maintenance_records(status);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- Enable RLS and allow shop owners to only see their own data.
-- Tie into Supabase Auth via auth.uid() matching a shop's owner.
-- NOTE: Extend with actual auth user_id column on shops table
--       when implementing authentication.
-- ============================================================

ALTER TABLE public.shops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- UTILITY: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_maintenance_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- SEED DATA (optional, for local dev)
-- ============================================================
-- INSERT INTO public.shops (name, owner_name, phone) VALUES
--   ('Taller Mecánico López', 'Paco López', '+34600123456');
