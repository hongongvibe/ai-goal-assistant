'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { calculateProgress } from '@/lib/mockData';
import { Plus, Trash2, Edit, Target } from 'lucide-react';
import { GoalStatus } from '@/types';

export default function GoalsPage() {
  const router = useRouter();
  const { isAuthenticated, goals, deleteGoal } = useStore();
  const [filter, setFilter] = useState<GoalStatus | 'all'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredGoals =
    filter === 'all' ? goals : goals.filter((g) => g.status === filter);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`"${title}" 목표를 삭제하시겠습니까?`)) {
      deleteGoal(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">목표 관리</h1>
          <button
            onClick={() => router.push('/goals/new')}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>새 목표</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                filter === status
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' && '전체'}
              {status === 'active' && '진행중'}
              {status === 'completed' && '완료'}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all'
                ? '목표가 없습니다'
                : filter === 'active'
                ? '진행중인 목표가 없습니다'
                : '완료된 목표가 없습니다'}
            </h3>
            <p className="text-gray-500 mb-6">
              새로운 목표를 만들어 시작해보세요!
            </p>
            <button
              onClick={() => router.push('/goals/new')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              목표 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal);
              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition"
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {goal.category}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/goals/${goal.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id, goal.title)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600 transition"
                    onClick={() => router.push(`/goals/${goal.id}`)}
                  >
                    {goal.title}
                  </h3>

                  {/* Description */}
                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Goal Info */}
                  <div className="space-y-2 mb-4">
                    {goal.goalType === 'quantitative' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">진행</span>
                        <span className="font-medium text-gray-900">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                    )}
                    {goal.goalType === 'habit' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">빈도</span>
                        <span className="font-medium text-gray-900">
                          주 {goal.weeklyFrequency || 0}회
                        </span>
                      </div>
                    )}
                    {goal.endDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">마감일</span>
                        <span className="font-medium text-gray-900">
                          {goal.endDate.replace(/-/g, '. ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">진행률</span>
                      <span className="text-sm font-bold text-indigo-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => router.push(`/goals/${goal.id}`)}
                    className="w-full mt-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    상세 보기
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}