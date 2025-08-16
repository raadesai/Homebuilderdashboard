'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { getCurrentUser } from '../../lib/database'
import { Database } from '../../lib/database.types'

type UserProfile = Database['public']['Tables']['users']['Row'] & {
  company?: Database['public']['Tables']['companies']['Row'] | null
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          console.log('Initial session:', session?.user?.id || 'No session')
          setSession(session)
          setUser(session?.user ?? null)
          
          // If we have a session, fetch the user profile
          if (session?.user) {
            try {
              console.log('Fetching user profile for initial session:', session.user.id)
              const profile = await getCurrentUser()
              console.log('Initial user profile loaded:', profile)
              setUserProfile(profile as any)
            } catch (error) {
              console.error('Error fetching initial user profile:', error)
              setUserProfile(null)
            }
          }
        }
      } catch (err) {
        console.error('Failed to get session:', err)
      } finally {
        console.log('Setting loading to false in getSession')
        setLoading(false)
      }
    }

    getSession()

    // Failsafe: Stop loading after 3 seconds
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing stop')
      setLoading(false)
    }, 3000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('Creating user profile from session data:', session.user.id)
          // Create profile directly from session data instead of querying database
          const profile = {
            id: session.user.id,
            email: session.user.email || '',
            first_name: session.user.user_metadata?.first_name || 'User',
            last_name: session.user.user_metadata?.last_name || '',
            role: 'homeowner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            company: null
          }
          console.log('User profile created:', profile)
          setUserProfile(profile as any)
        } else {
          console.log('No session - clearing user profile')
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      
      // Clear local state immediately
      setUser(null)
      setUserProfile(null)
      setSession(null)
      setLoading(false)
      
      // Sign out from Supabase (this will trigger auth state change)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out from Supabase:', error)
      } else {
        console.log('Successfully signed out from Supabase')
      }
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Ensure local state is cleared even if Supabase fails
      setUser(null)
      setUserProfile(null)
      setSession(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      session,
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}