import { Chip } from '@/components/common/Chip';

type PaginationProps = {
  // 1부터 시작
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const ARROW_CLASS_NAME =
  'px-1 text-body-md font-medium text-motu-text-tertiary disabled:cursor-not-allowed disabled:opacity-40';

// 목록 하단 페이지 번호입니다. 한 페이지뿐이면 그리지 않습니다.
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={ARROW_CLASS_NAME}
      >
        ‹
      </button>
      {pages.map((value) => (
        <Chip
          key={value}
          isSelected={value === page}
          aria-current={value === page ? 'page' : undefined}
          onClick={() => onChange(value)}
          className="min-w-[34px]"
        >
          {value}
        </Chip>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={ARROW_CLASS_NAME}
      >
        ›
      </button>
    </nav>
  );
}
