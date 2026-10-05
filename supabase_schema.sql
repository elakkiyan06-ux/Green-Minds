-- ==========================================
-- GREENMIND CAMPUS SUSTAINABILITY SCHEMA
-- For Supabase PostgreSQL (Includes Eco-Bounty)
-- ==========================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('student', 'faculty', 'admin', 'maintenance')) DEFAULT 'student',
    department TEXT,
    eco_points INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ENVIRONMENTAL ISSUES TABLE (with Eco-Bounty Columns)
CREATE TABLE IF NOT EXISTS environmental_issues (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('waste', 'water', 'energy', 'air_quality', 'green_cover', 'plastic', 'other')) NOT NULL,
    location TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
    image_url TEXT,
    ai_summary TEXT,
    ai_observations JSONB DEFAULT '[]'::jsonb,
    ai_impact TEXT,
    ai_recommendations JSONB DEFAULT '[]'::jsonb,
    ai_preventive_actions JSONB DEFAULT '[]'::jsonb,
    ai_confidence NUMERIC DEFAULT 0.90,
    ai_uncertainty JSONB DEFAULT '[]'::jsonb,
    maintenance_required BOOLEAN DEFAULT true,
    reported_by TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,

    -- Eco-Bounty Extensions
    eco_bounty_eligible BOOLEAN DEFAULT true,
    eco_bounty_points INT DEFAULT 50,
    eco_bounty_rewarded BOOLEAN DEFAULT false,
    ai_verified BOOLEAN DEFAULT true,
    assigned_department TEXT,
    voice_transcript TEXT
);

-- 3. ACTIONS TABLE
CREATE TABLE IF NOT EXISTS actions (
    id TEXT PRIMARY KEY,
    issue_id TEXT REFERENCES environmental_issues(id) ON DELETE CASCADE,
    action_text TEXT NOT NULL,
    action_type TEXT CHECK (action_type IN ('immediate', 'preventive')) NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ECO-REWARDS AUDITING LOG TABLE
CREATE TABLE IF NOT EXISTS eco_rewards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    issue_id TEXT REFERENCES environmental_issues(id) ON DELETE SET NULL,
    points INT NOT NULL DEFAULT 50,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CAMPUS METRICS TABLE
CREATE TABLE IF NOT EXISTS campus_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    green_score INT NOT NULL,
    waste_score INT NOT NULL,
    water_score INT NOT NULL,
    energy_score INT NOT NULL,
    green_cover_score INT NOT NULL,
    resolution_rate INT NOT NULL,
    total_issues INT NOT NULL,
    resolved_issues INT NOT NULL
);

-- Migration helpers if tables already exist:
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS eco_bounty_eligible BOOLEAN DEFAULT true;
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS eco_bounty_points INT DEFAULT 50;
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS eco_bounty_rewarded BOOLEAN DEFAULT false;
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS ai_verified BOOLEAN DEFAULT true;
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS assigned_department TEXT;
ALTER TABLE environmental_issues ADD COLUMN IF NOT EXISTS voice_transcript TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS eco_points INT DEFAULT 0;

-- Row Level Security (RLS) policies for Demo & Access
ALTER TABLE environmental_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on environmental_issues" ON environmental_issues FOR SELECT USING (true);
CREATE POLICY "Allow public insert on environmental_issues" ON environmental_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on environmental_issues" ON environmental_issues FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on actions" ON actions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on actions" ON actions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on actions" ON actions FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on eco_rewards" ON eco_rewards FOR SELECT USING (true);
CREATE POLICY "Allow public insert on eco_rewards" ON eco_rewards FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on campus_metrics" ON campus_metrics FOR SELECT USING (true);
