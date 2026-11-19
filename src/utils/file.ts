// Blob 을 원본 파일명으로 내려받습니다.
export const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  // 다운로드가 시작된 뒤 주소를 해제합니다.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

// 외부 링크는 새 탭으로 엽니다. (원래 창에 접근하지 못하게 noopener)
export const openExternalLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
