
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'observer' CHECK (role IN ('admin', 'observer'));

UPDATE profiles SET role = 'admin' WHERE username IN ('admin', 'Nicholas');

ALTER TABLE devices ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS template_id UUID;

ALTER TABLE devices DROP COLUMN IF EXISTS status;
ALTER TABLE devices ADD COLUMN status TEXT DEFAULT 'stock' CHECK (status IN ('dipakai', 'rusak', 'stock'));

CREATE TABLE IF NOT EXISTS device_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  show_device_name BOOLEAN DEFAULT true,
  require_device_name BOOLEAN DEFAULT true,
  show_ip_address BOOLEAN DEFAULT true,
  require_ip_address BOOLEAN DEFAULT true,
  show_mac_address BOOLEAN DEFAULT true,
  require_mac_address BOOLEAN DEFAULT true,
  show_device_type BOOLEAN DEFAULT true,
  require_device_type BOOLEAN DEFAULT true,
  show_status BOOLEAN DEFAULT true,
  require_status BOOLEAN DEFAULT true,
  show_manufacturer BOOLEAN DEFAULT true,
  require_manufacturer BOOLEAN DEFAULT false,
  show_model BOOLEAN DEFAULT true,
  require_model BOOLEAN DEFAULT false,
  show_assigned_to BOOLEAN DEFAULT true,
  require_assigned_to BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false
);

DROP POLICY IF EXISTS "Allow read own assigned devices" ON devices;
DROP POLICY IF EXISTS "Allow read templates for authenticated users" ON device_templates;
DROP POLICY IF EXISTS "Allow insert templates for authenticated users" ON device_templates;
DROP POLICY IF EXISTS "Allow update templates for creator" ON device_templates;
DROP POLICY IF EXISTS "Allow delete templates for creator" ON device_templates;

CREATE POLICY "Allow admin full access on devices" ON devices FOR ALL TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow observer read devices" ON devices FOR SELECT TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'observer' OR assigned_to = auth.uid());
CREATE POLICY "Allow admin full access to templates" ON device_templates FOR ALL TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow observer read templates" ON device_templates FOR SELECT TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'observer');

ALTER TABLE device_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

SELECT username, role FROM profiles ORDER BY created_at DESC;

SELECT column_name FROM information_schema.columns WHERE table_name = 'devices' ORDER BY ordinal_position;

SELECT COUNT(*) FROM device_templates;

SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('devices', 'device_templates') ORDER BY tablename;