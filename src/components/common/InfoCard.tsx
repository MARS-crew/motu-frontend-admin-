import type { ReactNode } from 'react';

import { InfoRow } from '@/components/common/InfoRow';
import { cn } from '@/utils/cn';

export type InfoItem = {
  label: string;
  value: ReactNode;
};

type InfoCardProps = {
  title: string;
  items?: InfoItem[];
  // danger: 빨간 배경의 강조 카드 (탐지 근거 등)
  tone?: 'default' | 'danger';
  className?: string;
  // 항목-값 행 외에 추가로 넣을 내용
  children?: ReactNode;
};

// 제목 + 항목-값 행 목록 카드입니다. (상세 화면의 정보 카드)
export function InfoCard({
  title,
  items = [],
  tone = 'default',
  className,
  children,
}: InfoCardProps) {
  const isDanger = tone === 'danger';

  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-3.5 rounded-[14px] border px-6 py-5',
        isDanger ? 'border-motu-red-light bg-motu-red-light' : 'border-motu-border bg-white',
        className,
      )}
    >
      <h2
        className={cn(
          'text-title-md font-bold',
          isDanger ? 'text-motu-btn-red' : 'text-motu-text-primary',
        )}
      >
        {title}
      </h2>
      {items.length > 0 && (
        <dl className="flex flex-col gap-3.5">
          {items.map((item) => (
            <InfoRow
              key={item.label}
              label={item.label}
              value={item.value}
              isLabelEmphasized={isDanger}
            />
          ))}
        </dl>
      )}
      {children}
    </section>
  );
}
