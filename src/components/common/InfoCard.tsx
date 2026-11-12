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
  className?: string;
  // 항목-값 행 외에 추가로 넣을 내용
  children?: ReactNode;
};

// 제목 + 항목-값 행 목록 카드입니다. (상세 화면의 정보 카드)
export function InfoCard({ title, items = [], className, children }: InfoCardProps) {
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-3.5 rounded-[14px] border border-motu-border bg-white px-6 py-5',
        className,
      )}
    >
      <h2 className="text-title-md font-bold text-motu-text-primary">{title}</h2>
      {items.length > 0 && (
        <dl className="flex flex-col gap-3.5">
          {items.map((item) => (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>
      )}
      {children}
    </section>
  );
}
