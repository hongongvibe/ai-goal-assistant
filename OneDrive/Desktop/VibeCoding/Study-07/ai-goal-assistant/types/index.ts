export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'health' | 'learning' | 'finance' | 'career' | 'other';
  start_date: string;
  end_date: string;
  target_value: number;
  unit: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  progress?: number;
}

export interface DailyRecord {
  id: string;
  goal_id: string;
  record_date: string;
  value: number;
  notes?: string;
  created_at: string;
}

export interface GoalWithRecords extends Goal {
  records: DailyRecord[];
}
