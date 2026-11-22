import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { TextInput } from '@/components/common/TextInput';
import { AUTH_ACCOUNT_BLOCKED } from '@/constants/errorCodes';
import { ROUTES } from '@/constants/routes';
import { useLoginMutation } from '@/queries/useLoginMutation';
import type { LoginForm } from '@/schemas/authSchema';
import { loginSchema } from '@/schemas/authSchema';
import type { BlockedAdminAccount } from '@/types/auth';
import { getApiError } from '@/utils/apiError';
import { getLoginErrorMessage } from '@/utils/authError';

// ADM-AUTH-01 관리자 로그인
// - 관리자 계정 → 원래 보던 화면(없으면 대시보드), 임시 비밀번호 계정 → 최초 비밀번호 변경, 정지 계정 → 접근 차단 화면
// - 일반 회원·잠긴 계정·비밀번호 오류는 비밀번호 칸 아래에 안내합니다.
export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error, reset } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: '', password: '' },
  });

  const handleLogin = (form: LoginForm) =>
    login(form, {
      onError: (loginError) => {
        if (getApiError(loginError)?.code !== AUTH_ACCOUNT_BLOCKED) return;
        void navigate(ROUTES.BLOCKED, {
          state: { status: 'SUSPENDED' } satisfies BlockedAdminAccount,
        });
      },
    });

  // 입력을 고치기 시작하면 이전 로그인 실패 안내를 지웁니다.
  const handleChangeInput = () => {
    if (error) reset();
  };

  const errorMessage =
    errors.loginId?.message ??
    errors.password?.message ??
    (error ? getLoginErrorMessage(error) : undefined);

  return (
    <AuthCard title="관리자 로그인" size="sm" onSubmit={handleSubmit(handleLogin)}>
      <Field label="관리자 아이디" htmlFor="loginId" className="w-full">
        <TextInput
          id="loginId"
          autoComplete="username"
          hasError={Boolean(errors.loginId)}
          {...register('loginId', { onChange: handleChangeInput })}
        />
      </Field>
      {/* 아이디·비밀번호 오류와 로그인 실패 안내는 비밀번호 칸 아래 고정 자리에 하나만 표시합니다. */}
      <Field label="비밀번호" htmlFor="password" errorMessage={errorMessage} className="w-full">
        <TextInput
          id="password"
          type="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register('password', { onChange: handleChangeInput })}
        />
      </Field>
      <Button type="submit" disabled={isPending} className="w-full">
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
    </AuthCard>
  );
}
