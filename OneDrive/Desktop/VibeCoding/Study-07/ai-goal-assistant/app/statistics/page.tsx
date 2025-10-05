'use client';

import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatisticsPage() {
  const goals = useStore((state) => state.goals);
  const dailyRecords = useStore((state) => state.dailyRecords);
  const loadGoals = useStore((state) => state.loadGoals);
  const loadDailyRecords = useStore((state) => state.loadDailyRecords);

  useEffect(() => {
    loadGoals();
    loadDailyRecords();
  }, [loadGoals, loadDailyRecords]);

  // Category distribution
  const categoryData = [
    { name: '건강', value: goals.filter(g => g.category === 'health' && g.status === 'active').length },
    { name: '학습', value: goals.filter(g => g.category === 'learning' && g.status === 'active').length },
    { name: '재정', value: goals.filter(g => g.category === 'finance' && g.status === 'active').length },
    { name: '커리어', value: goals.filter(g => g.category === 'career' && g.status === 'active').length },
  ].filter(item => item.value > 0);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

  // Weekly progress
  const weeklyData = [
    { week: '1주차', progress: 65 },
    { week: '2주차', progress: 72 },
    { week: '3주차', progress: 68 },
    { week: '4주차', progress: 85 },
  ];

  // Goals progress
  const goalsProgressData = goals
    .filter(g => g.status === 'active')
    .map(goal => ({
      name: goal.title.length > 15 ? goal.title.substring(0, 15) + '...' : goal.title,
      progress: goal.progress || 0,
    }));

  // Stats
  const totalGoals = goals.length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = activeGoals > 0
    ? Math.round(goals.filter(g => g.status === 'active').reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">통계</h1>
          <p className="text-gray-600 mt-1">나의 목표 달성 현황을 분석하세요</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">전체 목표</p>
            <p className="text-3xl font-bold text-gray-900">{totalGoals}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">진행 중</p>
            <p className="text-3xl font-bold text-blue-600">{activeGoals}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">완료</p>
            <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">평균 진행률</p>
            <p className="text-3xl font-bold text-purple-600">{avgProgress}%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">카테고리별 분포</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">진행 중인 목표가 없습니다</p>
            )}
          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">주간 진행률</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Progress */}
        {goalsProgressData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">목표별 진행 현황</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={goalsProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="progress" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">달성 현황</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm text-gray-600">연속 달성 기록</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">7일</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm text-gray-600">이번 달 완료 목표</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedGoals}개</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm text-gray-600">전체 기록 수</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{dailyRecords.length}개</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
