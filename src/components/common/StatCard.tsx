import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
};

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[14px] border border-motu-border bg-white p-5">
      <p className="text-body-sm font-medium text-motu-text-secondary">{label}</p>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <p className="text-display-lg font-bold text-motu-text-primary">{value}</p>
        {delta && <p className="text-label-md font-medium text-motu-text-tertiary">{delta}</p>}
      </div>
    </div>
  );
}
