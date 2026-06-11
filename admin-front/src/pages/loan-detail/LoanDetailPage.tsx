import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useLoanSummary } from '@/hooks/useLoanSummary';
import { useInfoTab } from '@/hooks/useInfoTab';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useReviewTab } from '@/hooks/useReviewTab';
import { useMyBizData } from '@/hooks/useMyBizData';
import { useSGradeTab } from '@/hooks/useSGradeTab';
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
import type { ApprovalPayload, RejectionPayload } from '@/types';
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
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');

  const { data: infoTab, isLoading, isError, refetch } = useInfoTab(loanId ?? 0);
  const { data: summary } = useLoanSummary(loanId ?? 0);
  const mutations = useLoanMutations(loanId ?? 0, {
    onSuccess: () => {
      setComment('');
      setPendingAction(null);
    },
  });

  // 심사 결과 탭 전용 데이터 (탭이 review일 때 조회)
  const { data: reviewTab, isLoading: isReviewTabLoading } = useReviewTab(
    loanId ?? 0,
    activeTab === 'review',
  );

  // MY BIZ DATA 탭 전용 데이터 (탭이 mybizdata일 때 조회)
  const { data: myBizData, isLoading: isMyBizDataLoading } = useMyBizData(
    loanId ?? 0,
    activeTab === 'mybizdata',
  );

  // S등급 분석 탭 전용 데이터 (탭이 sgrade일 때 조회)
  const { data: sGradeTab, isLoading: isSGradeTabLoading } = useSGradeTab(
    loanId ?? 0,
    activeTab === 'sgrade',
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

  if (!infoTab) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="mb-4 text-lg font-medium text-text-primary">해당 대출 신청 건을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/dashboard')}>목록으로 이동</Button>
      </div>
    );
  }

  const userRole = authUser?.role;
  const status = summary?.status ?? 'SUBMITTED';

  // 담당자 본인 여부 확인 (userId가 있으면 ID 비교, 없으면 이름 비교로 fallback)
  const isAssignedToMe = authUser
    ? authUser.userId
      ? summary?.assignedBankerId === authUser.userId
      : summary?.assigneeName === authUser.name
    : false;

  const canTellerAct = userRole === 'ADMIN_BANK_TELLER' && isAssignedToMe && (status === 'SYSTEM_APPROVED' || status === 'SYSTEM_REJECTED');
  const canManagerAct = userRole === 'ADMIN_BANK_MANAGER' && status === 'MANAGER_REVIEW';

  // 시스템 거절 시 은행원은 거절 확인만 가능
  const isSystemRejected = status === 'SYSTEM_REJECTED';
  const showApproveReject = canTellerAct || canManagerAct;
  const isDecided = status === 'APPROVED' || status === 'REJECTED';

  const handleSelectAction = (action: 'approve' | 'reject') => {
    setPendingAction(action);
    setComment('');
  };

  const handleSubmit = () => {
    if (!loanId || !comment.trim() || !pendingAction) return;

    if (pendingAction === 'approve') {
      if (!approvalCondition) return;
      const payload: ApprovalPayload = {
        approvedAmount: approvalCondition.approvedAmount,
        approvedRate: approvalCondition.approvedRate,
        approvedTerm: approvalCondition.approvedTerm,
        repaymentMethod: approvalCondition.repaymentMethod,
        comment: comment.trim(),
      };
      mutations.approve.mutate(payload);
    } else if (pendingAction === 'reject') {
      const payload: RejectionPayload = { comment: comment.trim() };
      mutations.reject.mutate(payload);
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setComment('');
  };

  const isApproving = mutations.approve.isPending;
  const isRejecting = mutations.reject.isPending;
  const isProcessing = isApproving || isRejecting;
  const mutationError = mutations.approve.error || mutations.reject.error;

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors"
            aria-label="목록으로 돌아가기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-text-primary">
            {summary?.applicantName ?? '-'} / {summary?.businessName ?? '-'}
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {summary?.productName ?? '-'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            신청일: {summary ? formatDate(summary.appliedAt) : '-'}
          </span>
          <span className="text-sm text-text-secondary">
            담당자: {summary?.assigneeName ?? '-'}
          </span>
          {summary && <StatusBadge status={summary.status} />}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6 flex items-center justify-between border-b border-border-default">
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
        {activeTab === 'mybizdata' && (
          <span className="pr-1 text-sm text-text-secondary">
            기준 월: 2025.05
          </span>
        )}
      </div>

      {/* ─── 정보 탭 ─── */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-3 gap-6">
          {/* 1열: 고객 기본 정보 + 사업자 정보 (세로 스택) */}
          <div className="space-y-6">
            <CustomerInfoCard data={infoTab.applicantInfo} />
            <BusinessInfoCard data={infoTab.businessInfo} />
          </div>

          {/* 2~3열: 신청 정보 (1열과 높이 맞춤) */}
          <div className="col-span-2 [&>*]:h-full">
            <ApplicationRequestCard
              applicationInfo={infoTab.applicationInfo}
              userInputInfo={infoTab.userInputInfo}
              productName={summary?.productName}
              consentHistories={infoTab.consentHistories}
            />
          </div>
        </div>
      )}

      {/* ─── MY BIZ DATA 탭 ─── */}
      {activeTab === 'mybizdata' && (
        isMyBizDataLoading
          ? <LoadingState />
          : <MyBizDataCard data={myBizData} businessName={summary?.businessName} />
      )}

      {/* ─── S등급 분석 탭 ─── */}
      {activeTab === 'sgrade' && (
        isSGradeTabLoading
          ? <LoadingState />
          : sGradeTab ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <CBScoreCard score={sGradeTab.cbScore.score} />
                <SGradeCard grade={sGradeTab.sGrade} />
                <SCBScoreCard
                  scbScore={sGradeTab.scbInfo.score}
                  cbScore={sGradeTab.cbScore.score}
                  bonusPoints={sGradeTab.scbInfo.bonusPoints}
                  sGrade={sGradeTab.sGrade}
                />
              </div>
              <ShapExplanation shapResult={sGradeTab.shapResult} />
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-text-secondary">
              S등급 분석 데이터가 아직 생성되지 않았습니다.
            </div>
          )
      )}

      {/* ─── 심사 결과 탭 ─── */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          {isReviewTabLoading ? (
            <LoadingState />
          ) : reviewTab ? (
          /* 상품 기준 | 신청 조건 | 승인 결과 3열 비교 + 심사 처리 */
          <ConditionComparisonCard
            product={reviewTab.productInfo}
            applicationInfo={reviewTab.applicationInfo}
            recommendation={reviewTab.recommendation}
            isLoading={false}
            editable={showApproveReject}
            onConditionChange={setApprovalCondition}
            decisions={reviewTab.decisions ?? []}
            isRejected={status === 'REJECTED'}
          >
            {!isDecided && showApproveReject && (
              <>
                {/* 액션 선택 버튼 */}
                {!pendingAction && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAction('reject')}
                      className="text-error hover:bg-error/5"
                    >
                      {canTellerAct && isSystemRejected
                        ? '거절 확인'
                        : canTellerAct
                          ? '거절 요청'
                          : '최종 거절'}
                    </Button>
                    {!isSystemRejected && (
                      <Button
                        size="sm"
                        onClick={() => handleSelectAction('approve')}
                        disabled={!approvalCondition}
                      >
                        {canTellerAct ? '승인 요청' : '최종 승인'}
                      </Button>
                    )}
                  </div>
                )}

                {/* 의견 입력 영역 (액션 선택 후 표시) */}
                {pendingAction && (
                  <div className="space-y-3">
                    <label htmlFor="reviewComment" className="block text-sm font-medium text-text-primary">
                      {pendingAction === 'approve' && '승인 의견 (필수)'}
                      {pendingAction === 'reject' && '거절 사유 (필수)'}
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
                          : '거절 사유를 입력해 주세요.'
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
                          size="sm"
                          onClick={handleCancelAction}
                          disabled={isProcessing}
                        >
                          취소
                        </Button>
                        <Button
                          variant={
                            pendingAction === 'reject'
                              ? 'ghost'
                              : 'primary'
                          }
                          size="sm"
                          onClick={handleSubmit}
                          disabled={!comment.trim() || isProcessing || (pendingAction === 'approve' && !approvalCondition)}
                          className={pendingAction === 'reject' ? 'text-error hover:bg-error/5' : ''}
                        >
                          {isProcessing
                            ? '처리 중...'
                            : canTellerAct
                              ? isSystemRejected
                                ? '거절 확인'
                                : pendingAction === 'approve'
                                  ? '승인 요청'
                                  : '거절 요청'
                              : pendingAction === 'approve'
                                ? '최종 승인'
                                : '최종 거절'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </ConditionComparisonCard>
          ) : (
            <div className="py-12 text-center text-sm text-text-secondary">
              심사 결과 데이터를 불러올 수 없습니다.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
