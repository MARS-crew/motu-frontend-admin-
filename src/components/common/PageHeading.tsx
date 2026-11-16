import type { ReactNode } from 'react';

type PageHeadingProps = {
  title: string;
  // 제목 오른쪽 보조 동작 (목록으로 등)
  action?: ReactNode;
};

// 본문 상단 제목입니다. 헤더 제목(메뉴 이름) 아래에서 현재 화면 이름을 보여줍니다.
export function PageHeading({ title, action }: PageHeadingProps) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="min-w-0 flex-1 truncate text-title-lg font-bold text-motu-text-primary">
        {title}
      </h2>
      {action}
    </div>
  );
}
