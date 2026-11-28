import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Notice } from '@/components/common/Notice';
import { TextInput } from '@/components/common/TextInput';
import { AUTH_ACCOUNT_BLOCKED } from '@/constants/errorCodes';
import { ROUTES } from '@/constants/routes';
import { useRequestPasswordResetMutation } from '@/queries/usePasswordResetMutations';
import type { PasswordResetRequestForm } from '@/schemas/authSchema';
import { passwordResetRequestSchema } from '@/schemas/authSchema';
import type { BlockedAdminAccount, PasswordResetLocationState } from '@/types/auth';
import { getApiError } from '@/utils/apiError';
import { getPasswordResetErrorMessage } from '@/utils/authError';

// ADM-AUTH-02 관리자 비밀번호 재설정 요청 (등록 이메일로 일회용 링크 발송)
export default function PasswordResetRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSent, setIsSent] = useState(false);
  const { mutate: requestReset, isPending } = useRequestPasswordResetMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<PasswordResetRequestForm>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: '' },
  });

  // 1분 안에 다시 요청하거나 메일 발송에 실패해도 서버는 성공으로 응답합니다.
  // 등록되지 않은 이메일·잠긴 계정은 안내 자리에 문구를, 정지된 관리자는 접근 차단 화면을 보여 줍니다.
  const handleRequest = ({ email }: PasswordResetRequestForm) =>
    requestReset(email, {
      onSuccess: () => setIsSent(true),
      onError: (requestError) => {
        if (getApiError(requestError)?.code === AUTH_ACCOUNT_BLOCKED) {
          void navigate(ROUTES.BLOCKED, {
            state: { status: 'SUSPENDED' } satisfies BlockedAdminAccount,
          });
          return;
        }
        setError('email', { message: getPasswordResetErrorMessage(requestError) });
      },
    });
  const handleBackToLogin = () => void navigate(ROUTES.LOGIN);

  if (isSent) {
    return (
      <AuthCard title="메일을 확인해 주세요">
        <Notice className="w-full">
          입력 정보가 확인되면 등록 이메일로 재설정 링크를 보냈습니다. 링크는 10분 동안 한 번만
          사용할 수 있습니다.
        </Notice>
        <Button variant="secondary" onClick={handleBackToLogin}>
          로그인으로 돌아가기
        </Button>
      </AuthCard>
    );
  }

  const emailError = errors.email?.message;
  // 새 비밀번호 화면에서 만료·사용된 링크로 돌아온 경우, 입력을 시작하기 전까지 안내합니다.
  const linkErrorMessage = isDirty
    ? undefined
    : (location.state as PasswordResetLocationState | null)?.linkErrorMessage;
  const noticeError = emailError ?? linkErrorMessage;

  return (
    <AuthCard title="재설정 요청" onSubmit={handleSubmit(handleRequest)}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-end gap-2">
          <Field label="등록 이메일" htmlFor="email" className="flex-1">
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              hasError={Boolean(emailError)}
              {...register('email')}
            />
          </Field>
          <Button type="submit" disabled={isPending}>
            재설정 링크 보내기
          </Button>
        </div>
        {/* 안내와 오류는 같은 자리에 번갈아 표시해 카드 높이가 바뀌지 않게 합니다. */}
        {noticeError ? (
          <Notice tone="danger" className="w-full">
            {noticeError}
          </Notice>
        ) : (
          <Notice className="w-full">입력 정보가 확인되면 이메일로 링크를 보냅니다.</Notice>
        )}
      </div>
    </AuthCard>
  );
}
