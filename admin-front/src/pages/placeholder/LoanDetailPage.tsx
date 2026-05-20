import { useParams } from 'react-router-dom';

/**
 * 대출 상세 Placeholder 페이지
 * 실제 콘텐츠는 별도 스펙에서 구현
 */
export default function LoanDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary">
        대출 상세 {id && <span className="text-text-secondary">#{id}</span>}
      </h1>
    </div>
  );
}
