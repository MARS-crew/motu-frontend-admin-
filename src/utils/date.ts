// 날짜는 시간 정보 없이 로컬(KST) 기준 자정으로 다룹니다.

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const pad = (value: number) => String(value).padStart(2, '0');

// 2026.09.01
export const formatDate = (date: Date) =>
  `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;

// 2026.08.05~09.03 (같은 해면 종료일의 연도를 생략합니다)
export const formatDateRange = (start: Date, end: Date) => {
  const endText =
    start.getFullYear() === end.getFullYear()
      ? `${pad(end.getMonth() + 1)}.${pad(end.getDate())}`
      : formatDate(end);
  return `${formatDate(start)}~${endText}`;
};

// 월요일 시작 달력에 표시할 주 목록입니다. 앞뒤 달의 날짜로 빈칸을 채웁니다.
export const getCalendarWeeks = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  // getDay(): 일 0 ~ 토 6 → 월요일 시작 기준 오프셋
  const leadingDays = (firstDay.getDay() + 6) % 7;
  let cursor = addDays(firstDay, -leadingDays);

  const weeks: Date[][] = [];
  while (cursor <= lastDay) {
    const week = Array.from({ length: 7 }, (_, index) => addDays(cursor, index));
    weeks.push(week);
    cursor = addDays(cursor, 7);
  }
  return weeks;
};

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
