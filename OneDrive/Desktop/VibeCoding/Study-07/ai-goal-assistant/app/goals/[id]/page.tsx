'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const goals = useStore((state) => state.goals);
  const dailyRecords = useStore((state) => state.dailyRecords);
  const loadGoals = useStore((state) => state.loadGoals);
  const loadDailyRecords = useStore((state) => state.loadDailyRecords);
  const updateGoal = useStore((state) => state.updateGoal);
  const deleteGoal = useStore((state) => state.deleteGoal);
  const addDailyRecord = useStore((state) => state.addDailyRecord);

  useEffect(() => {
    loadGoals();
    loadDailyRecords();
  }, [loadGoals, loadDailyRecords]);

  const goal = goals.find((g) => g.id === resolvedParams.id);
  const records = dailyRecords.filter((r) => r.goal_id === resolvedParams.id);

  const [newRecordValue, setNewRecordValue] = useState('');
  const [newRecordNotes, setNewRecordNotes] = useState('');

  if (!goal) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">목표를 찾을 수 없습니다.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDailyRecord({
      goal_id: goal.id,
      record_date: new Date().toISOString().split('T')[0],
      value: Number(newRecordValue),
      notes: newRecordNotes
    });

    setNewRecordValue('');
    setNewRecordNotes('');
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 목표를 삭제하시겠습니까?')) {
      await deleteGoal(goal.id);
      router.push('/goals');
    }
  };

  const handleComplete = async () => {
    await updateGoal(goal.id, { status: 'completed' });
  };

  // Chart data
  const chartData = records
    .sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())
    .map((record, index, arr) => {
      const cumulative = arr.slice(0, index + 1).reduce((sum, r) => sum + r.value, 0);
      return {
        date: new Date(record.record_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        value: cumulative,
        progress: Math.min(Math.round((cumulative / goal.target_value) * 100), 100)
      };
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
            <p className="text-gray-600 mt-1">{goal.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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

        {/* Goal Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">목표 수치</p>
              <p className="text-2xl font-bold text-gray-900">{goal.target_value} {goal.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">현재 달성</p>
              <p className="text-2xl font-bold text-blue-600">
                {records.reduce((sum, r) => sum + r.value, 0)} {goal.unit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">진행률</p>
              <p className="text-2xl font-bold text-purple-600">{goal.progress}%</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
              style={{ width: `${goal.progress}%` }}
            />
          </div>

          <div className="mt-6 flex justify-between text-sm text-gray-600">
            <span>시작: {new Date(goal.start_date).toLocaleDateString('ko-KR')}</span>
            <span>종료: {new Date(goal.end_date).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">진행 추이</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Daily Record */}
        {goal.status === 'active' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">일일 기록 추가</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                    달성량 ({goal.unit})
                  </label>
                  <input
                    id="value"
                    type="number"
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="오늘 달성한 수치"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    메모 (선택)
                  </label>
                  <input
                    id="notes"
                    type="text"
                    value={newRecordNotes}
                    onChange={(e) => setNewRecordNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="간단한 메모"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                기록 추가
              </button>
            </form>
          </div>
        )}

        {/* Daily Records */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">기록 내역</h2>
          {records.length > 0 ? (
            <div className="space-y-3">
              {records
                .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
                .map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {record.value} {goal.unit}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.record_date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">아직 기록이 없습니다.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {goal.status === 'active' && (
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              ✅ 목표 달성 완료
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            🗑️ 목표 삭제
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
