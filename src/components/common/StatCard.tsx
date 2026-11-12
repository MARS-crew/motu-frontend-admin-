import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

// up: 증가(빨강) / down: 감소(파랑) / neutral: 변화 없음·보조 정보(회색)
export type StatDeltaTone = 'up' | 'down' | 'neutral';

type StatCardProps = {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: StatDeltaTone;
};

const DELTA_TONE_CLASS_NAMES: Record<StatDeltaTone, string> = {
  up: 'text-motu-red',
  down: 'text-motu-blue',
  neutral: 'text-motu-text-tertiary',
};

export function StatCard({ label, value, delta, deltaTone = 'neutral' }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 rounded-[14px] border border-motu-border bg-white p-5">
      <p className="text-body-sm font-medium text-motu-text-secondary">{label}</p>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <p className="text-display-lg font-bold text-motu-text-primary">{value}</p>
        {delta && (
          <div className={cn('text-label-md font-medium', DELTA_TONE_CLASS_NAMES[deltaTone])}>
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
