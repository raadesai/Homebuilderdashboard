-- Create a test project linked to your current logged-in user
-- Run this in Supabase SQL Editor AFTER you're logged in

-- First, let's create a user record if it doesn't exist
-- This will use your current auth.users ID
INSERT INTO users (id, email, first_name, last_name, role)
SELECT 
  auth.uid(),
  auth.email(),
  'Test',
  'User',
  'homeowner'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid());

-- Create a test project connected to your current user
INSERT INTO projects (
  id, 
  company_id, 
  homeowner_id, 
  name, 
  address, 
  description, 
  status, 
  start_date, 
  estimated_completion, 
  total_budget,
  current_spent
) VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001', -- Using the existing company
  auth.uid(), -- Your current user ID
  'My Test Construction Project',
  '123 Test Street, Test City, TC 12345',
  'A test construction project to verify the platform is working correctly.',
  'in_progress',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '90 days',
  250000.00,
  75000.00
) ON CONFLICT (id) DO NOTHING;

-- Get the project ID we just created
WITH new_project AS (
  SELECT id FROM projects WHERE name = 'My Test Construction Project' AND homeowner_id = auth.uid()
)
-- Add some test milestones
INSERT INTO project_milestones (
  project_id,
  phase_id,
  title,
  description,
  status,
  scheduled_start,
  scheduled_end,
  actual_start,
  progress_percentage,
  notes
) 
SELECT 
  np.id,
  pp.id,
  CASE pp.name
    WHEN 'Pre-Construction' THEN 'Planning and Permits Complete'
    WHEN 'Foundation' THEN 'Foundation Work Complete'
    WHEN 'Framing' THEN 'Framing in Progress'
    ELSE pp.name || ' Phase'
  END,
  'Test milestone for ' || pp.name,
  CASE pp.sort_order
    WHEN 1 THEN 'completed'
    WHEN 2 THEN 'completed'
    WHEN 3 THEN 'in_progress'
    ELSE 'pending'
  END,
  CURRENT_DATE - INTERVAL '30 days' + (pp.sort_order * INTERVAL '7 days'),
  CURRENT_DATE - INTERVAL '30 days' + ((pp.sort_order + 1) * INTERVAL '7 days'),
  CASE WHEN pp.sort_order <= 2 THEN CURRENT_DATE - INTERVAL '30 days' + (pp.sort_order * INTERVAL '7 days') ELSE NULL END,
  CASE pp.sort_order
    WHEN 1 THEN 100
    WHEN 2 THEN 100
    WHEN 3 THEN 65
    ELSE 0
  END,
  'Test milestone created automatically'
FROM new_project np
CROSS JOIN project_phases pp
WHERE pp.sort_order <= 4
ON CONFLICT DO NOTHING;

-- Verify the data was created
SELECT 
  p.name as project_name,
  p.status,
  p.homeowner_id,
  u.email as homeowner_email,
  COUNT(pm.id) as milestone_count
FROM projects p
LEFT JOIN users u ON p.homeowner_id = u.id
LEFT JOIN project_milestones pm ON p.id = pm.project_id
WHERE p.homeowner_id = auth.uid()
GROUP BY p.id, p.name, p.status, p.homeowner_id, u.email;