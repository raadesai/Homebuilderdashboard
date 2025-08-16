import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../lib/database'

interface SidebarProps {
  currentView: string
  onViewChange: (view: 'overview' | 'timeline' | 'documents' | 'financial' | 'communications') => void
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { userProfile, signOut } = useAuth()
  const [localProfile, setLocalProfile] = useState<any>(null)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  
  // Fetch profile directly in this component as backup
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUser()
        console.log('Sidebar direct fetch:', profile)
        setLocalProfile(profile)
      } catch (error) {
        console.error('Sidebar fetch error:', error)
      }
    }
    
    if (!userProfile) {
      fetchProfile()
    }
  }, [userProfile])
  
  const displayProfile = userProfile || localProfile
  
  console.log('Sidebar userProfile:', userProfile)
  console.log('Sidebar localProfile:', localProfile)
  console.log('Sidebar displayProfile:', displayProfile)
  const navItems = [
    { id: 'overview', label: 'Project Overview', icon: '🏠' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'communications', label: 'Messages', icon: '💬' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Temple</h2>
            <p className="text-sm text-gray-500">Construction Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
          onClick={() => setShowLogoutPopup(true)}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {displayProfile?.first_name?.[0] || displayProfile?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {displayProfile?.first_name && displayProfile?.last_name 
                ? `${displayProfile.first_name} ${displayProfile.last_name}`
                : displayProfile?.email?.split('@')[0] || 'User'
              }
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {displayProfile?.role || 'homeowner'}
            </p>
          </div>
        </div>

        {/* Logout Popup */}
        {showLogoutPopup && (
          <>
            {/* Invisible backdrop to close popup when clicking outside */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowLogoutPopup(false)}
            />
            {/* Small popup above user section */}
            <div className="absolute bottom-full left-4 right-4 mb-2 z-50">
              <div className="bg-white rounded-lg shadow-lg border p-3">
                <button
                  onClick={() => {
                    signOut()
                    setShowLogoutPopup(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <span>🚪</span>
                  <span>Log out</span>
                </button>
                {/* Arrow pointing down to user section */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-px w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}