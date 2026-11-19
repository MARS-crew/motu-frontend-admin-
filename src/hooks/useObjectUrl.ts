import { useEffect, useState } from 'react';

type LoadedFile = { blob: Blob; url: string };

// Blob 을 <img>·<iframe> 에 쓸 수 있는 data URL 로 바꿉니다.
// (data URL 은 해제할 필요가 없어 화면을 벗어나도 정리할 것이 없습니다)
export const useObjectUrl = (blob: Blob | undefined) => {
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);

  useEffect(() => {
    if (!blob) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLoaded({ blob, url: reader.result });
    };
    reader.readAsDataURL(blob);
    return () => reader.abort();
  }, [blob]);

  // 다른 파일로 바뀌는 동안 이전 파일을 보여주지 않습니다.
  return loaded && loaded.blob === blob ? loaded.url : null;
};
