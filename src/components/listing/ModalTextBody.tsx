// 모달 본문 (회색 박스, 220px 를 넘으면 세로 스크롤)
type ModalTextBodyProps = {
  text: string;
};

export function ModalTextBody({ text }: ModalTextBodyProps) {
  return (
    <div className="h-[220px] overflow-y-auto whitespace-pre-wrap rounded-[10px] bg-motu-bg-secondary p-4 text-body-md font-medium leading-[1.6] text-motu-text-primary">
      {text}
    </div>
  );
}
