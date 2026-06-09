/**
 * 404 Not Found 페이지
 * Route: *
 */
import { EmptyError } from "@/components/common/EmptyError";

export default function NotFoundPage() {
  return (
    <EmptyError
      message="페이지를 찾을 수 없습니다"
      buttonLabel="홈으로 가기"
      navigateTo="/"
    />
  );
}
