-- Storage bucket and policies setup for project-documents
-- Run this in your Supabase SQL Editor

-- First, create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-documents',
  'project-documents', 
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/*',
    'application/pdf', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/*',
    'video/*'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Policy 2: Allow public read access to files
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-documents'
);

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to update files
CREATE POLICY "Allow authenticated update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Optional: More restrictive policies that only allow project members
-- Uncomment these if you want to restrict access to project members only:

/*
-- Delete the above policies first if using these:
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- Only project members can upload
CREATE POLICY "Project members can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated' AND
  -- Extract project ID from file path (first folder)
  (string_to_array(name, '/'))[1]::uuid IN (
    SELECT id FROM projects 
    WHERE homeowner_id = auth.uid() 
       OR project_manager_id = auth.uid()
  )
);

-- Only project members can delete
CREATE POLICY "Project members can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated' AND
  (string_to_array(name, '/'))[1]::uuid IN (
    SELECT id FROM projects 
    WHERE homeowner_id = auth.uid() 
       OR project_manager_id = auth.uid()
  )
);
*/