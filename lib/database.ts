import { supabase } from './supabase'
import { Database } from './database.types'

type Tables = Database['public']['Tables']

// Projects
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      homeowner:users!projects_homeowner_id_fkey(*),
      project_manager:users!projects_project_manager_id_fkey(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      homeowner:users!projects_homeowner_id_fkey(*),
      project_manager:users!projects_project_manager_id_fkey(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Project Milestones
export async function getProjectMilestones(projectId: string) {
  const { data, error } = await supabase
    .from('project_milestones')
    .select(`
      *,
      phase:project_phases(*)
    `)
    .eq('project_id', projectId)
    .order('scheduled_start', { ascending: true })
  
  if (error) throw error
  return data
}

// Project Phases
export async function getProjectPhases() {
  const { data, error } = await supabase
    .from('project_phases')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) throw error
  return data
}

// Documents
export async function getProjectDocuments(projectId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploaded_by:users(*),
      milestone:project_milestones(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Financial Records
export async function getFinancialRecords(projectId: string) {
  const { data, error } = await supabase
    .from('financial_records')
    .select(`
      *,
      created_by:users(*)
    `)
    .eq('project_id', projectId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

// Communications
export async function getCommunications(projectId: string) {
  const { data, error } = await supabase
    .from('communications')
    .select(`
      *,
      sender:users!communications_sender_id_fkey(*),
      recipient:users!communications_recipient_id_fkey(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) throw error
  return data
}

// Change Orders
export async function getChangeOrders(projectId: string) {
  const { data, error } = await supabase
    .from('change_orders')
    .select(`
      *,
      requested_by:users!change_orders_requested_by_fkey(*),
      approved_by:users!change_orders_approved_by_fkey(*)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Users
export async function getCurrentUser(userId?: string) {
  try {
    let user;
    let authError;
    
    if (userId) {
      // Use provided userId directly (more reliable)
      user = { id: userId };
      authError = null;
      console.log('Using provided user ID:', userId)
    } else {
      // Fall back to auth.getUser()
      const result = await supabase.auth.getUser()
      user = result.data.user;
      authError = result.error;
    }
    
    if (authError || !user) {
      console.log('No auth user found:', authError)
      return null
    }

    console.log('Auth user found, fetching profile for:', user.id)
    console.log('About to query users table...')
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', user.id)
      .single()
    
    console.log('Database query completed. Error:', error, 'Data:', !!data)
    
    if (error) {
      console.error('Error fetching user profile:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return null
    }
    
    console.log('User profile fetched successfully:', data)
    return data
  } catch (err) {
    console.error('getCurrentUser error:', err)
    return null
  }
}

// Insert functions
export async function createProject(project: Omit<Tables['projects']['Insert'], 'id'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createMilestone(milestone: Omit<Tables['project_milestones']['Insert'], 'id'>) {
  const { data, error } = await supabase
    .from('project_milestones')
    .insert(milestone)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createCommunication(communication: Omit<Tables['communications']['Insert'], 'id'>) {
  const { data, error } = await supabase
    .from('communications')
    .insert(communication)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createFinancialRecord(record: Omit<Tables['financial_records']['Insert'], 'id'>) {
  const { data, error } = await supabase
    .from('financial_records')
    .insert(record)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createDocument(document: Omit<Tables['documents']['Insert'], 'id'>) {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// File storage functions
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) throw error
  return data
}

export async function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}

// Update functions
export async function updateProject(id: string, updates: Tables['projects']['Update']) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateMilestone(id: string, updates: Tables['project_milestones']['Update']) {
  const { data, error } = await supabase
    .from('project_milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export function subscribeToProject(projectId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`project:${projectId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'project_milestones', filter: `project_id=eq.${projectId}` },
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'communications', filter: `project_id=eq.${projectId}` },
      callback
    )
    .subscribe()
}