/**
 * 대출 신청 카드 컴포넌트
 * 대출 진행 관리 페이지에서 사용
 */
import { CircleCheckBig, Info, ChevronsRight } from "lucide-react";
import { formatAmount, formatDate } from "@/utils/format";
import type { LoanApplication } from "@/types/loan";
import { STATUS_BADGE, STATUS_STEP_INDEX } from "@/constants/loanStatus";

/** 대출 상태별 하단 안내 메시지 */
function StatusMessage({ status }: { status: LoanApplication["status"] }) {
  if (status === "EXECUTED") {
    return (
      <>
        <CircleCheckBig size={16} className="text-success shrink-0" />
        <p>대출 실행이 완료되었어요.</p>
      </>
    );
  }
  if (status === "APPROVED") {
    return (
      <>
        <CircleCheckBig size={16} className="text-success shrink-0" />
        <p>대출이 승인되었어요. 약정을 체결해주세요.</p>
      </>
    );
  }
  if (status === "REJECTED") {
    return (
      <>
        <Info size={16} className="text-error shrink-0" />
        <p>대출이 거절되었어요. 거절 사유를 확인해주세요.</p>
      </>
    );
  }
  const isCompleted = status === "CONTRACTED" || status === "CANCELLED";
  if (isCompleted) {
    return (
      <>
        <CircleCheckBig size={16} className="shrink-0" />
        <p>심사가 완료되었어요.</p>
      </>
    );
  }
  return (
    <>
      <Info size={16} className="shrink-0" />
      <p>심사 진행 중이에요. 조금만 기다려주세요!</p>
    </>
  );
}

/** 심사 단계 정의 */
const REVIEW_STEPS = ["신청접수", "서류확인", "심사 중", "심사 완료"];

interface LoanApplicationCardProps {
  app: LoanApplication;
  onClick: () => void;
}

export function LoanApplicationCard({ app, onClick }: LoanApplicationCardProps) {
  const badge = STATUS_BADGE[app.status];
  const currentStepIndex = STATUS_STEP_INDEX[app.status];
  const isCompleted = app.status === "APPROVED" || app.status === "REJECTED" || app.status === "CONTRACTED" || app.status === "EXECUTED" || app.status === "CANCELLED";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-w-full snap-center shrink-0 bg-white rounded-2xl border border-border-default p-5 text-left active:scale-[0.98] transition-transform"
    >
      {/* 상단: 배지 + 화살표 */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${badge.color}`}>
          {badge.label}
        </span>
        {/* 승인 상태: 약정 체결 버튼 + Shine Effect */}
        {app.status === "APPROVED" && (
          <div className="relative px-2.5 py-0.5 rounded-md bg-primary-dark text-white text-xs font-semibold flex items-center justify-center overflow-hidden">
            약정 체결하기<ChevronsRight className="w-5 pl-1"/>
            <div className="absolute inset-0 animate-[shine_2.5s_ease-in-out_infinite]">
              <div className="absolute inset-y-0 -left-full w-1/2 bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
            </div>
          </div>
        )}
      </div>

      {/* 상품명 */}
      <h3 className="text-base font-bold text-text-primary mb-4">{app.productName}</h3>

      {/* 신청 정보 */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">신청금액</p>
          <p className="text-sm font-semibold text-primary">{formatAmount(app.requestedAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-0.5">신청일</p>
          <p className="text-sm font-medium text-text-primary">{formatDate(app.appliedAt)}</p>
        </div>
        {isCompleted && (
          <div>
            <p className="text-xs text-text-secondary mb-0.5">심사 완료일</p>
            <p className="text-sm font-medium text-text-primary">{formatDate(app.appliedAt)}</p>
          </div>
        )}
      </div>

      {/* 진행 단계 스텝퍼 */}
      <div className="mb-4">
        <div className="flex items-center">
          {REVIEW_STEPS.map((_, index) => (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  index <= currentStepIndex
                    ? "bg-primary"
                    : "border-2 border-gray-200 bg-white"
                }`}
              >
                {index <= currentStepIndex && (
                  <CircleCheckBig size={12} className="text-white" />
                )}
              </div>
              {index < REVIEW_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${
                  index < currentStepIndex ? "bg-primary" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {REVIEW_STEPS.map((label, index) => (
            <span
              key={label}
              className={`text-[10px] ${
                index <= currentStepIndex ? "text-primary font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 안내 메시지 */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 text-text-secondary text-xs">
        <StatusMessage status={app.status} />
      </div>
    </button>
  );
}
