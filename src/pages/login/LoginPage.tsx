import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { TextInput } from '@/components/common/TextInput';
import { ROUTES } from '@/constants/routes';
import type { LoginForm } from '@/schemas/authSchema';
import { loginSchema } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores/useAuthStore';

// ADM-AUTH-01 관리자 로그인
export default function LoginPage() {
  const setStatus = useAuthStore((state) => state.setStatus);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: '', password: '' },
  });

  // TODO(MOTU-18-1): 로그인 API 연동
  // - 정상 계정 → 대시보드, 최초 로그인(임시 비밀번호) → 최초 비밀번호 변경
  // - 정지·탈퇴 계정 → 접근 차단 화면, 일반 회원 → 접근 차단
  const handleLogin = () => {};

  // 로그인 API 연동 전까지 레이아웃을 확인하기 위한 개발용 버튼입니다. (개발 서버에서만 노출)
  // 로그인 상태가 되면 PublicOnlyRoute 가 원래 보던 화면으로 이동시킵니다.
  const handleDevLogin = () => setStatus('authenticated');

  return (
    <AuthCard title="관리자 로그인" size="sm" onSubmit={handleSubmit(handleLogin)}>
      <Field
        label="관리자 아이디"
        htmlFor="loginId"
        errorMessage={errors.loginId?.message}
        className="w-full"
      >
        <TextInput
          id="loginId"
          autoComplete="username"
          hasError={Boolean(errors.loginId)}
          {...register('loginId')}
        />
      </Field>
      <Field
        label="비밀번호"
        htmlFor="password"
        errorMessage={errors.password?.message}
        className="w-full"
      >
        <TextInput
          id="password"
          type="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register('password')}
        />
      </Field>
      <Button type="submit" className="w-full">
        로그인
      </Button>
      <div className="flex w-full justify-center">
        <Link
          to={ROUTES.PASSWORD_RESET}
          className="text-body-sm font-medium text-motu-text-secondary hover:underline"
        >
          비밀번호 재설정
        </Link>
      </div>
      {import.meta.env.DEV && (
        <Button variant="neutral" size="sm" className="w-full" onClick={handleDevLogin}>
          개발용: 로그인 없이 둘러보기
        </Button>
      )}
    </AuthCard>
  );
}
