import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { FieldMessage } from '@/components/common/FieldMessage';
import { TextInput } from '@/components/common/TextInput';
import { ROUTES } from '@/constants/routes';
import type { NewPasswordForm } from '@/schemas/authSchema';
import { newPasswordSchema, PASSWORD_RULE_TEXT } from '@/schemas/authSchema';

// ADM-AUTH-02-01 관리자 새 비밀번호 설정 (재설정 메일의 일회용 링크로 진입)
export default function PasswordResetConfirmPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: { newPassword: '', newPasswordConfirm: '' },
  });

  // TODO(MOTU-18-1): 새 비밀번호 설정 API 연동 (URL 의 token 사용, 만료·사용된 링크 처리)
  // 변경이 끝나면 기존 관리자 세션이 모두 만료되므로 로그인 화면으로 이동합니다.
  const handleChangePassword = () => void navigate(ROUTES.LOGIN, { replace: true });

  // 확인값은 입력을 마친 뒤에만 불일치 문구를 보여줍니다.
  const errorMessage =
    errors.newPassword?.message ??
    (touchedFields.newPasswordConfirm ? errors.newPasswordConfirm?.message : undefined);

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
              {...register('newPassword')}
            />
          </Field>
          <Field label="비밀번호 확인" htmlFor="newPasswordConfirm" className="flex-1">
            <TextInput
              id="newPasswordConfirm"
              type="password"
              autoComplete="new-password"
              hasError={Boolean(touchedFields.newPasswordConfirm && errors.newPasswordConfirm)}
              {...register('newPasswordConfirm')}
            />
          </Field>
        </div>
        {/* 오류가 있으면 오류 → 비밀번호 조건, 없으면 비밀번호 조건 → 확인값 안내 */}
        <div className="flex flex-col gap-1">
          <FieldMessage errorMessage={errorMessage} />
          <FieldMessage helperText={PASSWORD_RULE_TEXT} />
          {!errorMessage && (
            <FieldMessage helperText="새 비밀번호와 확인값을 동일하게 입력해 주세요." />
          )}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button type="submit" disabled={!isValid}>
          비밀번호 변경
        </Button>
      </div>
    </AuthCard>
  );
}
