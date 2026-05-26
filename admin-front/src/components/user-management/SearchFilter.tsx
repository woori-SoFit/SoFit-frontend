import { useState, useEffect } from 'react';
import type { UserFilters } from '@/types/user';
import { shouldTriggerSearch } from '@/utils/userUtils';

interface SearchFilterProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

/** 역할 드롭다운 옵션 */
const ROLE_OPTIONS = [
  { value: '', label: '역할 전체' },
  { value: 'ADMIN_DEV', label: '개발자' },
  { value: 'ADMIN_BANK_MANAGER', label: '지점장' },
  { value: 'ADMIN_BANK_TELLER', label: '은행원' },
  { value: 'USER', label: '고객' },
];

/** 상태 드롭다운 옵션 */
const STATUS_OPTIONS = [
  { value: '', label: '상태 전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
];

/**
 * 검색 및 필터 컴포넌트 (대출 현황 스타일)
 */
export default function SearchFilter({ filters, onFiltersChange }: SearchFilterProps) {
  const [keyword, setKeyword] = useState(filters.keyword);

  useEffect(() => {
    setKeyword(filters.keyword);
  }, [filters.keyword]);

  // 300ms 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldTriggerSearch(keyword)) {
        if (keyword !== filters.keyword) {
          onFiltersChange({ ...filters, keyword });
        }
      } else {
        if (filters.keyword !== '') {
          onFiltersChange({ ...filters, keyword: '' });
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, role: e.target.value as UserFilters['role'] });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value as UserFilters['status'] });
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="이름, 아이디, 이메일 검색"
        maxLength={100}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-focus"
      />

      <select
        value={filters.role}
        onChange={handleRoleChange}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-focus"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={handleStatusChange}
        className="px-3 py-2 text-sm border border-border-default rounded-md bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border-focus"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
