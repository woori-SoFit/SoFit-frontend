/** 사용자 프로필 상세 (ProfilePage용) */
export interface UserProfile {
  userId: number;
  loginId: string;
  name: string;
  phone: string;
  role: string;
}

/** 사업자 정보 */
export interface BusinessInfo {
  businessNumber: string;
  companyName: string;
  industry: string;
  openDate: string;
  representativeName: string;
}

/** 알림 항목 */
export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

/** 사업자 정보 API 응답 */
export interface BusinessInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BusinessInfo;
}

/** 알림 목록 API 응답 */
export interface NotificationsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NotificationItem[];
}

/** 사용자 프로필 API 응답 */
export interface UserProfileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UserProfile;
}
