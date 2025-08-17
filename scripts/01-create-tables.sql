-- Create users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'employee')) DEFAULT 'employee',
  store_id TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table for franchise locations
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  owner_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_reports table to store generated reports
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('owner', 'manager', 'employee')),
  content JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  delivery_method TEXT CHECK (delivery_method IN ('email', 'sms', 'dashboard')),
  UNIQUE(store_id, report_date, report_type)
);

-- Create data_uploads table to track CSV uploads
CREATE TABLE IF NOT EXISTS data_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  upload_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  processed_records INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_data table to store processed daily metrics
CREATE TABLE IF NOT EXISTS daily_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  data_date DATE NOT NULL,
  
  -- Sales metrics
  total_sales DECIMAL(10,2),
  transaction_count INTEGER,
  average_ticket DECIMAL(10,2),
  
  -- Labor metrics
  labor_hours DECIMAL(8,2),
  labor_cost DECIMAL(10,2),
  labor_percentage DECIMAL(5,2),
  
  -- Inventory metrics
  food_cost DECIMAL(10,2),
  food_cost_percentage DECIMAL(5,2),
  waste_amount DECIMAL(10,2),
  
  -- Customer metrics
  customer_count INTEGER,
  customer_satisfaction DECIMAL(3,2),
  
  -- Operational metrics
  drive_thru_time DECIMAL(5,2),
  order_accuracy DECIMAL(5,2),
  
  -- Additional metrics (flexible JSON storage)
  additional_metrics JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, data_date)
);

-- Create manual_entries table for manual data input
CREATE TABLE IF NOT EXISTS manual_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  entered_by UUID NOT NULL REFERENCES users(id),
  entry_date DATE NOT NULL,
  entry_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_preferences table for automated delivery settings
CREATE TABLE IF NOT EXISTS delivery_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('email')) DEFAULT 'email',
  delivery_time TIME NOT NULL DEFAULT '08:00:00',
  timezone TEXT NOT NULL DEFAULT 'America/Chicago',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_store_id ON users(store_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_store_date ON daily_reports(store_id, report_date);
CREATE INDEX IF NOT EXISTS idx_daily_data_store_date ON daily_data(store_id, data_date);
CREATE INDEX IF NOT EXISTS idx_data_uploads_store_date ON data_uploads(store_id, upload_date);

-- Insert sample store data
INSERT INTO stores (id, name, address, phone, owner_email) VALUES
('DQ001', 'Dairy Queen Downtown', '123 Main St, Anytown, ST 12345', '(555) 123-4567', 'owner@dq001.com'),
('DQ002', 'Dairy Queen Westside', '456 Oak Ave, Anytown, ST 12345', '(555) 234-5678', 'owner@dq002.com')
ON CONFLICT (id) DO NOTHING;
