import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Modal } from '@/components/common/Modal';
import { Notice } from '@/components/common/Notice';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { ADMIN_STATUS_OPTIONS } from '@/constants/admin';
import {
  ADMIN_ACCOUNTS_PREVIEW,
  CURRENT_ADMIN_LOGIN_ID_PREVIEW,
  getAdminAccountPreview,
} from '@/constants/adminPreview';
import { ROUTES } from '@/constants/routes';
import type { AdminCreateForm, AdminStatusForm } from '@/schemas/adminSchema';
import { adminCreateSchema, adminStatusSchema } from '@/schemas/adminSchema';
import { useCreateAdminAccountMutation } from '@/queries/useCreateAdminAccountMutation';
import { getApiErrorMessage } from '@/utils/apiError';
import { cn } from '@/utils/cn';

const CARD_CLASS_NAME =
  'flex flex-col gap-4 rounded-[14px] border border-motu-border bg-white p-6 self-stretch';

// 본인 정지(E01)가 정상 관리자 0명(E02)보다 우선합니다.
const getStatusError = (loginId: string, form: AdminStatusForm) => {
  if (form.status !== 'SUSPENDED') return null;
  if (loginId === CURRENT_ADMIN_LOGIN_ID_PREVIEW) return '본인 계정은 정지할 수 없습니다.';
  // TODO(MOTU-29-1): 정상 관리자 수 검사는 서버 응답으로 교체합니다.
  const activeCount = ADMIN_ACCOUNTS_PREVIEW.filter(
    (account) => account.status === 'ACTIVE' && account.loginId !== loginId,
  ).length;
  if (activeCount === 0) return '정상 상태인 관리자가 최소 1명 있어야 합니다.';
  return null;
};

// ADM-ACC-02 관리자 계정 생성·상태 변경 (?target=아이디 로 들어오면 상태 변경 대상을 채웁니다)
export default function AdminManagePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusError, setStatusError] = useState<string | null>(null);
  const {
    mutate: createAccount,
    isPending: isCreating,
    error: createError,
  } = useCreateAdminAccountMutation();

  // TODO(MOTU-29-1): 관리자 계정 상세 API 연동
  const target = getAdminAccountPreview(searchParams.get('target') ?? '');

  const createForm = useForm<AdminCreateForm>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: { loginId: '', name: '', email: '', duty: '' },
  });
  const statusForm = useForm<AdminStatusForm>({
    resolver: zodResolver(adminStatusSchema),
    defaultValues: {
      status: target?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
      reason: '',
    },
  });
  const nextStatus = useWatch({ control: statusForm.control, name: 'status' });
  const createErrors = createForm.formState.errors;
  const statusErrors = statusForm.formState.errors;

  // 임시 비밀번호는 서버가 등록 이메일로 보내고, 최초 로그인 시 비밀번호를 바꾸게 합니다.
  // 메일을 보내지 못하면 계정도 만들지 않으며, 실패하면 입력값을 유지합니다.
  const handleCreate = (form: AdminCreateForm) =>
    createAccount(
      {
        loginId: form.loginId.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        duty: form.duty.trim() || undefined,
      },
      { onSuccess: () => void navigate(ROUTES.ADMINS) },
    );

  // TODO(MOTU-29-1): 관리자 계정 목록·상세 API(백엔드 MOTU-29-1-3)가 나오면 상태 변경 API 를 연동합니다.
  // (PATCH /admin/admin-accounts/{userId}/status, 본인·마지막 정상 관리자 정지는 서버가 거절)
  const handleChangeStatus = (form: AdminStatusForm) => {
    if (!target) return;
    const error = getStatusError(target.loginId, form);
    if (error) {
      setStatusError(error);
      return;
    }
    void navigate(`${ROUTES.ADMINS}?selected=${encodeURIComponent(target.loginId)}`);
  };

  return (
    <div className="flex items-start gap-5">
      <form
        noValidate
        onSubmit={createForm.handleSubmit(handleCreate)}
        className={cn(CARD_CLASS_NAME, 'min-w-0 flex-1')}
      >
        <h2 className="text-title-md font-bold text-motu-text-primary">관리자 계정 생성</h2>
        <Field label="관리자 아이디" htmlFor="loginId" errorMessage={createErrors.loginId?.message}>
          <TextInput
            id="loginId"
            autoComplete="off"
            hasError={Boolean(createErrors.loginId)}
            {...createForm.register('loginId')}
          />
        </Field>
        <Field label="관리자명" htmlFor="name" errorMessage={createErrors.name?.message}>
          <TextInput
            id="name"
            hasError={Boolean(createErrors.name)}
            {...createForm.register('name')}
          />
        </Field>
        <Field label="이메일" htmlFor="email" errorMessage={createErrors.email?.message}>
          <TextInput
            id="email"
            type="email"
            hasError={Boolean(createErrors.email)}
            {...createForm.register('email')}
          />
        </Field>
        <Field label="담당 업무(참고)" htmlFor="duty" errorMessage={createErrors.duty?.message}>
          <TextInput
            id="duty"
            hasError={Boolean(createErrors.duty)}
            {...createForm.register('duty')}
          />
        </Field>
        {createError && <Notice tone="danger">{getApiErrorMessage(createError)}</Notice>}
        <div className="flex flex-1 items-end justify-end">
          <Button type="submit" disabled={isCreating}>
            계정 생성
          </Button>
        </div>
      </form>

      <form
        noValidate
        onSubmit={statusForm.handleSubmit(handleChangeStatus)}
        className={cn(CARD_CLASS_NAME, 'w-[400px] shrink-0')}
      >
        <h2 className="text-title-md font-bold text-motu-text-primary">계정 상태 변경</h2>
        <Field label="대상" htmlFor="target">
          <TextInput
            id="target"
            readOnly
            value={target?.loginId ?? ''}
            placeholder="목록에서 계정을 선택해 주세요."
          />
        </Field>
        <Field label="변경 상태" htmlFor="status">
          <Controller
            control={statusForm.control}
            name="status"
            render={({ field }) => (
              <Select
                id="status"
                options={ADMIN_STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                disabled={!target}
              />
            )}
          />
        </Field>
        <Field label="변경 사유 *" htmlFor="reason" errorMessage={statusErrors.reason?.message}>
          <TextArea
            id="reason"
            maxLength={200}
            disabled={!target}
            hasError={Boolean(statusErrors.reason)}
            {...statusForm.register('reason')}
          />
        </Field>
        {nextStatus === 'SUSPENDED' && (
          <Notice tone="danger">정지 계정은 관리자 사이트에 로그인할 수 없습니다.</Notice>
        )}
        <Button type="submit" disabled={!target} className="w-full">
          상태 변경
        </Button>
      </form>

      <Modal
        isOpen={Boolean(statusError)}
        onClose={() => setStatusError(null)}
        size="sm"
        title="관리자 상태를 변경할 수 없습니다"
        description={<p className="text-body-md">{statusError}</p>}
        actions={<Button onClick={() => setStatusError(null)}>확인</Button>}
      />
    </div>
  );
}
