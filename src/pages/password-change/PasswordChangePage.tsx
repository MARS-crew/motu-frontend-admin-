import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { FieldMessage } from '@/components/common/FieldMessage';
import { Notice } from '@/components/common/Notice';
import { TextInput } from '@/components/common/TextInput';
import { ROUTES } from '@/constants/routes';
import type { InitialPasswordForm } from '@/schemas/authSchema';
import { useChangeMyPasswordMutation } from '@/queries/useChangeMyPasswordMutation';
import { initialPasswordSchema, PASSWORD_RULE_TEXT } from '@/schemas/authSchema';
import { getApiErrorMessage } from '@/utils/apiError';

// ADM-AUTH-01-01 관리자 최초 비밀번호 변경 (임시 비밀번호로 최초 로그인한 경우)
export default function PasswordChangePage() {
  const navigate = useNavigate();
  const { mutate: changePassword, isPending, error, reset } = useChangeMyPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<InitialPasswordForm>({
    resolver: zodResolver(initialPasswordSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
  });

  // 변경 전에는 ProtectedRoute 가 다른 관리자 메뉴 접근을 막고, 변경에 성공하면 대시보드로 이동합니다.
  const handleChangePassword = (form: InitialPasswordForm) =>
    changePassword(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      { onSuccess: () => void navigate(ROUTES.DASHBOARD, { replace: true }) },
    );

  const errorMessage =
    (touchedFields.currentPassword ? errors.currentPassword?.message : undefined) ??
    errors.newPassword?.message ??
    (touchedFields.newPasswordConfirm ? errors.newPasswordConfirm?.message : undefined) ??
    // 현재 비밀번호 불일치·기존과 같은 비밀번호 등 서버 오류
    (error ? getApiErrorMessage(error) : undefined);

  return (
    <AuthCard title="최초 비밀번호 변경" size="lg" onSubmit={handleSubmit(handleChangePassword)}>
      <Notice className="w-full">
        <p>임시 비밀번호로 로그인했습니다.</p>
        <p>계속하려면 새 비밀번호를 설정해 주세요.</p>
      </Notice>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full gap-4">
          <Field label="현재 임시 비밀번호" htmlFor="currentPassword" className="flex-1">
            <TextInput
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              hasError={Boolean(touchedFields.currentPassword && errors.currentPassword)}
              {...register('currentPassword', { onChange: () => error && reset() })}
            />
          </Field>
          <Field label="새 비밀번호" htmlFor="newPassword" className="flex-1">
            <TextInput
              id="newPassword"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(errors.newPassword)}
              {...register('newPassword', { onChange: () => error && reset() })}
            />
          </Field>
          <Field label="새 비밀번호 확인" htmlFor="newPasswordConfirm" className="flex-1">
            <TextInput
              id="newPasswordConfirm"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(touchedFields.newPasswordConfirm && errors.newPasswordConfirm)}
              {...register('newPasswordConfirm', { onChange: () => error && reset() })}
            />
          </Field>
        </div>
        <FieldMessage errorMessage={errorMessage} isReserved />
        <FieldMessage helperText={PASSWORD_RULE_TEXT} />
      </div>
      <div className="flex w-full justify-end">
        <Button type="submit" disabled={!isValid || isPending}>
          변경 후 대시보드 이동
        </Button>
      </div>
    </AuthCard>
  );
}
