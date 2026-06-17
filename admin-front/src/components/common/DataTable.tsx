import type { ReactNode } from 'react';

/** 컬럼 정의 */
export interface Column<T> {
  /** 컬럼 헤더 텍스트 */
  header: string;
  /** 셀 렌더링 함수 */
  render: (row: T) => ReactNode;
  /** 헤더/셀 정렬 (기본: "center") */
  align?: 'left' | 'center' | 'right';
  /** 컬럼 너비 (예: '200px', '20%') */
  width?: string;
}

interface DataTableProps<T> {
  /** 컬럼 정의 배열 */
  columns: Column<T>[];
  /** 테이블 데이터 */
  data: T[];
  /** 각 행의 고유 키를 반환하는 함수 */
  rowKey: (row: T) => string | number;
  /** 데이터가 비어있을 때 표시할 내용 */
  emptyMessage?: ReactNode;
}

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * 공통 데이터 테이블 컴포넌트.
 * 컬럼 정의 + 데이터 배열을 받아 통일된 스타일의 테이블을 렌더링한다.
 */
export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = '조회된 데이터가 없습니다.',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-surface shadow-card">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-border-default bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.header}
                style={col.width ? { width: col.width } : undefined}
                className={`px-4 py-3 text-xs font-semibold text-text-secondary ${ALIGN_CLASSES[col.align ?? 'center']}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-text-disabled"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border-default last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={`px-4 py-3 text-sm text-text-primary ${ALIGN_CLASSES[col.align ?? 'center']}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
