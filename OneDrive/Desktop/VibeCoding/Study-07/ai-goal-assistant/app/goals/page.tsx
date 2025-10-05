'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';

export default function GoalsPage() {
  const goals = useStore((state) => state.goals);
  const loadGoals = useStore((state) => state.loadGoals);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active' && goal.status !== 'active') return false;
    if (filter === 'completed' && goal.status !== 'completed') return false;
    if (categoryFilter !== 'all' && goal.category !== categoryFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">목표 관리</h1>
            <p className="text-gray-600 mt-1">나의 모든 목표를 관리하세요</p>
          </div>
          <Link
            href="/goals/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + 새 목표 추가
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                진행 중
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                완료
              </button>
            </div>

            <div className="ml-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 카테고리</option>
                <option value="health">건강</option>
                <option value="learning">학습</option>
                <option value="finance">재정</option>
                <option value="career">커리어</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => (
            <Link
              key={goal.id}
              href={`/goals/${goal.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
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

              <p className="text-gray-600 mb-4 line-clamp-2">{goal.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">목표</span>
                  <span className="font-medium text-gray-900">{goal.target_value} {goal.unit}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">기간</span>
                  <span className="font-medium text-gray-900">
                    {new Date(goal.start_date).toLocaleDateString('ko-KR')} ~ {new Date(goal.end_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {goal.status === 'active' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">진행률</span>
                      <span className="font-medium text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </>
                )}

                {goal.status === 'completed' && (
                  <div className="flex items-center justify-center bg-green-50 text-green-700 py-2 rounded-lg">
                    <span className="font-medium">✅ 달성 완료!</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">해당하는 목표가 없습니다.</p>
            <Link href="/goals/new" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              새 목표를 만들어보세요 →
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
