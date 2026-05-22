import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useLoanSummary } from '@/hooks/useLoanSummary';
import { useLoanDetail } from '@/hooks/useLoanDetail';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useReviewTab } from '@/hooks/useReviewTab';
import { formatDate } from '@/utils/formatters';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/Button';
import CustomerInfoCard from '@/components/loan-detail/CustomerInfoCard';
import BusinessInfoCard from '@/components/loan-detail/BusinessInfoCard';
import ApplicationRequestCard from '@/components/loan-detail/ApplicationRequestCard';
import ConditionComparisonCard from '@/components/loan-detail/ConditionComparisonCard';
import MyBizDataCard from '@/components/loan-detail/MyBizDataCard';
import CBScoreCard from '@/components/loan-detail/CBScoreCard';
import SGradeCard from '@/components/loan-detail/SGradeCard';
import SCBScoreCard from '@/components/loan-detail/SCBScoreCard';
import ShapExplanation from '@/components/loan-detail/ShapExplanation';
import type { ApprovalPayload, RejectionPayload, EscalationPayload } from '@/types';
import type { EditableApprovalCondition } from '@/components/loan-detail/ConditionComparisonCard';

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
  const [approvalCondition, setApprovalCondition] = useState<EditableApprovalCondition | null>(null);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | 'escalate' | null>(null);
  const [comment, setComment] = useState('');

  const { data, isLoading, isError, refetch } = useLoanDetail(loanId ?? 0);
  const { data: summary } = useLoanSummary(loanId ?? 0);
  const mutations = useLoanMutations(loanId ?? 0);

  // 심사 결과 탭 전용 데이터 (탭이 review일 때 조회)
  const { data: reviewTab, isLoading: isReviewTabLoading } = useReviewTab(
    loanId ?? 0,
    activeTab === 'review',
  );

  if (loanId === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-lg font-medium text-text-primary">존재하지 않는 페이지입니다.</p>
        <Button onClick={() => navigate('/dashboard')}>목록으로 이동</Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-lg font-medium text-text-primary">해당 대출 신청 건을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/dashboard')}>목록으로 이동</Button>
      </div>
    );
  }

  const userRole = authUser?.role;
  const status = summary?.status ?? data?.reviewStatus;

  const canTellerAct = userRole === 'ADMIN_BANK_TELLER' && (status === 'SYSTEM_APPROVED' || status === 'SYSTEM_HOLD');
  const canManagerAct = userRole === 'ADMIN_BANK_MANAGER' && status === 'MANAGER_REVIEW';

  const showApproveReject = canTellerAct || canManagerAct;
  const showEscalation = canTellerAct;
  const isDecided = status === 'APPROVED' || status === 'REJECTED';

  const handleSelectAction = (action: 'approve' | 'reject' | 'escalate') => {
    setPendingAction(action);
    setComment('');
  };

  const handleSubmit = () => {
    if (!comment.trim() || !pendingAction) return;

    const onSuccess = () => {
      setComment('');
      setPendingAction(null);
    };

    if (pendingAction === 'approve') {
      if (!approvalCondition) return;
      const payload: ApprovalPayload = {
        approvedAmount: approvalCondition.approvedAmount,
        interestRate: approvalCondition.approvedRate,
        loanTermMonths: approvalCondition.approvedTerm,
        repaymentMethod: approvalCondition.repaymentMethod,
        comment: comment.trim(),
      };
      mutations.approve.mutate(payload, { onSuccess });
    } else if (pendingAction === 'reject') {
      const payload: RejectionPayload = { comment: comment.trim() };
      mutations.reject.mutate(payload, { onSuccess });
    } else if (pendingAction === 'escalate') {
      const payload: EscalationPayload = { comment: comment.trim() };
      mutations.escalate.mutate(payload, { onSuccess });
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setComment('');
  };

  const isApproving = mutations.approve.isPending;
  const isRejecting = mutations.reject.isPending;
  const isEscalating = mutations.escalate.isPending;
  const isProcessing = isApproving || isRejecting || isEscalating;
  const mutationError = mutations.approve.error || mutations.reject.error || mutations.escalate.error;

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
            {summary?.applicantName ?? '-'} / {summary?.businessName ?? '-'}
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {summary?.productName ?? '-'}
          </span>
          {summary && <StatusBadge status={summary.status} />}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            신청일: {summary ? formatDate(summary.appliedAt) : '-'}
          </span>
          <span className="text-sm text-text-secondary">
            담당자: {summary?.assigneeName ?? '-'}
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
              applicationInfo={data.applicationInfo}
              userInputInfo={data.userInputInfo}
              productInfo={data.productInfo}
              consentHistories={data.consentHistories}
            />
          </div>
        </div>
      )}

      {/* ─── MY BIZ DATA 탭 ─── */}
      {activeTab === 'mybizdata' && (
        <MyBizDataCard data={data.myBizData} />
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
          {/* 상품 기준 | 신청 조건 | 승인 결과 3열 비교 + 심사 처리 */}
          <ConditionComparisonCard
            product={reviewTab?.productInfo ?? data.productInfo}
            applicationInfo={reviewTab?.applicationInfo ?? data.applicationInfo}
            recommendation={reviewTab?.recommendation}
            isLoading={isReviewTabLoading}
            editable={showApproveReject}
            onConditionChange={setApprovalCondition}
            decisions={reviewTab?.decisions ?? []}
          >
            {!isDecided && (showApproveReject || showEscalation) && (
              <>
                {/* 액션 선택 버튼 */}
                {!pendingAction && (
                  <div className="flex items-center justify-end gap-2">
                    {showEscalation && (
                      <Button
                        variant="outline-info"
                        onClick={() => handleSelectAction('escalate')}
                      >
                        추가 결재
                      </Button>
                    )}
                    {showApproveReject && (
                      <>
                        <Button
                          variant="outline-error"
                          onClick={() => handleSelectAction('reject')}
                        >
                          거절
                        </Button>
                        <Button
                          onClick={() => handleSelectAction('approve')}
                          disabled={!approvalCondition}
                        >
                          승인
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* 의견 입력 영역 (액션 선택 후 표시) */}
                {pendingAction && (
                  <div className="space-y-3">
                    <label htmlFor="reviewComment" className="block text-sm font-medium text-text-primary">
                      {pendingAction === 'approve' && '승인 의견 (필수)'}
                      {pendingAction === 'reject' && '거절 사유 (필수)'}
                      {pendingAction === 'escalate' && '전달 의견 (필수)'}
                    </label>
                    <textarea
                      id="reviewComment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      maxLength={500}
                      rows={6}
                      placeholder={
                        pendingAction === 'approve'
                          ? '승인 의견을 입력해 주세요.'
                          : pendingAction === 'reject'
                            ? '거절 사유를 입력해 주세요.'
                            : '전달 의견을 입력해 주세요.'
                      }
                      disabled={isProcessing}
                      className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus disabled:opacity-50"
                    />

                    {mutationError && (
                      <p className="text-sm text-error">처리에 실패했습니다. 다시 시도해 주세요.</p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-disabled">{comment.length}/500</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={handleCancelAction}
                          disabled={isProcessing}
                        >
                          취소
                        </Button>
                        <Button
                          variant={
                            pendingAction === 'reject'
                              ? 'outline-error'
                              : pendingAction === 'escalate'
                                ? 'outline-info'
                                : 'primary'
                          }
                          onClick={handleSubmit}
                          disabled={!comment.trim() || isProcessing || (pendingAction === 'approve' && !approvalCondition)}
                        >
                          {isProcessing
                            ? '처리 중...'
                            : pendingAction === 'approve'
                              ? '승인 확인'
                              : pendingAction === 'reject'
                                ? '거절 확인'
                                : '결재 요청'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </ConditionComparisonCard>
        </div>
      )}

    </div>
  );
}
