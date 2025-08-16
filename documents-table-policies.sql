-- RLS Policies for documents table
-- Run this in your Supabase SQL Editor

-- Enable RLS on documents table (if not already enabled)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to read documents for projects they have access to
CREATE POLICY "Users can read project documents" ON documents
FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    -- User is the homeowner
    project_id IN (
      SELECT id FROM projects WHERE homeowner_id = auth.uid()
    )
    OR
    -- User is the project manager  
    project_id IN (
      SELECT id FROM projects WHERE project_manager_id = auth.uid()
    )
    OR
    -- User uploaded the document
    uploaded_by = auth.uid()
  )
);

-- Policy 2: Allow authenticated users to insert documents for projects they have access to
CREATE POLICY "Users can insert project documents" ON documents
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND (
    -- User is the homeowner
    project_id IN (
      SELECT id FROM projects WHERE homeowner_id = auth.uid()
    )
    OR
    -- User is the project manager
    project_id IN (
      SELECT id FROM projects WHERE project_manager_id = auth.uid()
    )
  )
);

-- Policy 3: Allow users to delete documents they uploaded or for projects they manage
CREATE POLICY "Users can delete project documents" ON documents
FOR DELETE USING (
  auth.role() = 'authenticated' AND (
    -- User uploaded the document
    uploaded_by = auth.uid()
    OR
    -- User is the homeowner
    project_id IN (
      SELECT id FROM projects WHERE homeowner_id = auth.uid()
    )
    OR
    -- User is the project manager
    project_id IN (
      SELECT id FROM projects WHERE project_manager_id = auth.uid()
    )
  )
);

-- Policy 4: Allow users to update documents for projects they have access to
CREATE POLICY "Users can update project documents" ON documents
FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    -- User uploaded the document
    uploaded_by = auth.uid()
    OR
    -- User is the homeowner
    project_id IN (
      SELECT id FROM projects WHERE homeowner_id = auth.uid()
    )
    OR
    -- User is the project manager
    project_id IN (
      SELECT id FROM projects WHERE project_manager_id = auth.uid()
    )
  )
) WITH CHECK (
  auth.role() = 'authenticated' AND (
    -- User uploaded the document
    uploaded_by = auth.uid()
    OR
    -- User is the homeowner
    project_id IN (
      SELECT id FROM projects WHERE homeowner_id = auth.uid()
    )
    OR
    -- User is the project manager
    project_id IN (
      SELECT id FROM projects WHERE project_manager_id = auth.uid()
    )
  )
);