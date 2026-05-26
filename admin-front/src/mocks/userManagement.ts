import type {
  UserListItem,
  UserListParams,
  PaginatedUserResponse,
  UserStatistics,
} from '@/types/user';

const MOCK_USERS: UserListItem[] = [
  { id: 128, loginId: 'admin', name: '김개발', phone: '01012345678', role: 'ADMIN_DEV', status: 'ACTIVE', createdAt: '2026-05-15T14:30:22' },
  { id: 127, loginId: 'dev01', name: '이서연', phone: '01023456789', role: 'ADMIN_DEV', status: 'ACTIVE', createdAt: '2026-05-15T13:20:11' },
  { id: 126, loginId: 'bank01', name: '박지훈', phone: '01034567890', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-15T11:05:33' },
  { id: 125, loginId: 'bank02', name: '최민수', phone: '01045678901', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-15T10:15:08' },
  { id: 124, loginId: 'viewer01', name: '정예린', phone: '01056789012', role: 'USER', status: 'ACTIVE', createdAt: '2026-05-14T16:45:22' },
  { id: 123, loginId: 'viewer02', name: '김도현', phone: '01067890123', role: 'USER', status: 'INACTIVE', createdAt: '2026-04-28T09:10:44' },
  { id: 122, loginId: 'bank03', name: '한지민', phone: '01078901234', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-15T09:01:17' },
  { id: 121, loginId: 'bank04', name: '오정우', phone: '01089012345', role: 'ADMIN_BANK_TELLER', status: 'INACTIVE', createdAt: '2026-04-30T18:25:00' },
  { id: 120, loginId: 'viewer03', name: '임채원', phone: '01090123456', role: 'USER', status: 'ACTIVE', createdAt: '2026-05-14T15:22:33' },
  { id: 119, loginId: 'dev02', name: '강민재', phone: '01011112222', role: 'ADMIN_DEV', status: 'ACTIVE', createdAt: '2026-05-15T08:33:09' },
  { id: 118, loginId: 'bank05', name: '서유진', phone: '01022223333', role: 'ADMIN_BANK_MANAGER', status: 'ACTIVE', createdAt: '2026-05-15T07:45:00' },
  { id: 117, loginId: 'bank06', name: '조성민', phone: '01033334444', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-14T17:30:22' },
  { id: 116, loginId: 'viewer04', name: '윤하나', phone: '01044445555', role: 'USER', status: 'ACTIVE', createdAt: '2026-05-13T14:20:11' },
  { id: 115, loginId: 'bank07', name: '이태호', phone: '01055556666', role: 'ADMIN_BANK_TELLER', status: 'INACTIVE', createdAt: '2026-03-20T09:00:00' },
  { id: 114, loginId: 'viewer05', name: '박소연', phone: '01066667777', role: 'USER', status: 'INACTIVE', createdAt: '2026-02-15T11:30:00' },
  { id: 113, loginId: 'bank08', name: '김현우', phone: '01077778888', role: 'ADMIN_BANK_MANAGER', status: 'ACTIVE', createdAt: '2026-05-15T06:50:33' },
  { id: 112, loginId: 'dev03', name: '장서윤', phone: '01088889999', role: 'ADMIN_DEV', status: 'INACTIVE', createdAt: '2026-01-10T10:00:00' },
  { id: 111, loginId: 'bank09', name: '홍승기', phone: '01099990000', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-14T16:10:45' },
  { id: 110, loginId: 'viewer06', name: '나은비', phone: '01010101010', role: 'USER', status: 'ACTIVE', createdAt: '2026-05-13T09:45:00' },
  { id: 109, loginId: 'bank10', name: '배준혁', phone: '01020202020', role: 'ADMIN_BANK_TELLER', status: 'ACTIVE', createdAt: '2026-05-14T15:00:00' },
  { id: 108, loginId: 'viewer07', name: '송미래', phone: '01030303030', role: 'USER', status: 'INACTIVE', createdAt: '2026-03-01T08:00:00' },
];

export function getMockUserStatistics(): UserStatistics {
  const totalCount = MOCK_USERS.length;
  const activeCount = MOCK_USERS.filter((u) => u.status === 'ACTIVE').length;
  const bankerCount = MOCK_USERS.filter(
    (u) => u.role === 'ADMIN_DEV' || u.role === 'ADMIN_BANK_TELLER' || u.role === 'ADMIN_BANK_MANAGER',
  ).length;
  const userCount = MOCK_USERS.filter((u) => u.role === 'USER').length;
  const inactiveCount = MOCK_USERS.filter((u) => u.status === 'INACTIVE').length;

  return { totalCount, activeCount, bankerCount, userCount, inactiveCount };
}

export function getMockUsers(params: UserListParams): PaginatedUserResponse {
  let filtered = [...MOCK_USERS];

  // 역할 필터
  if (params.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }

  // 상태 필터
  if (params.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  // 키워드 검색 (이름, 아이디)
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(kw) || u.loginId.toLowerCase().includes(kw),
    );
  }

  filtered.sort((a, b) => b.id - a.id);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / params.size) || 1;
  const start = (params.page - 1) * params.size;
  const users = filtered.slice(start, start + params.size);

  return { users, totalCount, totalPages, currentPage: params.page, size: params.size };
}
