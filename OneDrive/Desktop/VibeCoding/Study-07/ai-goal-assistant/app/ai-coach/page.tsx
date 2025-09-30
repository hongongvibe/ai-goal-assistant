'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Send, Plus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function AICoachPage() {
  const router = useRouter();
  const { isAuthenticated, conversations, addConversation, addMessage } =
    useStore();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConvId
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Select first conversation or create a new one
    if (conversations.length > 0 && !selectedConvId) {
      setSelectedConvId(conversations[0].id);
    } else if (conversations.length === 0) {
      const newConvId = addConversation('새 대화');
      setSelectedConvId(newConvId);
      // Add welcome message
      setTimeout(() => {
        addMessage(
          newConvId,
          'assistant',
          '안녕하세요! AI 목표 코칭입니다. 목표 달성을 위해 어떤 도움이 필요하신가요?'
        );
      }, 500);
    }
  }, [isAuthenticated, conversations, selectedConvId, addConversation, addMessage, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConvId) return;

    setIsTyping(true);
    addMessage(selectedConvId, 'user', inputMessage);
    setInputMessage('');

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleNewConversation = () => {
    const newConvId = addConversation(`대화 ${conversations.length + 1}`);
    setSelectedConvId(newConvId);
    // Add welcome message
    setTimeout(() => {
      addMessage(
        newConvId,
        'assistant',
        '새로운 대화를 시작합니다. 무엇을 도와드릴까요?'
      );
    }, 500);
  };

  const suggestedQuestions = [
    '이 목표를 어떻게 달성할 수 있을까요?',
    '진행이 더딘 이유가 뭘까요?',
    '동기부여가 필요해요',
    '더 효과적인 계획을 세워주세요',
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>새 대화</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                대화 기록이 없습니다
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedConvId === conv.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium text-sm truncate">
                      {conv.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(conv.updatedAt), 'MM/dd HH:mm')}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">AI 목표 코칭</h1>
            <p className="text-sm text-gray-500 mt-1">
              AI와 함께 목표를 달성하세요
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!selectedConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">대화를 선택하거나 새로 시작하세요</p>
                </div>
              </div>
            ) : (
              <>
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } rounded-2xl px-6 py-4`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {message.role === 'user' ? '👤' : '🤖'}
                        </span>
                        <span className="text-xs opacity-70">
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🤖</span>
                        <span className="text-gray-500">입력 중...</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Suggested Questions */}
          {selectedConversation && selectedConversation.messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">💡 추천 질문:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInputMessage(question)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                disabled={!selectedConvId}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !selectedConvId}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>전송</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}