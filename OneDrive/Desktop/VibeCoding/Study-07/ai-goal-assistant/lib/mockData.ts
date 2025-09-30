import { User, Goal, DailyRecord, AIConversation, AIMessage } from '@/types';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: '홍길동',
  createdAt: new Date('2025-01-01'),
};

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'TOEIC 900점 달성',
    description: '영어 실력 향상을 위한 목표',
    category: '학습',
    goalType: 'quantitative',
    targetValue: 900,
    currentValue: 750,
    unit: '점',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-04-30'),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: '주 3회 운동',
    description: '건강한 습관 만들기',
    category: '건강',
    goalType: 'habit',
    weeklyFrequency: 3,
    startDate: new Date('2025-01-01'),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: '월 10권 독서',
    description: '지식 확장을 위한 독서',
    category: '학습',
    goalType: 'quantitative',
    targetValue: 10,
    currentValue: 4,
    unit: '권',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-25'),
  },
  {
    id: 'goal-4',
    userId: 'user-1',
    title: '매일 30분 명상',
    description: '마음의 평화를 위한 명상',
    category: '건강',
    goalType: 'habit',
    weeklyFrequency: 7,
    startDate: new Date('2025-01-01'),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-28'),
  },
  {
    id: 'goal-5',
    userId: 'user-1',
    title: '부업으로 월 100만원',
    description: '추가 수입 창출',
    category: '재정',
    goalType: 'quantitative',
    targetValue: 1000000,
    currentValue: 450000,
    unit: '원',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: 'active',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-28'),
  },
];

// Mock Daily Records
export const mockDailyRecords: DailyRecord[] = [
  // Goal 1 records
  {
    id: 'record-1',
    goalId: 'goal-1',
    date: new Date('2025-01-20'),
    value: 720,
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 'record-2',
    goalId: 'goal-1',
    date: new Date('2025-01-25'),
    value: 750,
    createdAt: new Date('2025-01-25'),
  },
  // Goal 2 records
  {
    id: 'record-3',
    goalId: 'goal-2',
    date: new Date('2025-01-27'),
    completed: true,
    note: '30분 러닝, 기분 좋음',
    createdAt: new Date('2025-01-27'),
  },
  {
    id: 'record-4',
    goalId: 'goal-2',
    date: new Date('2025-01-28'),
    completed: true,
    note: '웨이트 트레이닝',
    createdAt: new Date('2025-01-28'),
  },
  // Goal 3 records
  {
    id: 'record-5',
    goalId: 'goal-3',
    date: new Date('2025-01-25'),
    value: 4,
    increment: 1,
    note: '자기계발서 1권 완료',
    createdAt: new Date('2025-01-25'),
  },
];

// Mock AI Conversations
export const mockConversations: AIConversation[] = [
  {
    id: 'conv-1',
    userId: 'user-1',
    title: '운동 목표 조언',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '운동 목표를 어떻게 달성할 수 있을까요?',
        timestamp: new Date('2025-01-28T10:00:00'),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `현재 주 3회 운동 목표를 잘 진행하고 계시네요! 이번주 이미 2회 완료하셨습니다.

지속 가능한 운동 습관을 위한 추천 전략:

1. 운동 시간을 고정하세요
   - 매주 월, 수, 금 저녁 7시처럼 특정 시간대를 정하면 습관화가 쉬워집니다

2. 작게 시작하세요
   - 처음부터 과도한 목표는 오래 가지 못합니다
   - 30분 가벼운 운동으로 시작해서 점진적으로 늘려가세요

3. 운동 파트너를 만드세요
   - 함께 운동하면 동기부여가 되고 빠지기 어려워집니다

4. 다양한 운동을 시도하세요
   - 러닝, 웨이트, 수영 등을 번갈아가며 하면 지루하지 않습니다

현재 속도라면 충분히 목표를 달성하실 수 있어요!`,
        timestamp: new Date('2025-01-28T10:01:00'),
      },
    ],
    createdAt: new Date('2025-01-28T10:00:00'),
    updatedAt: new Date('2025-01-28T10:01:00'),
  },
];

// Helper function to calculate goal progress
export const calculateProgress = (goal: Goal): number => {
  if (goal.goalType === 'quantitative' && goal.targetValue && goal.currentValue) {
    return Math.round((goal.currentValue / goal.targetValue) * 100);
  }
  if (goal.goalType === 'habit' && goal.weeklyFrequency) {
    // For demo purposes, return mock progress
    return Math.floor(Math.random() * 100);
  }
  return 0;
};

// Helper function to get goals by status
export const getGoalsByStatus = (status: 'active' | 'completed') => {
  return mockGoals.filter(goal => goal.status === status);
};

// Helper function to get recent activity data
export const getRecentActivityData = () => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.map((day, index) => ({
    day,
    count: Math.floor(Math.random() * 5) + 1,
  }));
};

// Helper function to get category distribution
export const getCategoryDistribution = () => {
  const categories = ['건강', '학습', '커리어', '취미', '재정'] as const;
  return categories.map(category => ({
    category,
    count: mockGoals.filter(g => g.category === category).length,
    avgProgress: Math.floor(Math.random() * 100),
  }));
};