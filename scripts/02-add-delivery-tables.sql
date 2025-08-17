-- Add delivery preferences table
CREATE TABLE IF NOT EXISTS delivery_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  delivery_time TIME DEFAULT '08:00:00',
  delivery_method VARCHAR(20) DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'both')),
  frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  recipients JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id)
);

-- Add delivery logs table
CREATE TABLE IF NOT EXISTS delivery_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  delivery_method VARCHAR(20) NOT NULL,
  recipients TEXT[] NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_delivery_preferences_store_id ON delivery_preferences(store_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_report_id ON delivery_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_status ON delivery_logs(status);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_sent_at ON delivery_logs(sent_at);

-- Add RLS policies
ALTER TABLE delivery_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;

-- Delivery preferences policies
CREATE POLICY "Users can view delivery preferences for their store" ON delivery_preferences
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update delivery preferences for their store" ON delivery_preferences
  FOR ALL USING (
    store_id IN (
      SELECT store_id FROM users WHERE id = auth.uid()
    )
  );

-- Delivery logs policies
CREATE POLICY "Users can view delivery logs for their store" ON delivery_logs
  FOR SELECT USING (
    report_id IN (
      SELECT dr.id FROM daily_reports dr
      JOIN users u ON dr.store_id = u.store_id
      WHERE u.id = auth.uid()
    )
  );
