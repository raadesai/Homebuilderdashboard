-- Storage policies for project-documents bucket
-- Run these in your Supabase SQL Editor

-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Policy 2: Allow users to view files (public read access)
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-documents'
);

-- Policy 3: Allow users to delete their own files 
CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Policy 4: Allow users to update their own files
CREATE POLICY "Allow authenticated update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
) WITH CHECK (
  bucket_id = 'project-documents' AND 
  auth.role() = 'authenticated'
);

-- Alternative: If you want more restrictive access (only project members)
-- You can modify the policies to check if the user has access to the specific project:
-- 
-- CREATE POLICY "Project members can upload" ON storage.objects
-- FOR INSERT WITH CHECK (
--   bucket_id = 'project-documents' AND 
--   auth.role() = 'authenticated' AND
--   (storage.foldername(name))[1]::uuid IN (
--     SELECT project_id FROM project_members WHERE user_id = auth.uid()
--     UNION
--     SELECT id FROM projects WHERE homeowner_id = auth.uid() OR project_manager_id = auth.uid()
--   )
-- );