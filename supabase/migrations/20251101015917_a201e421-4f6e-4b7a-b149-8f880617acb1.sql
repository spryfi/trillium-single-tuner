-- Normalization cache for reuse
CREATE TABLE IF NOT EXISTS normalized_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized TEXT NOT NULL,
  keep_hyphen BOOLEAN NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit of AI calls
CREATE TABLE IF NOT EXISTS pro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL,
  request JSONB NOT NULL,
  response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Actions applied to the builder
CREATE TABLE IF NOT EXISTS pro_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES pro_sessions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE normalized_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_actions ENABLE ROW LEVEL SECURITY;

-- Public access policies (adjust based on your auth requirements)
CREATE POLICY "Anyone can read normalized names" ON normalized_names FOR SELECT USING (true);
CREATE POLICY "Anyone can insert normalized names" ON normalized_names FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read pro sessions" ON pro_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pro sessions" ON pro_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read pro actions" ON pro_actions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pro actions" ON pro_actions FOR INSERT WITH CHECK (true);