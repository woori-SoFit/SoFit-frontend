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
import {
  BriefcaseBusiness,
  BarChart3,
  Landmark,
  CreditCard,
  FileText,
  ShieldCheck,
  CircleCheckBig,
  Clock,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import mydataIcon from "@/assets/icons/mydata.svg";

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

/** 각 항목 로딩 간격 (ms) */
const ITEM_DELAY = 1200;

type ItemStatus = "waiting" | "loading" | "done";

interface MydataLoadingStepProps {
  /** 전체 로딩 완료 시 호출 */
  onComplete: () => void;
}

export function MydataLoadingStep({ onComplete }: MydataLoadingStepProps) {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => {
    const initial: Record<string, ItemStatus> = {};
    LOADING_ITEMS.forEach((item, idx) => {
      initial[item.id] = idx === 0 ? "loading" : "waiting";
    });
    return initial;
  });

  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let cleared = false;

    const interval = setInterval(() => {
      if (cleared) return;

      const currentItem = LOADING_ITEMS[currentIndex];
      if (!currentItem) {
        clearInterval(interval);
        return;
      }

      // 현재 항목 완료
      setStatuses((prev) => ({
        ...prev,
        [currentItem.id]: "done",
      }));

      currentIndex++;

      const nextItem = LOADING_ITEMS[currentIndex];
      if (nextItem) {
        // 다음 항목 로딩 시작
        setStatuses((prev) => ({
          ...prev,
          [nextItem.id]: "loading",
        }));
      } else {
        // 전체 완료
        clearInterval(interval);
        cleared = true;
        setAllDone(true);
      }
    }, ITEM_DELAY);

    return () => {
      cleared = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-full px-5 pt-8 pb-6">
      {/* 상단 안내 */}
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
          <img src={mydataIcon} alt="" className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-bold text-text-primary leading-tight mb-2">
          대출 심사에 필요한 추가 서류를<br />불러오는 중이에요
        </h1>
        <p className="text-sm text-text-secondary">
          잠시만 기다려주세요.
        </p>
      </div>

      {/* 항목 목록 */}
      <ul className="flex flex-col gap-5 flex-1">
        {LOADING_ITEMS.map((item) => {
          const status = statuses[item.id];
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>

              {/* 텍스트 */}
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className={`text-xs mt-0.5 ${status === "done" ? "text-success" : status === "loading" ? "text-primary" : "text-text-disabled"}`}>
                  {status === "done" && "완료"}
                  {status === "loading" && "불러오는 중"}
                  {status === "waiting" && "대기 중"}
                </p>
              </div>

              {/* 상태 아이콘 */}
              <div className="shrink-0">
                {status === "done" && <CircleCheckBig size={20} className="text-success" />}
                {status === "loading" && <Loader2 size={20} className="text-primary animate-spin" />}
                {status === "waiting" && <Clock size={18} className="text-text-disabled" />}
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

      {/* 하단 버튼 */}
      <div className="mt-4">
        <button
          type="button"
          disabled={!allDone}
          onClick={onComplete}
          className={`w-full h-12 rounded-lg text-base font-semibold transition-colors ${
            allDone
              ? "bg-primary text-white cursor-pointer hover:bg-primary-dark active:bg-primary-dark"
              : "bg-primary text-white opacity-70 cursor-not-allowed"
          }`}
        >
          {allDone ? "다음" : "불러오는 중"}
        </button>
      </div>
    </div>
  );
}
