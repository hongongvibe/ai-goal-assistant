import { create } from 'zustand';
import { User, Goal, DailyRecord, AIConversation } from '@/types';
import { supabase } from '@/lib/supabase';

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string) => boolean;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalById: (id: string) => Goal | undefined;

  // Daily Records
  dailyRecords: DailyRecord[];
  addDailyRecord: (record: Omit<DailyRecord, 'id' | 'createdAt'>) => void;
  getRecordsByGoalId: (goalId: string) => DailyRecord[];

  // AI Conversations
  conversations: AIConversation[];
  addConversation: (title: string) => string;
  addMessage: (conversationId: string, role: 'user' | 'assistant', content: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  goals: [],
  dailyRecords: [],
  conversations: [],

  // Auth actions
  login: async (email: string, password: string) => {
    try {
      // Fetch user from Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !users) {
        return false;
      }

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', users.id);

      // Fetch daily records
      const { data: recordsData } = await supabase
        .from('daily_records')
        .select('*');

      // Fetch conversations
      const { data: conversationsData } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', users.id);

      const user: User = {
        id: users.id,
        email: users.email,
        name: users.name,
        profileImage: users.profile_image,
        createdAt: new Date(users.created_at),
      };

      const goals: Goal[] = (goalsData || []).map(g => ({
        id: g.id,
        userId: g.user_id,
        title: g.title,
        description: g.description || undefined,
        category: g.category,
        goalType: g.goal_type as 'quantitative' | 'habit',
        targetValue: g.target_value || undefined,
        currentValue: g.current_value || undefined,
        unit: g.unit || undefined,
        weeklyFrequency: g.weekly_frequency || undefined,
        startDate: new Date(g.start_date),
        endDate: g.end_date ? new Date(g.end_date) : undefined,
        status: g.status as 'active' | 'completed' | 'archived',
        createdAt: new Date(g.created_at),
        updatedAt: new Date(g.updated_at),
      }));

      const dailyRecords: DailyRecord[] = (recordsData || []).map(r => ({
        id: r.id,
        goalId: r.goal_id,
        date: new Date(r.date),
        value: r.value || undefined,
        increment: r.increment || undefined,
        completed: r.completed || undefined,
        note: r.note || undefined,
        createdAt: new Date(r.created_at),
      }));

      const conversations: AIConversation[] = (conversationsData || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        title: c.title,
        messages: c.messages || [],
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      }));

      set({
        user,
        isAuthenticated: true,
        goals,
        dailyRecords,
        conversations,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      goals: [],
      dailyRecords: [],
      conversations: [],
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      // Insert new user into Supabase
      const { data: newUserData, error } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: password, // In production, hash this properly
          name,
        })
        .select()
        .single();

      if (error || !newUserData) {
        console.error('Registration error:', error);
        return false;
      }

      const newUser: User = {
        id: newUserData.id,
        email: newUserData.email,
        name: newUserData.name,
        profileImage: newUserData.profile_image,
        createdAt: new Date(newUserData.created_at),
      };

      set({
        user: newUser,
        isAuthenticated: true,
        goals: [],
        dailyRecords: [],
        conversations: [],
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  // Goal actions
  addGoal: async (goalData) => {
    try {
      const userId = get().user?.id;
      if (!userId) return;

      const { data: newGoalData, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          goal_type: goalData.goalType,
          target_value: goalData.targetValue,
          current_value: goalData.currentValue,
          unit: goalData.unit,
          weekly_frequency: goalData.weeklyFrequency,
          start_date: goalData.startDate.toISOString().split('T')[0],
          end_date: goalData.endDate ? goalData.endDate.toISOString().split('T')[0] : null,
          status: goalData.status,
        })
        .select()
        .single();

      if (error || !newGoalData) {
        console.error('Add goal error:', error);
        return;
      }

      const newGoal: Goal = {
        id: newGoalData.id,
        userId: newGoalData.user_id,
        title: newGoalData.title,
        description: newGoalData.description || undefined,
        category: newGoalData.category,
        goalType: newGoalData.goal_type as 'quantitative' | 'habit',
        targetValue: newGoalData.target_value || undefined,
        currentValue: newGoalData.current_value || undefined,
        unit: newGoalData.unit || undefined,
        weeklyFrequency: newGoalData.weekly_frequency || undefined,
        startDate: new Date(newGoalData.start_date),
        endDate: newGoalData.end_date ? new Date(newGoalData.end_date) : undefined,
        status: newGoalData.status as 'active' | 'completed' | 'archived',
        createdAt: new Date(newGoalData.created_at),
        updatedAt: new Date(newGoalData.updated_at),
      };

      set((state) => ({
        goals: [...state.goals, newGoal],
      }));
    } catch (error) {
      console.error('Add goal error:', error);
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.goalType) updateData.goal_type = updates.goalType;
      if (updates.targetValue !== undefined) updateData.target_value = updates.targetValue;
      if (updates.currentValue !== undefined) updateData.current_value = updates.currentValue;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.weeklyFrequency !== undefined) updateData.weekly_frequency = updates.weeklyFrequency;
      if (updates.startDate) updateData.start_date = updates.startDate.toISOString().split('T')[0];
      if (updates.endDate !== undefined) updateData.end_date = updates.endDate ? updates.endDate.toISOString().split('T')[0] : null;
      if (updates.status) updateData.status = updates.status;

      const { error } = await supabase
        .from('goals')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Update goal error:', error);
        return;
      }

      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id
            ? { ...goal, ...updates, updatedAt: new Date() }
            : goal
        ),
      }));
    } catch (error) {
      console.error('Update goal error:', error);
    }
  },

  deleteGoal: async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete goal error:', error);
        return;
      }

      set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
      }));
    } catch (error) {
      console.error('Delete goal error:', error);
    }
  },

  getGoalById: (id) => {
    return get().goals.find((goal) => goal.id === id);
  },

  // Daily Record actions
  addDailyRecord: async (recordData) => {
    try {
      const { data: newRecordData, error } = await supabase
        .from('daily_records')
        .insert({
          goal_id: recordData.goalId,
          date: recordData.date.toISOString().split('T')[0],
          value: recordData.value,
          increment: recordData.increment,
          completed: recordData.completed,
          note: recordData.note,
        })
        .select()
        .single();

      if (error || !newRecordData) {
        console.error('Add daily record error:', error);
        return;
      }

      const newRecord: DailyRecord = {
        id: newRecordData.id,
        goalId: newRecordData.goal_id,
        date: new Date(newRecordData.date),
        value: newRecordData.value || undefined,
        increment: newRecordData.increment || undefined,
        completed: newRecordData.completed || undefined,
        note: newRecordData.note || undefined,
        createdAt: new Date(newRecordData.created_at),
      };

      set((state) => ({
        dailyRecords: [...state.dailyRecords, newRecord],
      }));

      // Update goal's current value if quantitative
      const goal = get().getGoalById(recordData.goalId);
      if (goal && goal.goalType === 'quantitative' && recordData.value !== undefined) {
        get().updateGoal(recordData.goalId, {
          currentValue: recordData.value,
        });
      }
    } catch (error) {
      console.error('Add daily record error:', error);
    }
  },

  getRecordsByGoalId: (goalId) => {
    return get().dailyRecords.filter((record) => record.goalId === goalId);
  },

  // AI Conversation actions
  addConversation: async (title) => {
    try {
      const userId = get().user?.id;
      if (!userId) return '';

      const { data: newConvData, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title,
          messages: [],
        })
        .select()
        .single();

      if (error || !newConvData) {
        console.error('Add conversation error:', error);
        return '';
      }

      const newConversation: AIConversation = {
        id: newConvData.id,
        userId: newConvData.user_id,
        title: newConvData.title,
        messages: newConvData.messages || [],
        createdAt: new Date(newConvData.created_at),
        updatedAt: new Date(newConvData.updated_at),
      };

      set((state) => ({
        conversations: [...state.conversations, newConversation],
      }));
      return newConversation.id;
    } catch (error) {
      console.error('Add conversation error:', error);
      return '';
    }
  },

  addMessage: async (conversationId, role, content) => {
    try {
      const newMessage = {
        id: 'msg-' + Date.now(),
        role,
        content,
        timestamp: new Date(),
      };

      // Get current conversation
      const conversation = get().conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const updatedMessages = [...conversation.messages, newMessage];

      // Update in Supabase
      const { error } = await supabase
        .from('ai_conversations')
        .update({
          messages: updatedMessages,
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Add message error:', error);
        return;
      }

      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: updatedMessages,
                updatedAt: new Date(),
              }
            : conv
        ),
      }));

      // Simulate AI response for assistant role
      if (role === 'user') {
        setTimeout(() => {
          const aiResponse = generateMockAIResponse(content);
          get().addMessage(conversationId, 'assistant', aiResponse);
        }, 1000);
      }
    } catch (error) {
      console.error('Add message error:', error);
    }
  },
}));

// Mock AI response generator
function generateMockAIResponse(userMessage: string): string {
  const responses = [
    `좋은 질문이네요! ${userMessage}에 대해 말씀드리자면, 목표 달성을 위해서는 꾸준함이 가장 중요합니다. 하루에 작은 진전이라도 계속 이어나가는 것이 성공의 비결입니다.`,
    `현재 진행 상황을 분석해보니, 잘하고 계시네요! 이 페이스를 유지하시면 충분히 목표를 달성하실 수 있습니다. 다만, 주말에 조금 더 시간을 투자하시면 더 빠르게 목표에 도달하실 수 있을 것 같아요.`,
    `${userMessage}와 관련하여, 몇 가지 구체적인 전략을 제안드립니다:\n\n1. 매일 같은 시간에 목표 활동하기\n2. 작은 성취라도 기록하기\n3. 어려움이 있을 때는 목표를 세분화하기\n\n이 방법들을 시도해보시는 건 어떨까요?`,
    `좋은 진전이 있으시네요! 통계를 보니 지난주보다 15% 더 활발하게 활동하셨어요. 이 추세를 계속 유지하시면 목표 달성이 더 수월할 것 같습니다. 힘내세요!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}