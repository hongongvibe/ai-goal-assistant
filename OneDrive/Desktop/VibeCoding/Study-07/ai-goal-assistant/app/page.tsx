import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🎯 AI 목표 달성 도우미
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI 기반 개인 목표 관리로 더 나은 내일을 만들어보세요
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors border-2 border-blue-600"
          >
            회원가입
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">목표 추적</h3>
            <p className="text-sm text-gray-600">체계적인 목표 관리와 진행 상황 추적</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="font-semibold mb-2">시각화</h3>
            <p className="text-sm text-gray-600">그래프로 한눈에 보는 성과</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI 코칭</h3>
            <p className="text-sm text-gray-600">맞춤형 조언과 동기부여</p>
          </div>
        </div>
      </div>
    </div>
  );
}
