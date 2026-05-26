/**
 * 마이페이지 상단 프로필 카드 컴포넌트
 *
 * - 좌측: SoFit 캐릭터 아바타 (64px 원형)
 * - 우측: 이름 (bold, "사장님" 접미사) + 로그인 아이디 (secondary color)
 * - 흰색 배경 카드, radius-xl
 *
 * Validates: Requirements 1.2, 1.3
 */
import wibeeIcon from "@/assets/icons/wibee.svg";

interface ProfileCardProps {
  name: string;
  loginId: string;
}

export function ProfileCard({ name, loginId }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white p-4">
      {/* SoFit 캐릭터 아바타 */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center">
        <img
          src={wibeeIcon}
          alt="SoFit 캐릭터"
          className="h-14 w-14"
        />
      </div>

      {/* 이름 + 아이디 */}
      <div className="flex flex-col gap-0.5">
        <span className="text-lg font-bold text-text-primary">
          {name} 사장님
        </span>
        <span className="text-sm text-text-secondary">{loginId}</span>
      </div>
    </div>
  );
}
