'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { calculateProgress } from '@/lib/mockData';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StatisticsPage() {
  const router = useRouter();
  const { isAuthenticated, goals } = useStore();

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

  // Category distribution data
  const categoryData = [
    {
      name: '건강',
      value: goals.filter((g) => g.category === '건강').length,
      color: '#3b82f6',
    },
    {
      name: '학습',
      value: goals.filter((g) => g.category === '학습').length,
      color: '#8b5cf6',
    },
    {
      name: '커리어',
      value: goals.filter((g) => g.category === '커리어').length,
      color: '#10b981',
    },
    {
      name: '취미',
      value: goals.filter((g) => g.category === '취미').length,
      color: '#f59e0b',
    },
    {
      name: '재정',
      value: goals.filter((g) => g.category === '재정').length,
      color: '#ef4444',
    },
  ].filter((item) => item.value > 0);

  // Monthly progress data
  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    month: `${i + 1}월`,
    goals: Math.floor(Math.random() * 10) + 5,
    completed: Math.floor(Math.random() * 5) + 2,
  }));

  // Progress by goal
  const goalProgressData = activeGoals.map((goal) => ({
    name: goal.title.length > 15 ? goal.title.slice(0, 15) + '...' : goal.title,
    progress: calculateProgress(goal),
  }));

  // Activity heatmap data (mock)
  const generateHeatmapData = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const weeks = 4;
    const data = [];

    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < days.length; day++) {
        data.push({
          day: days[day],
          week: `Week ${week + 1}`,
          value: Math.floor(Math.random() * 5),
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">통계</h1>
          <p className="text-gray-500 mt-2">목표 달성 현황을 한눈에 확인하세요</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{goals.length}</span>
            </div>
            <p className="text-blue-100">전체 목표 수</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{completedGoals.length}</span>
            </div>
            <p className="text-green-100">완료된 목표</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">
                {activeGoals.length > 0
                  ? Math.round(
                      activeGoals.reduce(
                        (sum, goal) => sum + calculateProgress(goal),
                        0
                      ) / activeGoals.length
                    )
                  : 0}
                %
              </span>
            </div>
            <p className="text-purple-100">평균 진행률</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">28</span>
            </div>
            <p className="text-orange-100">최장 스트릭</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              카테고리별 분포
            </h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                데이터가 없습니다
              </div>
            )}
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">월별 추이</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="goals"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="전체 목표"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="완료된 목표"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            목표별 진행률
          </h2>
          {goalProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goalProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              진행 중인 목표가 없습니다
            </div>
          )}
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">활동 히트맵</h2>
          <div className="grid grid-cols-7 gap-2">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-600 font-medium">
                {day}
              </div>
            ))}
            {heatmapData.map((item, index) => {
              const opacity = item.value === 0 ? 0.1 : item.value * 0.25;
              return (
                <div
                  key={index}
                  className="aspect-square rounded-lg"
                  style={{
                    backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                  }}
                  title={`${item.week} ${item.day}: ${item.value}개 활동`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-end mt-4 space-x-2">
            <span className="text-xs text-gray-500">적음</span>
            <div className="flex space-x-1">
              {[0.1, 0.25, 0.5, 0.75, 1].map((opacity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">많음</span>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 인사이트</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              • 현재 {activeGoals.length}개의 목표를 진행중이며, 평균 진행률은{' '}
              {activeGoals.length > 0
                ? Math.round(
                    activeGoals.reduce(
                      (sum, goal) => sum + calculateProgress(goal),
                      0
                    ) / activeGoals.length
                  )
                : 0}
              %입니다.
            </p>
            <p className="text-gray-700">
              • 가장 활발한 카테고리는{' '}
              <span className="font-semibold text-indigo-600">
                {categoryData.length > 0
                  ? categoryData.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).name
                  : '없음'}
              </span>
              입니다.
            </p>
            <p className="text-gray-700">
              • 지금까지 총 {completedGoals.length}개의 목표를 완료했습니다!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}