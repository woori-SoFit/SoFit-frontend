/**
 * 마이데이터 서류 불러오기 로딩 화면
 *
 * 사용처:
 * - 대출 신청 MYDATA_LOADING step
 *
 * 항목별로 순차적으로 로딩 → 완료 상태 전환
 * 전체 완료 시 onComplete 호출
 */
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import {
  BriefcaseBusiness,
  BarChart3,
  Landmark,
  CreditCard,
  FileText,
  ShieldCheck,
  CircleCheckBig,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import files from "@/assets/lottie/Files.json";
import { BottomButton } from "@/components/common/BottomButton";

interface LoadingItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const LOADING_ITEMS: LoadingItem[] = [
  { id: "biz", label: "사업자 정보", icon: BriefcaseBusiness },
  { id: "sales", label: "매출 정보", icon: BarChart3 },
  { id: "account", label: "계좌 거래내역", icon: Landmark },
  { id: "card", label: "카드 사용내역", icon: CreditCard },
  { id: "tax", label: "세금 납부정보", icon: FileText },
  { id: "insurance", label: "4대보험 정보", icon: ShieldCheck },
];

type ItemStatus = "loading" | "done";

interface MydataLoadingStepProps {
  /** 전체 로딩 완료 시 호출 */
  onComplete: () => void;
}

export function MydataLoadingStep({ onComplete }: MydataLoadingStepProps) {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => {
    const initial: Record<string, ItemStatus> = {};
    LOADING_ITEMS.forEach((item) => {
      initial[item.id] = "loading";
    });
    return initial;
  });

  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let completedCount = 0;

    const markItemDone = (itemId: string) => {
      setStatuses((prev) => ({ ...prev, [itemId]: "done" }));
      completedCount++;
      if (completedCount === LOADING_ITEMS.length) {
        setAllDone(true);
      }
    };

    // 각 항목별 랜덤 딜레이 (crypto 기반 보안 난수)
    LOADING_ITEMS.forEach((item) => {
      const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
      const delay = 900 + (randomValue / 0xFFFFFFFF) * 3000;
      const timer = setTimeout(() => markItemDone(item.id), delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 px-5 pt-1">
      {/* 상단 안내 */}
      <div className="mt-4 mb-5 mx-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0">
            <Lottie
              animationData={files}
              loop={!allDone}
              className="w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-tight">
              {allDone ? (
                <>
                  필요한 서류를 모두 불러왔어요
                </>
              ) : (
                <>
                  대출 심사에 필요한 서류를
                  <br />
                  불러오고 있어요
                </>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* 항목 목록 */}
      <ul className="flex flex-col gap-7 flex-1 bg-white px-4 py-5 rounded-xl">
        {LOADING_ITEMS.map((item) => {
          const status = statuses[item.id];
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>

              {/* 텍스트 */}
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className={`text-xs mt-0.5 ${status === "done" ? "text-success" : "text-primary"}`}>
                  {status === "done" && "완료"}
                  {status === "loading" && "불러오는 중"}
                </p>
              </div>

              {/* 상태 아이콘 */}
              <div className="shrink-0">
                {status === "done" && <CircleCheckBig size={20} className="text-success" />}
                {status === "loading" && <Loader2 size={20} className="text-primary animate-spin" />}
              </div>
            </li>
          );
        })}
      </ul>

      {/* 하단 안내 */}
      <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-gray-100">
        <LockKeyhole size={18} className="text-text-secondary shrink-0" />
        <p className="text-xs text-text-secondary leading-relaxed">
          고객님의 정보는 안전하게 보호되며, 심사 목적 외에는<br />사용되지 않습니다.
        </p>
      </div>

      </div>

      {/* 하단 버튼 */}
      <BottomButton
        label={allDone ? "다음" : "불러오는 중"}
        onClick={onComplete}
        disabled={!allDone}
      />
    </div>
  );
}
