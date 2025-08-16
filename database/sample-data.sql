-- Sample Data for Temple Construction Platform
-- Run this in your Supabase SQL Editor to populate the database with test data

-- First, let's get the current user ID (replace with your actual user ID from auth.users)
-- You can find your user ID in Supabase Dashboard > Authentication > Users

-- For now, we'll create a sample company and project
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from the auth.users table

-- Insert sample company
INSERT INTO companies (id, name, contact_email, contact_phone, address) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'ABC Construction Co.', 'info@abcconstruction.com', '(555) 123-4567', '123 Builder St, Construction City, CC 12345');

-- Insert sample user profile (you'll need to replace the ID with your actual auth user ID)
-- First, get your user ID by running: SELECT id FROM auth.users;
-- Then replace the ID below with your actual user ID

-- Sample project
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
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'YOUR_USER_ID_HERE', -- Replace with your actual user ID
  'Custom Family Home - The Smiths',
  '456 Dream Home Lane, Suburbia, SB 67890',
  'A beautiful 3-bedroom, 2-bathroom family home with modern amenities and energy-efficient features.',
  'in_progress',
  '2024-01-15',
  '2024-06-15',
  450000.00,
  195000.00
);

-- Sample project milestones
INSERT INTO project_milestones (
  project_id,
  phase_id,
  title,
  description,
  status,
  scheduled_start,
  scheduled_end,
  actual_start,
  actual_end,
  progress_percentage,
  notes
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM project_phases WHERE name = 'Pre-Construction' LIMIT 1),
  'Permits and Planning Complete',
  'All building permits acquired and site planning finalized',
  'completed',
  '2024-01-15',
  '2024-02-14',
  '2024-01-15',
  '2024-02-10',
  100,
  'Completed 4 days ahead of schedule'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM project_phases WHERE name = 'Foundation' LIMIT 1),
  'Foundation and Concrete Work',
  'Excavation, footings, and foundation walls',
  'completed',
  '2024-02-15',
  '2024-03-01',
  '2024-02-15',
  '2024-02-28',
  100,
  'Foundation inspection passed with excellent rating'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM project_phases WHERE name = 'Framing' LIMIT 1),
  'Structural Framing',
  'Floor, wall, and roof framing installation',
  'in_progress',
  '2024-03-02',
  '2024-03-23',
  '2024-03-02',
  NULL,
  75,
  'Roof framing in progress, weather permitting'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM project_phases WHERE name = 'Mechanical' LIMIT 1),
  'Plumbing & Electrical Rough-in',
  'Installation of plumbing, electrical, and HVAC systems',
  'pending',
  '2024-03-24',
  '2024-04-07',
  NULL,
  NULL,
  0,
  'Scheduled to begin after framing completion'
);

-- Sample financial records
INSERT INTO financial_records (
  project_id,
  category,
  description,
  amount,
  date,
  status,
  created_by
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  'expense',
  'Site preparation and excavation',
  -15000.00,
  '2024-02-10',
  'paid',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'expense',
  'Foundation materials - concrete and rebar',
  -25000.00,
  '2024-02-20',
  'paid',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'payment',
  'Foundation contractor payment',
  -45000.00,
  '2024-02-28',
  'paid',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'expense',
  'Framing materials - lumber and hardware',
  -35000.00,
  '2024-03-05',
  'paid',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'payment',
  'Framing crew - partial payment',
  -25000.00,
  '2024-03-15',
  'paid',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'change_order',
  'Additional insulation upgrade',
  -2500.00,
  '2024-03-18',
  'approved',
  'YOUR_USER_ID_HERE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'expense',
  'Electrical materials and permits',
  -12500.00,
  '2024-03-20',
  'pending',
  'YOUR_USER_ID_HERE'
);

-- Sample communications
INSERT INTO communications (
  project_id,
  sender_id,
  message,
  message_type,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  'YOUR_USER_ID_HERE',
  'Foundation inspection passed! Excellent work by the crew. Ready to move to framing phase.',
  'update',
  NOW() - INTERVAL '2 hours'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'YOUR_USER_ID_HERE',
  'Weather forecast looks good for next week. Planning to complete roof framing by Friday.',
  'message',
  NOW() - INTERVAL '1 day'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'YOUR_USER_ID_HERE',
  'Electrical permit approved. Scheduling rough-in work for next month.',
  'notification',
  NOW() - INTERVAL '3 days'
);

-- Sample change order
INSERT INTO change_orders (
  project_id,
  title,
  description,
  cost_impact,
  time_impact_days,
  status,
  requested_by
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Upgraded Insulation Package',
  'Client requested upgrade to R-21 insulation throughout for better energy efficiency',
  2500.00,
  1,
  'approved',
  'YOUR_USER_ID_HERE'
);

-- Note: Before running this script, you need to:
-- 1. Get your user ID by running: SELECT id FROM auth.users;
-- 2. Replace all instances of 'YOUR_USER_ID_HERE' with your actual user ID
-- 3. Run this script in your Supabase SQL Editor