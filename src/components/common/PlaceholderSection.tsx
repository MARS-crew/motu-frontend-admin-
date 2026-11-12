// 아직 구현하지 않은 화면의 본문 자리 표시입니다. 화면을 구현하면 제거합니다.
type PlaceholderSectionProps = {
  description?: string;
};

export function PlaceholderSection({
  description = '화면 구현 예정입니다.',
}: PlaceholderSectionProps) {
  return (
    <section className="flex h-60 items-center justify-center rounded-[14px] border border-dashed border-motu-border bg-white">
      <p className="text-body-md font-medium text-motu-text-tertiary">{description}</p>
    </section>
  );
}
