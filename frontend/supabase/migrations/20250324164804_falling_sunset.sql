/*
  # Initial Schema for Fitness Tracker

  1. New Tables
    - profiles
      - Stores user profile information
    - workout_plans
      - Stores workout plans created by users
    - workout_exercises
      - Stores exercises within workout plans
    - diet_logs
      - Stores food intake and nutrition data
    - progress_logs
      - Stores user progress measurements
    - todos
      - Stores user's daily tasks and goals

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  height NUMERIC,
  weight NUMERIC,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workout_plans table
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  day_of_week TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create workout_exercises table
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  weight NUMERIC,
  notes TEXT,
  order_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create diet_logs table
CREATE TABLE diet_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  meal_type TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- Create progress_logs table
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  weight NUMERIC,
  body_fat_percentage NUMERIC,
  measurements JSONB,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- Create todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own workout plans"
  ON workout_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create workout plans"
  ON workout_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans"
  ON workout_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans"
  ON workout_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can manage own exercises"
  ON workout_exercises FOR ALL
  TO authenticated
  USING (workout_plan_id IN (
    SELECT id FROM workout_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own diet logs"
  ON diet_logs FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own progress logs"
  ON progress_logs FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own todos"
  ON todos FOR ALL
  TO authenticated
  USING (user_id = auth.uid());