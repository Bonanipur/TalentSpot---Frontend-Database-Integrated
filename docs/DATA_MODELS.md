# 📊 TalentSpot Data Models & Database Schemas

This document defines the core data contracts, TypeScript interfaces, and target PostgreSQL / Supabase schemas for **TalentSpot**.

---

## 1. Client-Side TypeScript Data Models

### Athlete Entity (`src/data/mockData.ts`)
Represents an individual registered talent in the system.

```typescript
export type Potential = 'High' | 'Medium' | 'Low';

export interface Athlete {
  id: string;               // Format: "TS-XXXX" (Unique Scout ID)
  name: string;             // Athlete full name
  age: number;              // Age (typically 12 - 22 for developmental sports)
  gender: 'Male' | 'Female' | 'Other';
  state: string;            // Indian state (e.g., Assam, Punjab, Kerala)
  district: string;         // District of residence / scouting ground
  sport: string;            // Primary athletic discipline (Athletics, Football, etc.)
  speed: number;            // 0-100 normalized score
  power: number;            // 0-100 normalized score
  agility: number;          // 0-100 normalized score
  overall: number;          // 0-100 composite talent rating
  potential: Potential;     // Scout triage tag ('High' | 'Medium' | 'Low')
  trialsCompleted: number;  // Number of verified recorded trials
  jumpHeight: number;       // Peak vertical jump in centimeters (cm)
  aiConfidence: number;     // AI pose confidence percentage (0-100%)
  registeredDate: string;   // ISO date string (YYYY-MM-DD)
}
```

### Trial Result Entity
Represents the evaluated metrics produced after completing a live or uploaded assessment trial.

```typescript
export interface TrialResult {
  jumpHeight: number;       // Displacement in cm
  aiConfidence: number;     // Tracking accuracy (e.g., 88%)
  explosivePower: number;   // Calculated wattage score (0-100)
  speed: number;            // Acceleration rating (0-100)
  agility: number;          // Directional agility score (0-100)
  overall: number;          // Weighted composite performance score
  potential: Potential;     // Tier allocation ('High' | 'Medium' | 'Low')
}
```

### Assessment Protocol Types
```typescript
export type AssessmentType = 'sprint' | 'jump' | 'agility';

export interface AssessmentProtocol {
  id: AssessmentType;
  title: string;
  icon: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  recommended?: boolean;
}
```

---

## 2. Scoring & Normalization Logic

TalentSpot normalizes physical raw measurements (centimeters, seconds) into a standard **0–100 percentile index** calibrated against Sports Authority of India (SAI) junior age brackets:

### 1. Vertical Jump Explosive Power Calculation
Using Sayers' Peak Power Equation:
$$\text{Peak Power (Watts)} = 60.7 \cdot (\text{Jump Height in cm}) + 45.3 \cdot (\text{Body Mass in kg}) - 2055$$

In client-side emulation:
- Jump height $\ge 42\text{ cm} \rightarrow \text{Score } \ge 90\text{ (High Potential)}$
- Jump height $35-41\text{ cm} \rightarrow \text{Score } 80-89\text{ (Medium-High)}$
- Jump height $< 35\text{ cm} \rightarrow \text{Score } < 80\text{ (Developmental)}$

### 2. Composite Overall Score
$$\text{Overall} = (\text{Power} \times 0.40) + (\text{Speed} \times 0.35) + (\text{Agility} \times 0.25)$$

---

## 3. Production Supabase / PostgreSQL Schema

The following PostgreSQL schema is designed for seamless integration with `@supabase/supabase-js`, enforcing strict relational integrity, UUID primary keys, and Row Level Security (RLS).

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE athlete_gender AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE talent_potential AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE trial_type AS ENUM ('sprint', 'jump', 'agility');
CREATE TYPE trial_status AS ENUM ('pending', 'processing', 'verified', 'rejected');

-- 1. Profiles Table (Scouts, Coaches, Admins)
CREATE TABLE public.scout_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    organization TEXT DEFAULT 'Sports Authority of India',
    assigned_state TEXT,
    assigned_district TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Athletes Table
CREATE TABLE public.athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scout_id UUID REFERENCES public.scout_profiles(id) ON DELETE SET NULL,
    badge_id VARCHAR(16) UNIQUE NOT NULL, -- e.g. "TS-1024"
    name TEXT NOT NULL,
    age INT NOT NULL CHECK (age BETWEEN 8 AND 30),
    gender athlete_gender NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    primary_sport TEXT NOT NULL,
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    overall_score INT DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
    speed_score INT DEFAULT 0 CHECK (speed_score BETWEEN 0 AND 100),
    power_score INT DEFAULT 0 CHECK (power_score BETWEEN 0 AND 100),
    agility_score INT DEFAULT 0 CHECK (agility_score BETWEEN 0 AND 100),
    potential talent_potential DEFAULT 'Medium',
    trials_completed INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trials Table (Individual Physical Tests)
CREATE TABLE public.trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    scout_id UUID REFERENCES public.scout_profiles(id) ON DELETE SET NULL,
    test_type trial_type NOT NULL,
    status trial_status DEFAULT 'pending',
    
    -- Raw measurements
    raw_measurement NUMERIC(6, 2) NOT NULL, -- Jump height in cm, Sprint time in sec
    measurement_unit VARCHAR(10) NOT NULL,  -- 'cm', 's', 'pts'
    
    -- CV / AI Model Metadata
    ai_confidence NUMERIC(4, 1) CHECK (ai_confidence BETWEEN 0 AND 100),
    pose_landmarks_json JSONB,              -- Keypoint coordinates array
    fps_recorded INT,
    video_storage_path TEXT,                -- Supabase Storage reference
    
    -- Derived Scores
    power_score INT CHECK (power_score BETWEEN 0 AND 100),
    speed_score INT CHECK (speed_score BETWEEN 0 AND 100),
    agility_score INT CHECK (agility_score BETWEEN 0 AND 100),
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast scouting queries
CREATE INDEX idx_athletes_state_district ON public.athletes(state, district);
CREATE INDEX idx_athletes_potential ON public.athletes(potential);
CREATE INDEX idx_athletes_primary_sport ON public.athletes(primary_sport);
CREATE INDEX idx_trials_athlete_id ON public.trials(athlete_id);
CREATE INDEX idx_trials_test_type ON public.trials(test_type);

-- Row Level Security (RLS) Policies
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scout_profiles ENABLE ROW LEVEL SECURITY;

-- Allow scouts to view and query all athletes
CREATE POLICY "Scouts can read all athletes"
    ON public.athletes FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated scouts to insert athletes
CREATE POLICY "Scouts can insert athletes"
    ON public.athletes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = scout_id);

-- Allow scouts to record trials
CREATE POLICY "Scouts can insert trials"
    ON public.trials FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = scout_id);
```
