import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useLoanDetail } from '@/hooks/useLoanDetail';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useRecommendation } from '@/hooks/useRecommendation';
import { formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/common/StatusBadge';
import CustomerInfoCard from '@/components/loan-detail/CustomerInfoCard';
import BusinessInfoCard from '@/components/loan-detail/BusinessInfoCard';
import ApplicationRequestCard from '@/components/loan-detail/ApplicationRequestCard';
import ConditionComparisonCard from '@/components/loan-detail/ConditionComparisonCard';
import SystemCollectedCard from '@/components/loan-detail/SystemCollectedCard';
import CBScoreCard from '@/components/loan-detail/CBScoreCard';
import SGradeCard from '@/components/loan-detail/SGradeCard';
import SCBScoreCard from '@/components/loan-detail/SCBScoreCard';
import ShapExplanation from '@/components/loan-detail/ShapExplanation';
import ApprovalModal from '@/components/loan-detail/ApprovalModal';
import RejectionModal from '@/components/loan-detail/RejectionModal';
import EscalationDialog from '@/components/loan-detail/EscalationDialog';
import type { ApprovalPayload, RejectionPayload, EscalationPayload } from '@/types';

type TabKey = 'info' | 'mybizdata' | 'sgrade' | 'review';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: '정보' },
  { key: 'mybizdata', label: 'MY BIZ DATA' },
  { key: 'sgrade', label: 'S등급 분석' },
  { key: 'review', label: '심사 결과' },
];

export default function LoanDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: authUser } = useAuthMe();

  const loanId = useMemo(() => {
    const parsed = Number(idParam);
    if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) return null;
    return parsed;
  }, [idParam]);

  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useLoanDetail(loanId ?? 0);
  const mutations = useLoanMutations(loanId ?? 0);

  // 심사 결과 탭에서 추천값 표시용 (탭이 review일 때 조회)
  const { data: recommendation, isLoading: isRecommendationLoading } = useRecommendation(
    loanId ?? 0,
    activeTab === 'review',
  );

  // 모달 열릴 때 body 스크롤 방지
  const isAnyModalOpen = isApprovalOpen || isRejectionOpen || isEscalationOpen;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isAnyModalOpen]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-text-secondary">데이터를 불러오는 중입니다</p>
      </div>
    );
  }

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

  const userRole = authUser?.role;
  const status = data.reviewStatus;

  const canTellerAct = userRole === 'ADMIN_BANK_TELLER' && status === 'UNDER_REVIEW';
  const canManagerAct = userRole === 'ADMIN_BANK_MANAGER' && status === 'MANAGER_REVIEW';

  const showApproveReject = canTellerAct || canManagerAct;
  const showEscalation = canTellerAct;
  const isDecided = status === 'APPROVED' || status === 'REJECTED';

  const handleApprove = (payload: ApprovalPayload) => {
    if (userRole === 'ADMIN_BANK_MANAGER') {
      mutations.managerApprove.mutate(payload, { onSuccess: () => setIsApprovalOpen(false) });
    } else {
      mutations.approve.mutate(payload, { onSuccess: () => setIsApprovalOpen(false) });
    }
  };

  const handleReject = (payload: RejectionPayload) => {
    if (userRole === 'ADMIN_BANK_MANAGER') {
      mutations.managerReject.mutate(payload, { onSuccess: () => setIsRejectionOpen(false) });
    } else {
      mutations.reject.mutate(payload, { onSuccess: () => setIsRejectionOpen(false) });
    }
  };

  const handleEscalate = (payload: EscalationPayload) => {
    mutations.escalate.mutate(payload, { onSuccess: () => setIsEscalationOpen(false) });
  };

  const isApproving = mutations.approve.isPending || mutations.managerApprove.isPending;
  const isRejecting = mutations.reject.isPending || mutations.managerReject.isPending;
  const isEscalating = mutations.escalate.isPending;
  const approveError = mutations.approve.error || mutations.managerApprove.error;
  const rejectError = mutations.reject.error || mutations.managerReject.error;
  const escalateError = mutations.escalate.error;

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            aria-label="목록으로 돌아가기"
          >
            ← 목록
          </button>
          <h1 className="text-xl font-bold text-text-primary">
            {data.customerInfo.name} / {data.businessInfo.businessName}
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {data.productInfo.productName}
          </span>
          <StatusBadge status={data.reviewStatus} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            신청일: {formatDate(data.applicationDate)}
          </span>
          <span className="text-sm text-text-secondary">
            담당자: {data.assigneeName}
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6 border-b border-border-default">
        <nav className="flex gap-0" aria-label="상세 탭">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── 정보 탭 ─── */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-2 gap-4">
          {/* 1행: 고객 기본 정보 | 사업자 정보 */}
          <CustomerInfoCard data={data.customerInfo} />
          <BusinessInfoCard data={data.businessInfo} />

          {/* 2행: 고객 신청 정보 (2열 전체) */}
          <div className="col-span-2">
            <ApplicationRequestCard
              condition={data.applicationCondition}
              applicantInput={data.applicantInput}
              productInfo={data.productInfo}
              termsAgreements={data.termsAgreements}
            />
          </div>
        </div>
      )}

      {/* ─── MY BIZ DATA 탭 ─── */}
      {activeTab === 'mybizdata' && (
        <SystemCollectedCard data={data.systemCollectedData} />
      )}

      {/* ─── S등급 분석 탭 ─── */}
      {activeTab === 'sgrade' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CBScoreCard score={data.cbScore} />
            <SGradeCard grade={data.sGrade} />
            <SCBScoreCard
              scbScore={data.scbScore}
              cbScore={data.cbScore}
              bonusPoints={data.bonusPoints}
              sGrade={data.sGrade}
            />
          </div>
          <ShapExplanation loanId={loanId} />
        </div>
      )}

      {/* ─── 심사 결과 탭 ─── */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          {/* 상품 기준 | 신청 조건 | 승인 결과 3열 비교 */}
          <ConditionComparisonCard
            product={data.productInfo}
            applicationCondition={data.applicationCondition}
            recommendation={recommendation}
            isLoading={isRecommendationLoading}
            reviewStatus={data.reviewStatus}
          />

          {/* 심사 처리 버튼 */}
          {!isDecided && (showApproveReject || showEscalation) && (
            <div className="flex items-center justify-end gap-3">
              {showEscalation && (
                <button
                  type="button"
                  onClick={() => setIsEscalationOpen(true)}
                  className="rounded-md border border-info px-5 py-2.5 text-sm font-medium text-info transition-colors hover:bg-info/5"
                >
                  추가 결재 요청
                </button>
              )}
              {showApproveReject && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejectionOpen(true)}
                    className="rounded-md border border-error px-5 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/5"
                  >
                    거절
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(true)}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark"
                  >
                    승인
                  </button>
                </>
              )}
            </div>
          )}

          {isDecided && (
            <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-card">
              {status === 'APPROVED' ? (
                <p className="text-sm text-text-secondary">이 건은 이미 승인 처리되었습니다.</p>
              ) : (
                <div>
                  <p className="mb-2 text-sm font-medium text-error">이 건은 거절 처리되었습니다.</p>
                  {data.rejectionComment && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">거절 사유: </span>
                      {data.rejectionComment}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
