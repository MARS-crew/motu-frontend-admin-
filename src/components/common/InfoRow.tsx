import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

// 카드 안 항목-값 행입니다. (라벨 tertiary / 값 bold 오른쪽 정렬) <dl> 안에서 사용합니다.
type InfoRowProps = {
  label: string;
  value: ReactNode;
  // 강조 카드(탐지 근거 등)에서는 라벨을 한 단계 진하게 표시합니다.
  isLabelEmphasized?: boolean;
};

export function InfoRow({ label, value, isLabelEmphasized = false }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-body-sm">
      <dt
        className={cn(
          'font-medium',
          isLabelEmphasized ? 'text-motu-text-secondary' : 'text-motu-text-tertiary',
        )}
      >
        {label}
      </dt>
      <dd className="text-right font-bold text-motu-text-primary">{value}</dd>
    </div>
  );
}
