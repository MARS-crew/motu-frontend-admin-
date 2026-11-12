import type { FormEventHandler, ReactNode } from 'react';

import { cn } from '@/utils/cn';

// sm: 로그인(440) / md: 재설정·접근 차단(640) / lg: 최초 비밀번호 변경(880)
type AuthCardSize = 'sm' | 'md' | 'lg';

type AuthCardProps = {
  title: ReactNode;
  size?: AuthCardSize;
  // 제목 위에 표시합니다. (접근 차단 배지 등)
  badge?: ReactNode;
  // 넘기면 카드 전체를 <form> 으로 렌더링합니다.
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
};

const SIZE_CLASS_NAMES: Record<AuthCardSize, string> = {
  sm: 'max-w-[440px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[880px]',
};

export function AuthCard({ title, size = 'md', badge, onSubmit, children }: AuthCardProps) {
  const Container = onSubmit ? 'form' : 'section';

  return (
    <Container
      onSubmit={onSubmit}
      noValidate={onSubmit ? true : undefined}
      className={cn(
        'flex w-full flex-col items-start gap-5 rounded-[20px] border border-motu-border bg-white p-8',
        SIZE_CLASS_NAMES[size],
      )}
    >
      <p className="text-title-md font-bold text-motu-text-tertiary">모투 관리자</p>
      {badge}
      <h1 className="text-display-lg font-bold text-motu-text-primary">{title}</h1>
      {children}
    </Container>
  );
}
