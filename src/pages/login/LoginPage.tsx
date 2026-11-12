import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/useAuthStore';

// TODO: 관리자 로그인 화면 구현 (Figma 16 · 관리자 인증)
export default function LoginPage() {
  const setStatus = useAuthStore((state) => state.setStatus);

  // 로그인 화면 구현 전까지 레이아웃을 확인하기 위한 개발용 버튼입니다. (개발 서버에서만 노출)
  // 로그인 상태가 되면 PublicOnlyRoute 가 원래 보던 화면으로 이동시킵니다.
  const handleDevLogin = () => setStatus('authenticated');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-body-sm font-bold text-motu-text-tertiary">모투 관리자</p>
        <h1 className="text-display-lg font-bold text-motu-text-primary">관리자 로그인</h1>
      </div>
      <p className="text-body-md font-medium text-motu-text-tertiary">화면 구현 예정입니다.</p>
      {import.meta.env.DEV && (
        <Button variant="neutral" onClick={handleDevLogin}>
          개발용: 로그인 없이 둘러보기
        </Button>
      )}
    </div>
  );
}
