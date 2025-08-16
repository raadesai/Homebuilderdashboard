export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          brand_colors: Json
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          brand_colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          brand_colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          company_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          role: Database['public']['Enums']['user_role']
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      project_phases: {
        Row: {
          id: string
          name: string
          description: string | null
          typical_duration_days: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          typical_duration_days?: number | null
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          typical_duration_days?: number | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          company_id: string
          homeowner_id: string
          project_manager_id: string | null
          name: string
          address: string | null
          description: string | null
          status: Database['public']['Enums']['project_status']
          start_date: string | null
          estimated_completion: string | null
          actual_completion: string | null
          total_budget: number | null
          current_spent: number
          contract_signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          homeowner_id: string
          project_manager_id?: string | null
          name: string
          address?: string | null
          description?: string | null
          status?: Database['public']['Enums']['project_status']
          start_date?: string | null
          estimated_completion?: string | null
          actual_completion?: string | null
          total_budget?: number | null
          current_spent?: number
          contract_signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          homeowner_id?: string
          project_manager_id?: string | null
          name?: string
          address?: string | null
          description?: string | null
          status?: Database['public']['Enums']['project_status']
          start_date?: string | null
          estimated_completion?: string | null
          actual_completion?: string | null
          total_budget?: number | null
          current_spent?: number
          contract_signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_homeowner_id_fkey"
            columns: ["homeowner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string
          phase_id: string | null
          title: string
          description: string | null
          status: Database['public']['Enums']['milestone_status']
          scheduled_start: string | null
          scheduled_end: string | null
          actual_start: string | null
          actual_end: string | null
          progress_percentage: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase_id?: string | null
          title: string
          description?: string | null
          status?: Database['public']['Enums']['milestone_status']
          scheduled_start?: string | null
          scheduled_end?: string | null
          actual_start?: string | null
          actual_end?: string | null
          progress_percentage?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase_id?: string | null
          title?: string
          description?: string | null
          status?: Database['public']['Enums']['milestone_status']
          scheduled_start?: string | null
          scheduled_end?: string | null
          actual_start?: string | null
          actual_end?: string | null
          progress_percentage?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          project_id: string
          uploaded_by: string
          name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          category: Database['public']['Enums']['document_category']
          milestone_id: string | null
          description: string | null
          is_client_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          uploaded_by: string
          name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          category?: Database['public']['Enums']['document_category']
          milestone_id?: string | null
          description?: string | null
          is_client_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          uploaded_by?: string
          name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          category?: Database['public']['Enums']['document_category']
          milestone_id?: string | null
          description?: string | null
          is_client_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          }
        ]
      }
      communications: {
        Row: {
          id: string
          project_id: string
          sender_id: string
          recipient_id: string | null
          message: string
          message_type: Database['public']['Enums']['message_type']
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          sender_id: string
          recipient_id?: string | null
          message: string
          message_type?: Database['public']['Enums']['message_type']
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          sender_id?: string
          recipient_id?: string | null
          message?: string
          message_type?: Database['public']['Enums']['message_type']
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      financial_records: {
        Row: {
          id: string
          project_id: string
          category: Database['public']['Enums']['financial_category']
          description: string
          amount: number
          date: string
          status: Database['public']['Enums']['financial_status']
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          category: Database['public']['Enums']['financial_category']
          description: string
          amount: number
          date?: string
          status?: Database['public']['Enums']['financial_status']
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          category?: Database['public']['Enums']['financial_category']
          description?: string
          amount?: number
          date?: string
          status?: Database['public']['Enums']['financial_status']
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      change_orders: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          cost_impact: number
          time_impact_days: number
          status: Database['public']['Enums']['change_order_status']
          requested_by: string
          approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          cost_impact?: number
          time_impact_days?: number
          status?: Database['public']['Enums']['change_order_status']
          requested_by: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          cost_impact?: number
          time_impact_days?: number
          status?: Database['public']['Enums']['change_order_status']
          requested_by?: string
          approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_chat_history: {
        Row: {
          id: string
          project_id: string
          user_id: string
          message: string
          response: string
          context_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          message: string
          response: string
          context_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          message?: string
          response?: string
          context_data?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'homeowner' | 'builder' | 'project_manager' | 'subcontractor' | 'admin'
      project_status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
      milestone_status: 'pending' | 'in_progress' | 'completed' | 'delayed'
      document_category: 'contract' | 'permit' | 'photo' | 'video' | 'plan' | 'invoice' | 'other'
      message_type: 'message' | 'notification' | 'update' | 'alert'
      financial_category: 'budget_item' | 'payment' | 'expense' | 'change_order'
      financial_status: 'pending' | 'approved' | 'paid' | 'overdue'
      change_order_status: 'proposed' | 'pending_approval' | 'approved' | 'rejected' | 'implemented'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}