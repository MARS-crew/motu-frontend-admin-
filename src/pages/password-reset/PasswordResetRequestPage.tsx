import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Notice } from '@/components/common/Notice';
import { TextInput } from '@/components/common/TextInput';
import { ROUTES } from '@/constants/routes';
import type { PasswordResetRequestForm } from '@/schemas/authSchema';
import { passwordResetRequestSchema } from '@/schemas/authSchema';

// ADM-AUTH-02 관리자 비밀번호 재설정 요청 (등록 이메일로 일회용 링크 발송)
export default function PasswordResetRequestPage() {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestForm>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: '' },
  });

  // TODO(MOTU-18-1): 재설정 링크 발송 API 연동
  // - 등록되지 않은 관리자 이메일이면 setError('email', { message: '등록된 관리자 이메일이 아닙니다.' })
  const handleRequest = () => setIsSent(true);
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
          <Button type="submit">재설정 링크 보내기</Button>
        </div>
        {emailError && (
          <Notice tone="danger" className="w-full">
            {emailError}
          </Notice>
        )}
      </div>
      {!emailError && (
        <Notice className="w-full">입력 정보가 확인되면 이메일로 링크를 보냅니다.</Notice>
      )}
    </AuthCard>
  );
}
