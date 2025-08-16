'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Auth from './Auth'
import Sidebar from './Sidebar'
import ProjectOverview from './ProjectOverview'
import Timeline from './Timeline'
import Documents from './Documents'
import Financial from './Financial'
import Communications from './Communications'

type DashboardView = 'overview' | 'timeline' | 'documents' | 'financial' | 'communications'

export default function Dashboard() {
  const { user, loading, session } = useAuth()
  const [currentView, setCurrentView] = useState<DashboardView>('overview')
  
  console.log('Dashboard render - user:', !!user, 'loading:', loading, 'session:', !!session)

  // Show loading screen only briefly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <p className="text-gray-600 mb-2">Loading Temple Construction Platform...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  // If not loading and no user, show auth
  if (!user || !session) {
    console.log('No user or session - showing Auth component')
    return <Auth />
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <ProjectOverview />
      case 'timeline':
        return <Timeline />
      case 'documents':
        return <Documents />
      case 'financial':
        return <Financial />
      case 'communications':
        return <Communications />
      default:
        return <ProjectOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Temple Construction Platform
            </h1>
            <p className="text-gray-600">
              Your home building journey, simplified and transparent
            </p>
          </header>
          {renderView()}
        </div>
      </main>
    </div>
  )
}