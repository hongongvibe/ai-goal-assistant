import { create } from 'zustand';
import { User, Goal, DailyRecord } from '@/types';
import { supabase } from '@/lib/supabase';

interface AppState {
  user: User | null;
  goals: Goal[];
  dailyRecords: DailyRecord[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loadGoals: () => Promise<void>;
  loadDailyRecords: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addDailyRecord: (record: Omit<DailyRecord, 'id' | 'created_at'>) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: { id: '936cff5a-6b36-470b-ad38-6c03b9004ac6', email: 'user@example.com', name: '김철수', created_at: new Date().toISOString() },
  goals: [],
  dailyRecords: [],
  isLoading: false,

  setUser: (user) => set({ user }),

  loadGoals: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
      set({ isLoading: false });
      return;
    }

    const goals: Goal[] = (data || []).map((g: any) => ({
      id: g.id,
      user_id: g.user_id,
      title: g.title,
      description: g.description || '',
      category: g.category as Goal['category'],
      start_date: g.start_date,
      end_date: g.end_date || '',
      target_value: g.target_value || 0,
      unit: g.unit || '',
      status: g.status as Goal['status'],
      created_at: g.created_at || '',
      updated_at: g.updated_at || '',
      progress: g.target_value ? Math.min(Math.round((g.current_value || 0) / g.target_value * 100), 100) : 0
    }));

    set({ goals, isLoading: false });
  },

  loadDailyRecords: async () => {
    const { data, error } = await supabase
      .from('daily_records')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading daily records:', error);
      return;
    }

    const records: DailyRecord[] = (data || []).map((r: any) => ({
      id: r.id,
      goal_id: r.goal_id,
      record_date: r.date,
      value: r.increment || 0,
      notes: r.note || '',
      created_at: r.created_at || ''
    }));

    set({ dailyRecords: records });
  },

  addGoal: async (goalData) => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        goal_type: 'quantitative',
        target_value: goalData.target_value,
        current_value: 0,
        unit: goalData.unit,
        start_date: goalData.start_date,
        end_date: goalData.end_date,
        status: goalData.status
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      return;
    }

    await get().loadGoals();
  },

  updateGoal: async (id, updates) => {
    const { error } = await (supabase as any)
      .from('goals')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    await get().loadGoals();
  },

  deleteGoal: async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }

    await get().loadGoals();
  },

  addDailyRecord: async (recordData) => {
    const { data, error } = await supabase
      .from('daily_records')
      .insert({
        goal_id: recordData.goal_id,
        date: recordData.record_date,
        increment: recordData.value,
        note: recordData.notes
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error adding daily record:', error);
      return;
    }

    // Update goal current_value
    const { data: goal } = await (supabase as any)
      .from('goals')
      .select('current_value, target_value')
      .eq('id', recordData.goal_id)
      .single();

    if (goal) {
      const newValue = (goal.current_value || 0) + recordData.value;
      await (supabase as any)
        .from('goals')
        .update({ current_value: newValue })
        .eq('id', recordData.goal_id);
    }

    await get().loadDailyRecords();
    await get().loadGoals();
  }
}));
