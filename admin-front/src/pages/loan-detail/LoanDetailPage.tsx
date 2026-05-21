import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useLoanDetail } from '@/hooks/useLoanDetail';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import StatusBadge from '@/components/common/StatusBadge';
import CustomerInfoCard from '@/components/loan-detail/CustomerInfoCard';
import BusinessInfoCard from '@/components/loan-detail/BusinessInfoCard';
import ApplicationConditionCard from '@/components/loan-detail/ApplicationConditionCard';
import ApplicantInputCard from '@/components/loan-detail/ApplicantInputCard';
import SystemCollectedCard from '@/components/loan-detail/SystemCollectedCard';
import CBScoreCard from '@/components/loan-detail/CBScoreCard';
import SGradeCard from '@/components/loan-detail/SGradeCard';
import SCBScoreCard from '@/components/loan-detail/SCBScoreCard';
import ShapExplanation from '@/components/loan-detail/ShapExplanation';
import ApprovalModal from '@/components/loan-detail/ApprovalModal';
import RejectionModal from '@/components/loan-detail/RejectionModal';
import EscalationDialog from '@/components/loan-detail/EscalationDialog';
import type { ApprovalPayload, RejectionPayload, EscalationPayload } from '@/types';

/**
 * 신청일을 "YYYY.MM.DD" 형식으로 변환한다.
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 대출 신청 상세 페이지.
 * URL 파라미터 :id로 상세 데이터를 조회하고,
 * 역할/상태에 따라 승인/거절/추가결재 액션을 제공한다.
 */
export default function LoanDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: authUser } = useAuthMe();

  // URL 파라미터 유효성 검증
  const loanId = useMemo(() => {
    const parsed = Number(idParam);
    if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) return null;
    return parsed;
  }, [idParam]);

  // 모달 상태
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useLoanDetail(loanId ?? 0);
  const mutations = useLoanMutations(loanId ?? 0);

  // 유효하지 않은 ID → 404 안내
  if (loanId === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-lg font-medium text-text-primary">존재하지 않는 페이지입니다.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-dark transition-colors"
        >
          목록으로 이동
        </button>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-text-secondary">데이터를 불러오는 중입니다</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-sm text-text-secondary">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-dark transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 데이터 없음 (404)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-lg font-medium text-text-primary">해당 대출 신청 건을 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-dark transition-colors"
        >
          목록으로 이동
        </button>
      </div>
    );
  }

  // 역할/상태 기반 버튼 표시 로직
  const userRole = authUser?.role;
  const status = data.reviewStatus;

  // 은행원: UNDER_REVIEW 상태에서만 승인/거절/추가결재 가능
  const canTellerAct = userRole === 'ADMIN_BANK_TELLER' && status === 'UNDER_REVIEW';
  // 지점장: MANAGER_REVIEW 상태에서만 승인/거절 가능
  const canManagerAct = userRole === 'ADMIN_BANK_MANAGER' && status === 'MANAGER_REVIEW';
  // 개발자: 모든 상태에서 버튼 표시 (UNDER_REVIEW, MANAGER_REVIEW)
  const canDevAct = userRole === 'ADMIN_DEV' && (status === 'UNDER_REVIEW' || status === 'MANAGER_REVIEW');

  const showApproveReject = canTellerAct || canManagerAct || canDevAct;
  const showEscalation = canTellerAct || (userRole === 'ADMIN_DEV' && status === 'UNDER_REVIEW');

  // 이미 결정된 건은 버튼 비활성화
  const isDecided = status === 'APPROVED' || status === 'REJECTED';

  // 승인 처리
  const handleApprove = (payload: ApprovalPayload) => {
    if (userRole === 'ADMIN_BANK_MANAGER' || (userRole === 'ADMIN_DEV' && status === 'MANAGER_REVIEW')) {
      mutations.managerApprove.mutate(payload, {
        onSuccess: () => setIsApprovalOpen(false),
      });
    } else {
      mutations.approve.mutate(payload, {
        onSuccess: () => setIsApprovalOpen(false),
      });
    }
  };

  // 거절 처리
  const handleReject = (payload: RejectionPayload) => {
    if (userRole === 'ADMIN_BANK_MANAGER' || (userRole === 'ADMIN_DEV' && status === 'MANAGER_REVIEW')) {
      mutations.managerReject.mutate(payload, {
        onSuccess: () => setIsRejectionOpen(false),
      });
    } else {
      mutations.reject.mutate(payload, {
        onSuccess: () => setIsRejectionOpen(false),
      });
    }
  };

  // 추가 결재 요청
  const handleEscalate = (payload: EscalationPayload) => {
    mutations.escalate.mutate(payload, {
      onSuccess: () => setIsEscalationOpen(false),
    });
  };

  const isApproving = mutations.approve.isPending || mutations.managerApprove.isPending;
  const isRejecting = mutations.reject.isPending || mutations.managerReject.isPending;
  const isEscalating = mutations.escalate.isPending;
  const approveError = mutations.approve.error || mutations.managerApprove.error;
  const rejectError = mutations.reject.error || mutations.managerReject.error;
  const escalateError = mutations.escalate.error;

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            aria-label="목록으로 돌아가기"
          >
            ← 목록
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-text-primary">
              {data.customerInfo.name} / {data.businessInfo.businessName}
            </h1>
            <StatusBadge status={data.reviewStatus} />
          </div>
          <span className="text-sm text-text-secondary">
            신청일: {formatDate(data.applicationDate)}
          </span>
        </div>

        {/* 액션 버튼 */}
        {!isDecided && (showApproveReject || showEscalation) && (
          <div className="flex items-center gap-2">
            {showEscalation && (
              <button
                type="button"
                onClick={() => setIsEscalationOpen(true)}
                className="rounded-md border border-info px-4 py-2 text-sm font-medium text-info transition-colors hover:bg-info/5"
              >
                추가 결재 요청
              </button>
            )}
            {showApproveReject && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejectionOpen(true)}
                  className="rounded-md border border-error px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/5"
                >
                  거절
                </button>
                <button
                  type="button"
                  onClick={() => setIsApprovalOpen(true)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark"
                >
                  승인
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4열 레이아웃: 고객정보, 사업자정보, 신청조건, 신청자입력 */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CustomerInfoCard data={data.customerInfo} />
        <BusinessInfoCard data={data.businessInfo} />
        <ApplicationConditionCard data={data.applicationCondition} />
        <ApplicantInputCard data={data.applicantInput} />
      </div>

      {/* 전체 너비: 시스템 수집 정보 */}
      <div className="mb-6">
        <SystemCollectedCard data={data.systemCollectedData} />
      </div>

      {/* 3열 레이아웃: CB점수, 성장S등급, SCB점수 */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <CBScoreCard score={data.cbScore} />
        <SGradeCard grade={data.sGrade} />
        <SCBScoreCard
          scbScore={data.scbScore}
          cbScore={data.cbScore}
          bonusPoints={data.bonusPoints}
          sGrade={data.sGrade}
        />
      </div>

      {/* 전체 너비: SHAP 설명 */}
      <div className="mb-6">
        <ShapExplanation loanId={loanId} />
      </div>

      {/* 모달 */}
      <ApprovalModal
        loanId={loanId}
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onSubmit={handleApprove}
        isSubmitting={isApproving}
        error={approveError}
      />

      <RejectionModal
        isOpen={isRejectionOpen}
        onClose={() => setIsRejectionOpen(false)}
        onSubmit={handleReject}
        isSubmitting={isRejecting}
        error={rejectError}
      />

      <EscalationDialog
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        onSubmit={handleEscalate}
        isSubmitting={isEscalating}
        error={escalateError}
      />
    </div>
  );
}
