export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          profile_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          profile_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          profile_image?: string | null;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          goal_type: 'quantitative' | 'habit';
          target_value: number | null;
          current_value: number | null;
          unit: string | null;
          weekly_frequency: number | null;
          start_date: string;
          end_date: string | null;
          status: 'active' | 'completed' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          goal_type: 'quantitative' | 'habit';
          target_value?: number | null;
          current_value?: number | null;
          unit?: string | null;
          weekly_frequency?: number | null;
          start_date: string;
          end_date?: string | null;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          goal_type?: 'quantitative' | 'habit';
          target_value?: number | null;
          current_value?: number | null;
          unit?: string | null;
          weekly_frequency?: number | null;
          start_date?: string;
          end_date?: string | null;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_records: {
        Row: {
          id: string;
          goal_id: string;
          date: string;
          value: number | null;
          increment: number | null;
          completed: boolean | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          date: string;
          value?: number | null;
          increment?: number | null;
          completed?: boolean | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          date?: string;
          value?: number | null;
          increment?: number | null;
          completed?: boolean | null;
          note?: string | null;
          created_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          messages: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          messages?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          messages?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};