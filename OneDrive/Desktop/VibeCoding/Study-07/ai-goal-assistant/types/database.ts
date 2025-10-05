export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      goals: {
        Row: {
          category: string
          created_at: string | null
          current_value: number | null
          description: string | null
          end_date: string | null
          goal_type: string
          id: string
          start_date: string
          status: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string
          weekly_frequency: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          goal_type: string
          id?: string
          start_date: string
          status?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
          weekly_frequency?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          goal_type?: string
          id?: string
          start_date?: string
          status?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_frequency?: number | null
        }
      }
      daily_records: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          goal_id: string
          id: string
          increment: number | null
          note: string | null
          value: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date: string
          goal_id: string
          id?: string
          increment?: number | null
          note?: string | null
          value?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          goal_id?: string
          id?: string
          increment?: number | null
          note?: string | null
          value?: number | null
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          profile_image: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          profile_image?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          profile_image?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
