import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type TableColumn<Row> = {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  // 셀 텍스트 강조 (상품명 등)
  isEmphasized?: boolean;
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  // 열 너비 → 'grid-cols-[1.5fr_repeat(5,1fr)]' 같은 Tailwind 클래스
  gridClassName: string;
  emptyMessage?: string;
};

// 관리자 목록 테이블입니다. 헤더 44px, 행 52px.
export function Table<Row>({
  columns,
  rows,
  getRowKey,
  gridClassName,
  emptyMessage = '조회된 내역이 없습니다.',
}: TableProps<Row>) {
  return (
    <div role="table" className="overflow-hidden rounded-[14px] border border-motu-border bg-white">
      <div
        role="row"
        className={cn('grid h-11 border-b border-motu-border bg-motu-bg-secondary', gridClassName)}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            role="columnheader"
            className="flex items-center px-4 text-label-md font-medium text-motu-text-secondary"
          >
            {column.header}
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="py-16 text-center text-body-md font-medium text-motu-text-tertiary">
          {emptyMessage}
        </p>
      ) : (
        rows.map((row) => (
          <div
            key={getRowKey(row)}
            role="row"
            className={cn(
              'grid h-[52px] border-b border-motu-border last:border-b-0',
              gridClassName,
            )}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                role="cell"
                className={cn(
                  'flex min-w-0 items-center truncate px-4 text-body-sm',
                  column.isEmphasized
                    ? 'font-bold text-motu-text-primary'
                    : 'font-medium text-motu-text-secondary',
                )}
              >
                {column.cell(row)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
