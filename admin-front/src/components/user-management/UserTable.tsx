import type { UserListItem } from '@/types/user';
import { calculateRowNumber, formatLastLogin, getRoleBadgeConfig, getStatusIndicatorConfig } from '@/utils/userUtils';

interface UserTableProps {
  data: UserListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export default function UserTable({
  data,
  totalCount,
  currentPage,
  pageSize,
}: UserTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-14 px-4 py-3 text-center text-xs font-semibold text-gray-500">번호</th>
            <th className="w-28 px-4 py-3 text-center text-xs font-semibold text-gray-500">아이디</th>
            <th className="w-20 px-4 py-3 text-center text-xs font-semibold text-gray-500">이름</th>
            <th className="w-48 px-4 py-3 text-center text-xs font-semibold text-gray-500">이메일</th>
            <th className="w-20 px-4 py-3 text-center text-xs font-semibold text-gray-500">권한</th>
            <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-gray-500">상태</th>
            <th className="w-36 px-4 py-3 text-center text-xs font-semibold text-gray-500">가입 일시</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                조회된 사용자가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-sm">{calculateRowNumber(totalCount, currentPage, pageSize, index)}</td>
                <td className="px-4 py-3 text-center text-sm">{user.loginId}</td>
                <td className="px-4 py-3 text-center text-sm">{user.name}</td>
                <td className="px-4 py-3 text-center text-sm truncate">{user.email}</td>
                <td className="px-4 py-3 text-center text-sm">{getRoleBadgeConfig(user.role).label}</td>
                <td className="px-4 py-3 text-center text-sm">{getStatusIndicatorConfig(user.status).label}</td>
                <td className="px-4 py-3 text-center text-sm">{formatLastLogin(user.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
