import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { FieldMessage } from '@/components/common/FieldMessage';
import { TextInput } from '@/components/common/TextInput';
import { AUTH_ACCOUNT_BLOCKED, AUTH_INVALID_PASSWORD_RESET_TOKEN } from '@/constants/errorCodes';
import { ROUTES } from '@/constants/routes';
import { useConfirmPasswordResetMutation } from '@/queries/usePasswordResetMutations';
import { usePasswordResetTokenQuery } from '@/queries/usePasswordResetTokenQuery';
import type { NewPasswordForm } from '@/schemas/authSchema';
import { newPasswordSchema, PASSWORD_RULE_TEXT } from '@/schemas/authSchema';
import type { BlockedAdminAccount, PasswordResetLocationState } from '@/types/auth';
import { getApiError, getApiErrorMessage } from '@/utils/apiError';
import { getPasswordResetErrorMessage, INVALID_RESET_LINK_MESSAGE } from '@/utils/authError';

// ADM-AUTH-02-01 관리자 새 비밀번호 설정 (재설정 메일의 일회용 링크로 진입, ?token=...)
export default function PasswordResetConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { data: link, error: linkError } = usePasswordResetTokenQuery(token);
  const { mutate: confirmReset, isPending, error, reset } = useConfirmPasswordResetMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: { newPassword: '', newPasswordConfirm: '' },
  });

  // 정지된 관리자 → 접근 차단 화면, 만료·사용된 링크 → 안내와 함께 재설정 요청 화면으로 보냅니다.
  const redirectByError = useCallback(
    (cause: unknown) => {
      const code = getApiError(cause)?.code;
      if (code === AUTH_ACCOUNT_BLOCKED) {
        void navigate(ROUTES.BLOCKED, {
          replace: true,
          state: { status: 'SUSPENDED' } satisfies BlockedAdminAccount,
        });
      } else if (code === AUTH_INVALID_PASSWORD_RESET_TOKEN) {
        void navigate(ROUTES.PASSWORD_RESET, {
          replace: true,
          state: {
            linkErrorMessage: getApiErrorMessage(cause),
          } satisfies PasswordResetLocationState,
        });
      }
    },
    [navigate],
  );

  // 링크 없이 들어왔거나, 화면을 열 때 확인한 링크를 쓸 수 없으면 바로 이동합니다.
  useEffect(() => {
    if (!token) {
      void navigate(ROUTES.PASSWORD_RESET, {
        replace: true,
        state: {
          linkErrorMessage: INVALID_RESET_LINK_MESSAGE,
        } satisfies PasswordResetLocationState,
      });
      return;
    }
    if (linkError) redirectByError(linkError);
  }, [token, linkError, navigate, redirectByError]);

  // 변경이 끝나면 기존 관리자 세션이 모두 만료되므로 로그인 화면으로 이동합니다.
  // 현재 비밀번호와 같으면 같은 링크로 바로 다시 시도할 수 있어 이 화면에 문구만 보여 줍니다.
  const handleChangePassword = ({ newPassword }: NewPasswordForm) =>
    confirmReset(
      { token, newPassword },
      {
        onSuccess: () => void navigate(ROUTES.LOGIN, { replace: true }),
        onError: redirectByError,
      },
    );

  const serverError = error ?? linkError;
  // 확인값은 입력을 마친 뒤에만 불일치 문구를 보여줍니다.
  const errorMessage =
    errors.newPassword?.message ??
    (touchedFields.newPasswordConfirm ? errors.newPasswordConfirm?.message : undefined) ??
    (serverError ? getPasswordResetErrorMessage(serverError) : undefined);

  return (
    <AuthCard title="새 비밀번호 설정" onSubmit={handleSubmit(handleChangePassword)}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-4">
          <Field label="새 비밀번호" htmlFor="newPassword" className="flex-1">
            <TextInput
              id="newPassword"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(errors.newPassword)}
              {...register('newPassword', { onChange: () => error && reset() })}
            />
          </Field>
          <Field label="비밀번호 확인" htmlFor="newPasswordConfirm" className="flex-1">
            <TextInput
              id="newPasswordConfirm"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(touchedFields.newPasswordConfirm && errors.newPasswordConfirm)}
              {...register('newPasswordConfirm', { onChange: () => error && reset() })}
            />
          </Field>
        </div>
        {/* 첫 줄은 확인값 안내 자리이고, 오류가 나면 같은 자리에 오류를 표시합니다. */}
        <FieldMessage
          errorMessage={errorMessage}
          helperText="새 비밀번호와 확인값을 동일하게 입력해 주세요."
        />
        <FieldMessage helperText={PASSWORD_RULE_TEXT} />
      </div>
      <div className="flex w-full justify-end">
        {/* 링크 확인이 끝나기 전에는 변경할 수 없습니다. */}
        <Button type="submit" disabled={!isValid || !link?.valid || isPending}>
          비밀번호 변경
        </Button>
      </div>
    </AuthCard>
  );
}
