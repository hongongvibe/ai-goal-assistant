import { Goal, DailyRecord, User } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: '김철수',
  created_at: '2025-01-01T00:00:00Z'
};

export const mockGoals: Goal[] = [
  {
    id: '1',
    user_id: '1',
    title: '매일 아침 운동하기',
    description: '건강한 삶을 위해 매일 아침 30분씩 운동합니다.',
    category: 'health',
    start_date: '2025-01-01',
    end_date: '2025-03-31',
    target_value: 90,
    unit: '일',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    progress: 65
  },
  {
    id: '2',
    user_id: '1',
    title: 'Python 마스터하기',
    description: '하루 2시간씩 Python 공부하기',
    category: 'learning',
    start_date: '2025-01-01',
    end_date: '2025-06-30',
    target_value: 180,
    unit: '시간',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    progress: 42
  },
  {
    id: '3',
    user_id: '1',
    title: '월 50만원 저축하기',
    description: '재정 목표를 위해 매월 50만원씩 저축',
    category: 'finance',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    target_value: 600,
    unit: '만원',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    progress: 88
  },
  {
    id: '4',
    user_id: '1',
    title: '자격증 취득하기',
    description: '정보처리기사 자격증 공부',
    category: 'career',
    start_date: '2025-01-01',
    end_date: '2025-04-30',
    target_value: 120,
    unit: '시간',
    status: 'active',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    progress: 25
  },
  {
    id: '5',
    user_id: '1',
    title: '독서 습관 만들기',
    description: '매주 1권씩 책 읽기',
    category: 'learning',
    start_date: '2024-12-01',
    end_date: '2025-02-28',
    target_value: 12,
    unit: '권',
    status: 'completed',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2025-02-28T00:00:00Z',
    progress: 100
  }
];

export const mockDailyRecords: DailyRecord[] = [
  // 운동 기록
  { id: '1', goal_id: '1', record_date: '2025-01-01', value: 1, notes: '아침 조깅 30분', created_at: '2025-01-01T09:00:00Z' },
  { id: '2', goal_id: '1', record_date: '2025-01-02', value: 1, notes: '홈트레이닝', created_at: '2025-01-02T09:00:00Z' },
  { id: '3', goal_id: '1', record_date: '2025-01-03', value: 1, notes: '수영', created_at: '2025-01-03T09:00:00Z' },
  { id: '4', goal_id: '1', record_date: '2025-01-05', value: 1, notes: '아침 요가', created_at: '2025-01-05T09:00:00Z' },

  // Python 공부 기록
  { id: '5', goal_id: '2', record_date: '2025-01-01', value: 2, notes: '기초 문법 복습', created_at: '2025-01-01T20:00:00Z' },
  { id: '6', goal_id: '2', record_date: '2025-01-02', value: 3, notes: '데이터 구조 학습', created_at: '2025-01-02T20:00:00Z' },
  { id: '7', goal_id: '2', record_date: '2025-01-03', value: 2, notes: '알고리즘 문제 풀이', created_at: '2025-01-03T20:00:00Z' },

  // 저축 기록
  { id: '8', goal_id: '3', record_date: '2025-01-31', value: 50, notes: '1월 저축', created_at: '2025-01-31T23:59:00Z' },
  { id: '9', goal_id: '3', record_date: '2025-02-28', value: 50, notes: '2월 저축', created_at: '2025-02-28T23:59:00Z' },

  // 자격증 공부 기록
  { id: '10', goal_id: '4', record_date: '2025-01-01', value: 3, notes: '운영체제 공부', created_at: '2025-01-01T21:00:00Z' },
  { id: '11', goal_id: '4', record_date: '2025-01-02', value: 2, notes: '데이터베이스 이론', created_at: '2025-01-02T21:00:00Z' },
];

// 통계를 위한 헬퍼 함수
export function getGoalProgress(goalId: string): number {
  const goal = mockGoals.find(g => g.id === goalId);
  if (!goal) return 0;

  const records = mockDailyRecords.filter(r => r.goal_id === goalId);
  const totalValue = records.reduce((sum, r) => sum + r.value, 0);

  return Math.min(Math.round((totalValue / goal.target_value) * 100), 100);
}

export function getCategoryDistribution() {
  const distribution: Record<string, number> = {};
  mockGoals.filter(g => g.status === 'active').forEach(goal => {
    distribution[goal.category] = (distribution[goal.category] || 0) + 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

export function getWeeklyProgress() {
  const weeks = ['1주', '2주', '3주', '4주'];
  return weeks.map((week) => ({
    week,
    progress: Math.floor(Math.random() * 40) + 60
  }));
}
