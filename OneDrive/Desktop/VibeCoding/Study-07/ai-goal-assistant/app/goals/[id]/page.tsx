'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { calculateProgress } from '@/lib/mockData';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, getGoalById, getRecordsByGoalId, addDailyRecord } =
    useStore();

  const goal = getGoalById(params.id as string);
  const records = getRecordsByGoalId(params.id as string);

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    value: 0,
    completed: false,
    note: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !goal) {
    return null;
  }

  const progress = calculateProgress(goal);

  // Generate mock progress trend data
  const progressTrend = Array.from({ length: 10 }, (_, i) => ({
    date: format(
      new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000),
      'MM/dd'
    ),
    value: Math.floor(Math.random() * 100),
  }));

  const handleAddRecord = () => {
    if (goal.goalType === 'quantitative' && newRecord.value <= 0) {
      alert('값을 입력해주세요.');
      return;
    }

    addDailyRecord({
      goalId: goal.id,
      date: new Date(),
      value: goal.goalType === 'quantitative' ? newRecord.value : undefined,
      completed: goal.goalType === 'habit' ? newRecord.completed : undefined,
      note: newRecord.note || undefined,
    });

    setShowAddRecord(false);
    setNewRecord({ value: 0, completed: false, note: '' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>뒤로가기</span>
        </button>

        {/* Goal Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">
                  {goal.category === '건강' && '💪'}
                  {goal.category === '학습' && '🎓'}
                  {goal.category === '커리어' && '💼'}
                  {goal.category === '취미' && '🎨'}
                  {goal.category === '재정' && '💰'}
                  {goal.category === '기타' && '📌'}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {goal.title}
                </h1>
              </div>
              <p className="text-gray-600">{goal.description}</p>
            </div>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {goal.category}
            </span>
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - progress / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-3xl font-bold text-indigo-600">
                    {progress}%
                  </div>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                {goal.goalType === 'quantitative' && (
                  <p className="text-lg">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </p>
                )}
                {goal.goalType === 'habit' && (
                  <p className="text-lg">주 {goal.weeklyFrequency}회 목표</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">시작일</p>
              <p className="font-medium text-gray-900">
                {goal.startDate.replace(/-/g, '.')}
              </p>
            </div>
            {goal.endDate && (
              <div className="text-center">
                <p className="text-sm text-gray-500">마감일</p>
                <p className="font-medium text-gray-900">
                  {goal.endDate.replace(/-/g, '.')}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-gray-500">진행 일수</p>
              <p className="font-medium text-gray-900">
                {Math.floor(
                  (Date.now() - new Date(goal.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                일
              </p>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">진행 추이</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">최근 기록</h2>
            <button
              onClick={() => setShowAddRecord(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>기록 추가</span>
            </button>
          </div>

          {/* Add Record Form */}
          {showAddRecord && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">새 기록 추가</h3>
              <div className="space-y-4">
                {goal.goalType === 'quantitative' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      값
                    </label>
                    <input
                      type="number"
                      value={newRecord.value}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          value: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                )}
                {goal.goalType === 'habit' && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRecord.completed}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            completed: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-indigo-600 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        완료
                      </span>
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메모
                  </label>
                  <input
                    type="text"
                    value={newRecord.note}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, note: e.target.value })
                    }
                    placeholder="오늘의 기록을 남겨보세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddRecord(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddRecord}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Records List */}
          <div className="space-y-3">
            {records.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">아직 기록이 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">
                  첫 기록을 남겨보세요!
                </p>
              </div>
            ) : (
              records
                .slice()
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.date.replace(/-/g, '. ').replace('T', ' ').split('.')[0]}년 {record.date.split('-')[1]}월 {record.date.split('-')[2].substring(0, 2)}일
                      </span>
                      {record.value !== undefined && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {record.increment !== undefined &&
                            record.increment > 0 &&
                            '+'}
                          {record.increment || record.value} {goal.unit}
                        </span>
                      )}
                      {record.completed && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          완료
                        </span>
                      )}
                    </div>
                    {record.note && (
                      <p className="text-sm text-gray-600">{record.note}</p>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 border border-indigo-100">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🤖</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AI 분석
              </h3>
              <p className="text-gray-700 mb-4">
                현재 목표의 진행률이 {progress}%입니다.
                {progress >= 80 && ' 정말 잘하고 계시네요!'}
                {progress >= 50 && progress < 80 && ' 좋은 페이스입니다!'}
                {progress < 50 && ' 조금 더 노력하면 좋을 것 같아요.'}
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