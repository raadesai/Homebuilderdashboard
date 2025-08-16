-- Debug script to check user and project data
-- Run this in Supabase SQL Editor

-- 1. Check all users in auth.users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- 2. Check all users in public.users table
SELECT id, email, first_name, last_name, role FROM users ORDER BY created_at DESC;

-- 3. Check projects and their homeowner connections
SELECT 
  p.id,
  p.name,
  p.homeowner_id,
  u.email as homeowner_email,
  p.created_at
FROM projects p
LEFT JOIN users u ON p.homeowner_id = u.id
ORDER BY p.created_at DESC;

-- 4. If you need to update the project to use your correct user ID, 
-- first find your user ID from the first query, then run:
-- UPDATE projects SET homeowner_id = 'YOUR_ACTUAL_USER_ID' WHERE name = 'Custom Family Home - The Smiths';