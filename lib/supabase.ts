import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          organization: string | null
          notification_preferences: { email: boolean; push?: boolean }
          language: 'en' | 'fr'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          organization?: string | null
          notification_preferences?: { email: boolean; push?: boolean }
          language?: 'en' | 'fr'
        }
        Update: {
          full_name?: string
          avatar_url?: string | null
          organization?: string | null
          notification_preferences?: { email: boolean; push?: boolean }
          language?: 'en' | 'fr'
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          job_title: string
          job_description: string
          required_skills: string[]
          years_experience: number
          cv_count: number
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          job_title: string
          job_description?: string
          required_skills?: string[]
          years_experience?: number
          is_deleted?: boolean
        }
        Update: {
          name?: string
          job_title?: string
          job_description?: string
          required_skills?: string[]
          years_experience?: number
          is_deleted?: boolean
        }
      }
      candidates: {
        Row: {
          id: string
          folder_id: string
          user_id: string
          name: string
          email: string
          position: string
          score: number
          badge: 'green' | 'yellow' | 'red'
          skills: string[]
          education: string[]
          experience: { role: string; company: string; years: number }[]
          gaps: string[]
          flags: string[]
          match_percentage: number
          cv_file_url: string
          raw_text: string | null
          justification: string | null
          analysis: string | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
      pipeline_results: {
        Row: {
          id: string
          folder_id: string
          user_id: string
          job_title: string
          job_description: string
          required_skills: string[]
          years_experience: number
          language: string
          total_processed: number
          status: 'running' | 'completed' | 'failed'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pipeline_results']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['pipeline_results']['Row'], 'id' | 'created_at'>>
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          type: 'pipeline_completed' | 'cv_uploaded' | 'folder_created' | 'folder_deleted' | 'candidate_deleted'
          folder_name: string
          score: number | null
          count: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['activity_log']['Row'], 'id' | 'created_at'>
        Update: never
      }
      job_scores: {
        Row: {
          id: string
          job_id: string
          candidate_id: string
          user_id: string
          score: number
          match_percentage: number
          badge: 'green' | 'yellow' | 'red'
          justification: string | null
          analysis: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['job_scores']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['job_scores']['Row'], 'id' | 'created_at'>>
      }
    }
  }
}
