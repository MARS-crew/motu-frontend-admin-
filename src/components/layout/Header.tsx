import { AdminMenu } from '@/components/layout/AdminMenu';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-header shrink-0 items-center gap-4 border-b border-motu-border bg-white pr-8">
      <p className="w-sidebar shrink-0 pl-7 text-title-md font-bold text-motu-text-primary">
        모투 관리자
      </p>
      <h1 className="min-w-0 flex-1 truncate text-title-lg font-bold text-motu-text-primary">
        {title}
      </h1>
      <AdminMenu />
    </header>
  );
}
