import type { StatDeltaTone } from '@/components/common/StatCard';

// 12,480
export const formatNumber = (value: number) => value.toLocaleString('ko-KR');

// +3, -2, 0 / +2.1%
export const formatSignedNumber = (value: number, suffix = '') =>
  `${value > 0 ? '+' : ''}${formatNumber(value)}${suffix}`;

// 증가는 빨강, 감소는 파랑, 변화 없음은 회색입니다.
export const getDeltaTone = (value: number): StatDeltaTone =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';

// 축 라벨 등 짧은 표기: 120000 → 12만, 480000000 → 4.8억
export const formatCompactKorean = (value: number) => {
  const units = [
    { size: 1e8, label: '억' },
    { size: 1e4, label: '만' },
  ];
  const unit = units.find(({ size }) => Math.abs(value) >= size);
  if (!unit) return formatNumber(value);
  const scaled = Math.round((value / unit.size) * 10) / 10;
  return `${formatNumber(scaled)}${unit.label}`;
};
