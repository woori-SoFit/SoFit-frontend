import { useState } from 'react';
import type { UserFilters } from '@/types/user';

interface SearchFilterProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

/** 역할 드롭다운 옵션 */
const ROLE_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'ADMIN_DEV', label: '개발자' },
  { value: 'ADMIN_BANK_MANAGER', label: '지점장' },
  { value: 'ADMIN_BANK_TELLER', label: '은행원' },
  { value: 'USER', label: '고객' },
];

/** 상태 드롭다운 옵션 */
const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
];

/**
 * 검색 및 필터 컴포넌트.
 * 키워드 + 역할 + 상태를 선택한 뒤 "조회" 버튼으로 한번에 요청한다.
 */
export default function SearchFilter({ filters, onFiltersChange }: SearchFilterProps) {
  const [keyword, setKeyword] = useState(filters.keyword);
  const [role, setRole] = useState(filters.role);
  const [status, setStatus] = useState(filters.status);

  const handleSearch = () => {
    onFiltersChange({ keyword, role, status });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 키워드 검색 */}
      <div className="flex items-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2">
        <span className="text-sm text-text-disabled whitespace-nowrap">키워드</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="이름, 아이디"
          maxLength={100}
          className="w-28 bg-transparent text-sm font-semibold text-text-primary outline-none placeholder:font-normal placeholder:text-text-disabled"
        />
      </div>

      {/* 역할 필터 */}
      <div className="flex items-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2">
        <span className="text-sm text-text-disabled whitespace-nowrap">역할</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserFilters['role'])}
          className="appearance-none bg-transparent text-sm font-semibold text-text-primary outline-none cursor-pointer"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 상태 필터 */}
      <div className="flex items-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2">
        <span className="text-sm text-text-disabled whitespace-nowrap">상태</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as UserFilters['status'])}
          className="appearance-none bg-transparent text-sm font-semibold text-text-primary outline-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 조회 버튼 */}
      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        조회
      </button>
    </div>
  );
}
