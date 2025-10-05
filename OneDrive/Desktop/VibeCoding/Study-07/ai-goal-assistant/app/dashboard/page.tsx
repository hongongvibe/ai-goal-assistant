'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const goals = useStore((state) => state.goals);
  const loadGoals = useStore((state) => state.loadGoals);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">목표 달성 현황을 한눈에 확인하세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">진행 중인 목표</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{activeGoals.length}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">완료한 목표</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedGoals.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 진행률</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{avgProgress}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
          <div className="flex gap-4">
            <Link
              href="/goals/new"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              + 새 목표 추가
            </Link>
            <Link
              href="/goals"
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              📝 일일 기록 작성
            </Link>
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">진행 중인 목표</h2>
            <Link href="/goals" className="text-sm text-blue-600 hover:text-blue-700">
              전체 보기 →
            </Link>
          </div>

          <div className="space-y-4">
            {activeGoals.slice(0, 5).map((goal) => (
              <Link
                key={goal.id}
                href={`/goals/${goal.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(goal.start_date).toLocaleDateString('ko-KR')} ~ {new Date(goal.end_date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.category === 'health' ? 'bg-green-100 text-green-700' :
                    goal.category === 'learning' ? 'bg-blue-100 text-blue-700' :
                    goal.category === 'finance' ? 'bg-yellow-100 text-yellow-700' :
                    goal.category === 'career' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {goal.category === 'health' ? '건강' :
                     goal.category === 'learning' ? '학습' :
                     goal.category === 'finance' ? '재정' :
                     goal.category === 'career' ? '커리어' : '기타'}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">진행률</span>
                    <span className="font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}

            {activeGoals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>진행 중인 목표가 없습니다.</p>
                <Link href="/goals/new" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                  첫 목표를 만들어보세요 →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
