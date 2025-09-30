'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { calculateProgress } from '@/lib/mockData';
import { TrendingUp, Target, CheckCircle, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, goals } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const averageProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, goal) => sum + calculateProgress(goal), 0) /
            activeGoals.length
        )
      : 0;

  // Mock weekly activity data
  const weeklyActivity = [
    { day: '월', count: 4 },
    { day: '화', count: 3 },
    { day: '수', count: 5 },
    { day: '목', count: 2 },
    { day: '금', count: 4 },
    { day: '토', count: 3 },
    { day: '일', count: 5 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            안녕하세요, {user?.name}님!
          </h1>
          <p className="text-indigo-100">
            오늘도 목표를 향해 한 걸음 나아가볼까요?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">진행 중</h3>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {activeGoals.length}개
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">완료됨</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {completedGoals.length}개
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">평균 진행률</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {averageProgress}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">주간 활동</h3>
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">7일</p>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">최근 7일 활동</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Goals List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">내 목표</h2>
            <button
              onClick={() => router.push('/goals/new')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              + 새 목표
            </button>
          </div>

          <div className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">아직 목표가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">
                  새 목표를 만들어 시작해보세요!
                </p>
              </div>
            ) : (
              activeGoals.map((goal) => {
                const progress = calculateProgress(goal);
                return (
                  <div
                    key={goal.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => router.push(`/goals/${goal.id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {goal.category === '건강' && '💪'}
                          {goal.category === '학습' && '🎓'}
                          {goal.category === '커리어' && '💼'}
                          {goal.category === '취미' && '🎨'}
                          {goal.category === '재정' && '💰'}
                          {goal.category === '기타' && '📌'}
                          {' ' + goal.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {goal.goalType === 'quantitative' && (
                            <>
                              {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                            </>
                          )}
                          {goal.goalType === 'habit' && (
                            <>주 {goal.weeklyFrequency || 0}회 목표</>
                          )}
                          {goal.endDate && (
                            <span className="ml-3">
                              D-
                              {Math.ceil(
                                (new Date(goal.endDate).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
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
                );
              })
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AI 인사이트
              </h3>
              <p className="text-gray-700 mb-4">
                {activeGoals.length > 0
                  ? `현재 ${activeGoals.length}개의 목표를 진행중이시네요! 평균 진행률이 ${averageProgress}%로 좋은 페이스를 유지하고 계십니다. 계속해서 꾸준히 목표를 업데이트하시면 더 좋은 결과를 얻으실 수 있습니다.`
                  : '첫 목표를 설정하고 여정을 시작해보세요!'}
              </p>
              <button
                onClick={() => router.push('/ai-coach')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                AI 코칭 받기 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}