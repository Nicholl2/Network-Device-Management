-- Add soft delete support to devices table
ALTER TABLE devices ADD COLUMN IF NOT EXISTS soft_delete_date TIMESTAMP WITH TIME ZONE;

-- Index for efficient filtering of non-deleted devices
CREATE INDEX IF NOT EXISTS idx_devices_soft_delete_date ON devices(soft_delete_date);
