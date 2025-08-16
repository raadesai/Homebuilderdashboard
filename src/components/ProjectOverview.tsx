'use client'

import { useProject } from '../hooks/useProject'

export default function ProjectOverview() {
  const { currentProject, milestones, loading, error, stats } = useProject()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading project data: {error}</p>
          <p className="text-gray-600">Please check that you've run the database migration.</p>
        </div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No projects found</p>
          <p className="text-sm text-gray-500">Create a project to get started with your construction dashboard.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'on_hold': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const currentPhase = milestones.find(m => m.status === 'in_progress')
  const recentMilestones = milestones.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Project Status</p>
              <p className={`text-2xl font-bold capitalize ${getStatusColor(currentProject.status).split(' ')[0]}`}>
                {currentProject.status.replace('_', ' ')}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(currentProject.status).split(' ')[1]}`}>
              <span className={`text-xl ${getStatusColor(currentProject.status).split(' ')[0]}`}>🏗️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days Remaining</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.daysRemaining ? Math.max(0, stats.daysRemaining) : '--'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Used</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.budgetUsed || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.completionPercentage || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Phase</h3>
          <div className="space-y-4">
            {currentPhase ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div>
                  <h4 className="font-medium text-gray-900">{currentPhase.title}</h4>
                  <p className="text-sm text-gray-600">{currentPhase.description || 'In progress'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{currentPhase.progress_percentage}% Complete</p>
                  {currentPhase.scheduled_end && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(currentPhase.scheduled_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active phase</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
          <div className="space-y-3">
            {recentMilestones.length > 0 ? recentMilestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in_progress' ? 'bg-blue-500' :
                  milestone.status === 'delayed' ? 'bg-red-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <p className="text-sm text-gray-900">{milestone.title}</p>
                  <p className="text-xs text-gray-500">
                    {milestone.updated_at ? new Date(milestone.updated_at).toLocaleDateString() : 'Recently updated'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500">
                <p>No milestones yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {milestones.length > 0 ? milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${
                milestone.status === 'completed' ? 'bg-green-500' :
                milestone.status === 'in_progress' ? 'bg-blue-500' : 
                milestone.status === 'delayed' ? 'bg-red-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{milestone.title}</span>
                  <span className="text-sm text-gray-500">{milestone.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in_progress' ? 'bg-blue-500' : 
                      milestone.status === 'delayed' ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    style={{ width: `${milestone.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p>No timeline milestones yet</p>
              <p className="text-sm">Milestones will appear here as your project progresses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}