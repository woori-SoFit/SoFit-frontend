import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // SPA에서 최초 진입 시 history.length는 보통 2 (초기 엔트리 + 현재 페이지)
    // 따라서 2보다 클 때만 이전 페이지가 존재한다고 판단
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="text-6xl mb-4 text-text-disabled">403</div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        접근 권한이 없습니다
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        이 페이지에 접근할 수 있는 권한이 없습니다.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-primary text-text-inverse rounded-md text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
        >
          대시보드로 이동
        </button>
        <button
          type="button"
          onClick={handleGoBack}
          className="px-4 py-2 bg-bg-surface text-text-primary border border-border-default rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
