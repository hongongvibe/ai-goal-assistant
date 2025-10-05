'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoachPage() {
  const goals = useStore((state) => state.goals);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 저는 AI 목표 달성 코치입니다. 🤖\n\n현재 진행 중인 목표에 대해 분석하고 맞춤형 조언을 드릴 수 있습니다. 무엇을 도와드릴까요?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockResponses = [
    '훌륭하네요! 현재 진행률을 보니 목표를 향해 잘 나아가고 있습니다. 이 속도를 유지하면 목표 달성이 가능할 것 같습니다. 💪',
    '좋은 질문입니다. 제가 데이터를 분석한 결과, 주말에 기록이 부족한 것으로 보입니다. 주말에도 꾸준히 실천하면 더 좋은 결과를 얻을 수 있을 것입니다.',
    '현재 목표들을 보면 건강과 학습에 집중하고 계시네요. 균형있는 접근 방식이 좋습니다. 각 목표에 대해 구체적인 일일 계획을 세우시는 것을 추천드립니다.',
    '데이터를 보니 초반 의지가 강했지만 최근 들어 기록 빈도가 줄어들고 있습니다. 목표를 더 작은 단위로 나누어 부담을 줄이는 것은 어떨까요?',
    '축하합니다! 🎉 일부 목표에서 높은 달성률을 보이고 계십니다. 이런 성공 경험을 다른 목표에도 적용해보세요.',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage: Message = { role: 'assistant', content: randomResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const quickQuestions = [
    '내 목표 진행 상황을 분석해줘',
    '어떻게 하면 더 잘 달성할 수 있을까?',
    '동기부여가 필요해',
    '목표 설정 조언을 해줘',
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI 코칭</h1>
          <p className="text-gray-600 mt-1">목표 달성을 위한 맞춤형 조언을 받아보세요</p>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">📊 오늘의 인사이트</h2>
          <div className="space-y-2">
            <p>• 진행 중인 목표: {goals.filter(g => g.status === 'active').length}개</p>
            <p>• 평균 진행률: {Math.round(goals.filter(g => g.status === 'active').reduce((sum, g) => sum + (g.progress || 0), 0) / Math.max(goals.filter(g => g.status === 'active').length, 1))}%</p>
            <p>• 이번 주 기록: 12회 (지난주 대비 +3회)</p>
            <p className="pt-2 border-t border-white/30 mt-3">
              💡 <strong>추천:</strong> 가장 진행률이 낮은 목표에 집중해보세요!
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">빠른 질문:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
