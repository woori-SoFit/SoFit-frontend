import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthMe } from '@/hooks/useAuthMe';
import { useLoanSummary } from '@/hooks/useLoanSummary';
import { useLoanDetail } from '@/hooks/useLoanDetail';
import { useLoanMutations } from '@/hooks/useLoanMutations';
import { useRecommendation } from '@/hooks/useRecommendation';
import { formatDate, formatDateTime } from '@/utils/formatters';
import StatusBadge from '@/components/common/StatusBadge';
import CustomerInfoCard from '@/components/loan-detail/CustomerInfoCard';
import BusinessInfoCard from '@/components/loan-detail/BusinessInfoCard';
import ApplicationRequestCard from '@/components/loan-detail/ApplicationRequestCard';
import ConditionComparisonCard from '@/components/loan-detail/ConditionComparisonCard';
import MyBizDataCard from '@/components/loan-detail/MyBizDataCard';
import CBScoreCard from '@/components/loan-detail/CBScoreCard';
import SGradeCard from '@/components/loan-detail/SGradeCard';
import SCBScoreCard from '@/components/loan-detail/SCBScoreCard';
import ShapExplanation from '@/components/loan-detail/ShapExplanation';
import Card from '@/components/common/Card';
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
  const [comment, setComment] = useState('');

  const { data, isLoading, isError, refetch } = useLoanDetail(loanId ?? 0);
  const { data: summary } = useLoanSummary(loanId ?? 0);
  const mutations = useLoanMutations(loanId ?? 0);

  // 심사 결과 탭에서 추천값 표시용 (탭이 review일 때 조회)
  const { data: recommendation, isLoading: isRecommendationLoading } = useRecommendation(
    loanId ?? 0,
    activeTab === 'review',
  );

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
  const status = summary?.status ?? data?.reviewStatus;

  const canTellerAct = userRole === 'ADMIN_BANK_TELLER' && (status === 'SYSTEM_APPROVED' || status === 'SYSTEM_HOLD');
  const canManagerAct = userRole === 'ADMIN_BANK_MANAGER' && status === 'MANAGER_REVIEW';

  const showApproveReject = canTellerAct || canManagerAct;
  const showEscalation = canTellerAct;
  const isDecided = status === 'APPROVED' || status === 'REJECTED';

  const handleApprove = () => {
    if (!approvalCondition || !comment.trim()) return;
    const payload: ApprovalPayload = {
      approvedAmount: approvalCondition.approvedAmount,
      interestRate: approvalCondition.approvedRate,
      loanTermMonths: approvalCondition.approvedTerm,
      repaymentMethod: approvalCondition.repaymentMethod,
      comment: comment.trim(),
    };
    mutations.approve.mutate(payload, { onSuccess: () => setComment('') });
  };

  const handleReject = () => {
    if (!comment.trim()) return;
    const payload: RejectionPayload = { comment: comment.trim() };
    mutations.reject.mutate(payload, { onSuccess: () => setComment('') });
  };

  const handleEscalate = () => {
    if (!comment.trim()) return;
    const payload: EscalationPayload = { comment: comment.trim() };
    mutations.escalate.mutate(payload, { onSuccess: () => setComment('') });
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
            product={data.productInfo}
            applicationInfo={data.applicationInfo}
            recommendation={recommendation}
            isLoading={isRecommendationLoading}
            reviewStatus={summary?.status ?? data.reviewStatus}
            editable={showApproveReject}
            onConditionChange={setApprovalCondition}
          >
            {!isDecided && (showApproveReject || showEscalation) && (
              <>
                <textarea
                  id="reviewComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  maxLength={500}
                  rows={6}
                  placeholder="심사 의견을 입력해 주세요."
                  disabled={isProcessing}
                  className="w-full resize-none rounded-md border border-border-default px-3 py-2 text-sm outline-none transition-colors focus:border-border-focus disabled:opacity-50"
                />

                {mutationError && (
                  <p className="mt-2 text-sm text-error">처리에 실패했습니다. 다시 시도해 주세요.</p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-text-disabled">{comment.length}/500</p>
                  <div className="flex items-center gap-2">
                    {showEscalation && (
                      <button
                        type="button"
                        onClick={handleEscalate}
                        disabled={!comment.trim() || isProcessing}
                        className="rounded-md border border-info px-4 py-2 text-sm font-medium text-info transition-colors hover:bg-info/5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEscalating ? '요청 중...' : '추가 결재'}
                      </button>
                    )}
                    {showApproveReject && (
                      <>
                        <button
                          type="button"
                          onClick={handleReject}
                          disabled={!comment.trim() || isProcessing}
                          className="rounded-md border border-error px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRejecting ? '처리 중...' : '거절'}
                        </button>
                        <button
                          type="button"
                          onClick={handleApprove}
                          disabled={!approvalCondition || !comment.trim() || isProcessing}
                          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApproving ? '처리 중...' : '승인'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </ConditionComparisonCard>

          {isDecided && (
            <Card>
              {status === 'APPROVED' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-success" />
                    <p className="text-sm font-semibold text-success">승인 완료</p>
                  </div>
                  {summary?.decidedAt && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">승인 일시: </span>
                      {formatDateTime(summary.decidedAt)}
                    </p>
                  )}
                  {summary?.approvalComment && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">승인 사유: </span>
                      {summary.approvalComment}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-error" />
                    <p className="text-sm font-semibold text-error">거절 완료</p>
                  </div>
                  {summary?.decidedAt && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">거절 일시: </span>
                      {formatDateTime(summary.decidedAt)}
                    </p>
                  )}
                  {summary?.rejectionComment && (
                    <p className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">거절 사유: </span>
                      {summary.rejectionComment}
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      )}

    </div>
  );
}
