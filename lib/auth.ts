import { supabase } from './supabase'

export async function signUp(email: string, password: string, userData?: {
  firstName?: string
  lastName?: string
  phone?: string
  role?: 'homeowner' | 'builder' | 'project_manager'
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData?.firstName,
        last_name: userData?.lastName,
        phone: userData?.phone,
        role: userData?.role || 'homeowner'
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}