import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
        <Button onClick={() => navigate('/dashboard')}>
          대시보드로 이동
        </Button>
        <Button variant="ghost" onClick={handleGoBack}>
          이전 페이지
        </Button>
      </div>
    </div>
  );
}
