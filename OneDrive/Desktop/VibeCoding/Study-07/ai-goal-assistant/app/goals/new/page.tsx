'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { GoalCategory, GoalType } from '@/types';

export default function NewGoalPage() {
  const router = useRouter();
  const addGoal = useStore((state) => state.addGoal);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '학습' as GoalCategory,
    goalType: 'quantitative' as GoalType,
    targetValue: 0,
    currentValue: 0,
    unit: '',
    weeklyFrequency: 3,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert('목표 제목을 입력해주세요.');
      return;
    }

    addGoal({
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      goalType: formData.goalType,
      targetValue:
        formData.goalType === 'quantitative'
          ? formData.targetValue
          : undefined,
      currentValue:
        formData.goalType === 'quantitative'
          ? formData.currentValue
          : undefined,
      unit: formData.goalType === 'quantitative' ? formData.unit : undefined,
      weeklyFrequency:
        formData.goalType === 'habit' ? formData.weeklyFrequency : undefined,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      status: 'active',
    });

    router.push('/goals');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>뒤로가기</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">새 목표 만들기</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="예) TOEIC 900점 달성, 매일 30분 운동"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="목표에 대한 설명을 입력하세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['건강', '학습', '커리어', '취미', '재정', '기타'] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        formData.category === cat
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Goal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 유형 *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, goalType: 'quantitative' })
                  }
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    formData.goalType === 'quantitative'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">정량적 목표</div>
                  <div className="text-xs mt-1 opacity-70">숫자로 측정</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goalType: 'habit' })}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    formData.goalType === 'habit'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">습관형 목표</div>
                  <div className="text-xs mt-1 opacity-70">반복 실천</div>
                </button>
              </div>
            </div>

            {/* Quantitative Goal Fields */}
            {formData.goalType === 'quantitative' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      목표값 *
                    </label>
                    <input
                      type="number"
                      value={formData.targetValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetValue: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      단위 *
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      placeholder="예) 점, 권, kg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재값
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentValue: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Habit Goal Fields */}
            {formData.goalType === 'habit' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주간 목표 횟수 *
                </label>
                <input
                  type="number"
                  value={formData.weeklyFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyFrequency: Number(e.target.value),
                    })
                  }
                  min="1"
                  max="7"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일 *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마감일
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                목표 생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}