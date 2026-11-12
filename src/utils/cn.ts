// 조건부 className 을 합칩니다. → cn('px-4', isActive && 'bg-motu-black')
export const cn = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(' ');
