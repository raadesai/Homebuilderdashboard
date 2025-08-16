'use client'

import { useState, useEffect } from 'react'
import { getProjects, getProjectMilestones, getFinancialRecords } from '../../lib/database'
import { Database } from '../../lib/database.types'
import { supabase } from '../../lib/supabase'

type Project = Database['public']['Tables']['projects']['Row'] & {
  company?: Database['public']['Tables']['companies']['Row'] | null
  homeowner?: Database['public']['Tables']['users']['Row'] | null
  project_manager?: Database['public']['Tables']['users']['Row'] | null
}

type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'] & {
  phase?: Database['public']['Tables']['project_phases']['Row'] | null
}

type FinancialRecord = Database['public']['Tables']['financial_records']['Row']

export function useProject() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (currentProject && currentProject.id) {
      loadProjectData(currentProject.id)
    }
  }, [currentProject?.id])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading projects...')
      const projectsData = await getProjects()
      console.log('Projects loaded:', projectsData)
      setProjects(projectsData as Project[] || [])
      
      // Set first project as current if available and not already set
      if (projectsData && projectsData.length > 0 && !currentProject) {
        setCurrentProject(projectsData[0] as Project)
      }
    } catch (err: any) {
      console.error('Error loading projects:', err)
      setError(err.message)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const loadProjectData = async (projectId: string) => {
    try {
      const [milestonesData, financialData] = await Promise.all([
        getProjectMilestones(projectId),
        getFinancialRecords(projectId)
      ])
      
      setMilestones(milestonesData as ProjectMilestone[] || [])
      setFinancialRecords(financialData || [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Calculate project statistics
  const getProjectStats = () => {
    if (!currentProject) return null

    const completedMilestones = milestones.filter(m => m.status === 'completed').length
    const totalMilestones = milestones.length
    const completionPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

    const totalSpent = financialRecords
      .filter(r => r.category === 'expense' || r.category === 'payment')
      .reduce((sum, r) => sum + Number(r.amount), 0)
    
    const budgetUsed = currentProject.total_budget 
      ? Math.round((totalSpent / Number(currentProject.total_budget)) * 100)
      : 0

    const daysRemaining = currentProject.estimated_completion
      ? Math.ceil((new Date(currentProject.estimated_completion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      completionPercentage,
      budgetUsed,
      daysRemaining,
      totalSpent,
      totalBudget: currentProject.total_budget ? Number(currentProject.total_budget) : 0
    }
  }

  return {
    projects,
    currentProject,
    milestones,
    financialRecords,
    loading,
    error,
    stats: getProjectStats(),
    setCurrentProject,
    refreshData: loadProjects
  }
}