/**
 * 대출 신청 이어하기 카드 컴포넌트
 *
 * 홈 화면에서 임시저장된 대출 신청이 있을 때 표시.
 * 클릭 시 해당 신청 흐름으로 복귀.
 *
 * 사용처: HomePage (상품 슬라이더 아래, 대출 현황 위)
 */
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { LoanDraftItem } from "@/types/loan";

interface DraftResumeCardProps {
  drafts: LoanDraftItem[];
}

export function DraftResumeCard({ drafts }: DraftResumeCardProps) {
  const navigate = useNavigate();

  if (drafts.length === 0) return null;

  return (
    <section className="px-5 mt-2">
      <div className="bg-white rounded-2xl px-5 py-4 border border-border-default">
        <p className="text-sm font-semibold text-text-primary mb-3">
          이어서 진행할 대출 신청
        </p>
        <ul className="flex flex-col gap-2">
          {drafts.map((draft) => (
            <li key={draft.applicationId}>
              <button
                type="button"
                onClick={() =>
                  navigate("/loan/apply", {
                    state: {
                      productId: draft.productId,
                      applicationId: draft.applicationId,
                      resumeStep: draft.resumeStep,
                    },
                  })
                }
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 active:bg-blue-100 transition-colors"
              >
                <span className="text-sm font-medium text-primary">
                  {draft.productName}
                </span>
                <ChevronRight size={16} className="text-primary/70" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
