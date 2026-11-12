import { formatCompactKorean } from '@/utils/format';

type BarChartProps = {
  values: number[];
  // X축 눈금 라벨 (양 끝 정렬)
  xLabels: string[];
  // 접근성용 차트 설명
  label: string;
};

const CHART_HEIGHT = 300;
// Y축 눈금 간격 (위·가운데 2개·0, 3칸)
const Y_TICK_COUNT = 3;

// 눈금 간격을 1·2·4·5·10 × 10^n 중 가장 가까운 값으로 올립니다. → 29,600 → 40,000
const getNiceStep = (rawStep: number) => {
  if (rawStep <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 4, 5, 10].find((multiplier) => multiplier * magnitude >= rawStep) ?? 10;
  return step * magnitude;
};

// 대시보드 거래 추이 막대 차트입니다. 구간별 합계를 막대로 표시합니다.
export function BarChart({ values, xLabels, label }: BarChartProps) {
  const step = getNiceStep(Math.max(...values, 0) / Y_TICK_COUNT);
  const max = step * Y_TICK_COUNT;
  const yTicks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, index) => max - step * index);

  return (
    <div role="img" aria-label={label} className="flex w-full gap-2">
      <div
        className="flex w-9 shrink-0 flex-col justify-between text-label-sm font-medium text-motu-text-tertiary"
        style={{ height: CHART_HEIGHT }}
      >
        {yTicks.map((tick) => (
          <span key={tick}>{formatCompactKorean(tick)}</span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="relative flex items-end" style={{ height: CHART_HEIGHT }}>
          {yTicks.map((tick, index) => (
            <div
              key={tick}
              className="absolute inset-x-0 h-px bg-motu-border"
              // 맨 아래 선은 차트 안쪽에 그립니다.
              style={{
                top: `calc(${(index / Y_TICK_COUNT) * 100}% - ${index === Y_TICK_COUNT ? 1 : 0}px)`,
              }}
            />
          ))}
          {values.map((value, index) => (
            <div key={index} className="relative flex h-full flex-1 items-end justify-center">
              <div
                className="w-9 rounded-t bg-motu-black"
                style={{ height: `${max ? (value / max) * 100 : 0}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-label-sm font-medium text-motu-text-tertiary">
          {xLabels.map((xLabel) => (
            <span key={xLabel}>{xLabel}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
