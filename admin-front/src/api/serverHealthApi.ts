// import axiosInstance from '@/api/axiosInstance';
import { MOCK_SERVER_HEALTH } from '@/mocks/serverHealth';
import type { ServerHealthData } from '@/types/serverHealth';

/**
 * 서버 상태 데이터를 조회한다.
 *
 * TODO: 백엔드 연동 시 아래 목 데이터 반환을 제거하고 실제 API 호출로 교체
 * const { data } = await axiosInstance.get<ServerHealthData>('/api/admin/dev/health');
 * return data;
 */
export async function fetchServerHealth(): Promise<ServerHealthData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_SERVER_HEALTH;
}
