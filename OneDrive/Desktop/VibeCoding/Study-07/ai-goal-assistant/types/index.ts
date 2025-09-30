// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
}

// Goal Types
export type GoalCategory = '건강' | '학습' | '커리어' | '취미' | '재정' | '기타';
export type GoalType = 'quantitative' | 'habit';
export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  goalType: GoalType;

  // Quantitative goal fields
  targetValue?: number;
  currentValue?: number;
  unit?: string;

  // Habit goal fields
  weeklyFrequency?: number;

  startDate: Date;
  endDate?: Date;
  status: GoalStatus;

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Daily Record Types
export interface DailyRecord {
  id: string;
  goalId: string;
  date: Date;

  // Quantitative goal fields
  value?: number;
  increment?: number;

  // Habit goal fields
  completed?: boolean;

  note?: string;
  createdAt: Date;
}

// AI Conversation Types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  todayUpdates: number;
  weekStreak: number;
  weeklyComparison: number;
}

// Chart Data Types
export interface ActivityData {
  day: string;
  count: number;
}

export interface CategoryDistribution {
  category: GoalCategory;
  count: number;
  avgProgress: number;
}

export interface ProgressTrend {
  date: string;
  value: number;
}