import type { ReactNode } from 'react';

// 카드 안 항목-값 행입니다. (라벨 tertiary / 값 bold 오른쪽 정렬) <dl> 안에서 사용합니다.
type InfoRowProps = {
  label: string;
  value: ReactNode;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-body-sm">
      <dt className="font-medium text-motu-text-tertiary">{label}</dt>
      <dd className="text-right font-bold text-motu-text-primary">{value}</dd>
    </div>
  );
}
