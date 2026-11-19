import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { buttonClassName } from '@/components/common/buttonClassName';
import { Checkbox } from '@/components/common/Checkbox';
import { Field } from '@/components/common/Field';
import type { InfoItem } from '@/components/common/InfoCard';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { Notice } from '@/components/common/Notice';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { ImportantNoticeLimitModal } from '@/components/notice/ImportantNoticeLimitModal';
import type { NoticePreview } from '@/components/notice/NoticePreviewModal';
import { NoticePreviewModal } from '@/components/notice/NoticePreviewModal';
import { NoticePublishConfirmModal } from '@/components/notice/NoticePublishConfirmModal';
import {
  ALL_MEMBERS_TARGET_LABEL,
  NOTICE_TYPE_FULL_LABELS,
  NOTICE_TYPE_OPTIONS,
} from '@/constants/notice';
import { NOTICE_PIN_LIMIT_EXCEEDED } from '@/constants/errorCodes';
import { getNoticeDeletePath, ROUTES } from '@/constants/routes';
import type { NoticeForm } from '@/schemas/noticeSchema';
import { noticeFormSchema } from '@/schemas/noticeSchema';
import {
  useCreateNoticeMutation,
  usePublishNoticeMutation,
  useUpdateNoticeMutation,
} from '@/queries/useNoticeMutations';
import { useNoticeDetailQuery } from '@/queries/useNoticesQuery';
import { useProductOptionsQuery } from '@/queries/useProductOptionsQuery';
import type { NoticeType } from '@/types/notice';
import { getApiError, getApiErrorMessage } from '@/utils/apiError';
import { toAdminNoticeRequest } from '@/utils/notice';
import { formatMonthDayTime } from '@/utils/date';

// 09.03 20:30 ~ 09.10 23:59 (종료일시가 없으면 시작일시만)
const formatPeriod = (startAt: string, endAt: string) =>
  endAt
    ? `${formatMonthDayTime(startAt)} ~ ${formatMonthDayTime(endAt)}`
    : formatMonthDayTime(startAt);

// ADM-NTC-02 공지 작성 및 수정 (공지 ID가 있으면 기존 공지 수정)
// 같은 시간에 게시되는 중요 공지 수(최대 3개)는 서버가 검사하고, 넘으면 안내 모달을 띄웁니다.
export default function NoticeFormPage() {
  const { noticeId: noticeIdParam } = useParams();
  const navigate = useNavigate();
  const [confirmForm, setConfirmForm] = useState<NoticeForm | null>(null);
  const [preview, setPreview] = useState<NoticePreview | null>(null);
  const [limitPeriod, setLimitPeriod] = useState<string | null>(null);

  const isEdit = Boolean(noticeIdParam);
  const noticeId = Number(noticeIdParam);
  const {
    data: notice,
    isPending: isLoading,
    isError,
    error: loadError,
  } = useNoticeDetailQuery(noticeId);
  const { data: productOptions = [] } = useProductOptionsQuery();

  const createNotice = useCreateNoticeMutation();
  const updateNotice = useUpdateNoticeMutation(noticeId);
  const publishNotice = usePublishNoticeMutation(noticeId);
  const saveError = createNotice.error ?? updateNotice.error ?? publishNotice.error;
  const isSaving = createNotice.isPending || updateNotice.isPending || publishNotice.isPending;

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<NoticeForm>({
    resolver: zodResolver(noticeFormSchema),
    // 수정 화면은 상세를 받아오면 현재 값으로 채웁니다. 이미 고친 값은 유지합니다.
    values: {
      type: notice?.type ?? 'SERVICE',
      productId: notice?.productId ?? '',
      isImportant: notice?.isImportant ?? false,
      title: notice?.title ?? '',
      content: notice?.content ?? '',
      startAt: notice?.startAt ?? '',
      endAt: notice?.endAt ?? '',
    },
    resetOptions: { keepDirtyValues: true },
  });
  const type = useWatch({ control, name: 'type' });

  if (isEdit) {
    if (isError) return <PlaceholderSection description={getApiErrorMessage(loadError)} />;
    if (isLoading) return <PlaceholderSection description="공지를 불러오는 중입니다." />;
    if (notice.status === 'DELETED') {
      return <PlaceholderSection description="삭제된 공지는 수정할 수 없습니다." />;
    }
  }

  const getProductLabel = (productId: string) =>
    productOptions.find((option) => option.value === productId)?.label ?? productId;

  const resetErrors = () => {
    createNotice.reset();
    updateNotice.reset();
    publishNotice.reset();
  };
  const handleSaved = () => void navigate(ROUTES.NOTICES, { replace: true });
  // 중요 공지 개수 초과는 안내 모달로, 그 밖의 실패는 버튼 위에 안내합니다.
  const handlePublishError = (publishError: Error, form: NoticeForm) => {
    setConfirmForm(null);
    if (getApiError(publishError)?.code === NOTICE_PIN_LIMIT_EXCEEDED) {
      resetErrors();
      setLimitPeriod(formatPeriod(form.startAt, form.endAt));
    }
  };

  const handleChangeType = (nextType: NoticeType) => {
    setValue('type', nextType);
    // 전체 공지는 대상 상품을 고르지 않습니다.
    if (nextType === 'SERVICE') setValue('productId', '', { shouldValidate: true });
  };

  // 임시 저장은 제목만 있으면 됩니다. 기존 공지는 상태를 바꾸지 않고 내용만 저장합니다.
  const handleSaveDraft = async () => {
    if (!(await trigger('title'))) return;
    resetErrors();
    const body = toAdminNoticeRequest(getValues());
    if (isEdit) updateNotice.mutate(body, { onSuccess: handleSaved });
    else createNotice.mutate({ ...body, status: 'DRAFT' }, { onSuccess: handleSaved });
  };

  const handleOpenPreview = () => {
    const form = getValues();
    setPreview({
      productName:
        form.type === 'PRODUCT' ? (getProductLabel(form.productId).split(' / ')[0] ?? null) : null,
      title: form.title.trim(),
      startAt: form.startAt,
      content: form.content,
    });
  };

  const handleOpenConfirm = (form: NoticeForm) => {
    resetErrors();
    setConfirmForm(form);
  };

  // 시작일시가 미래이면 게시 예약으로 저장됩니다.
  const handlePublish = () => {
    if (!confirmForm) return;
    const form = confirmForm;
    const body = toAdminNoticeRequest(form);
    const options = {
      onSuccess: handleSaved,
      onError: (publishError: Error) => handlePublishError(publishError, form),
    };
    if (isEdit) publishNotice.mutate(body, options);
    else createNotice.mutate({ ...body, status: 'POSTED' }, options);
  };

  const confirmRows: InfoItem[] | null = confirmForm && [
    { label: '공지 구분', value: NOTICE_TYPE_FULL_LABELS[confirmForm.type] },
    { label: '제목', value: confirmForm.title.trim() },
    {
      label: '게시 대상',
      value:
        confirmForm.type === 'PRODUCT'
          ? getProductLabel(confirmForm.productId)
          : ALL_MEMBERS_TARGET_LABEL,
    },
    { label: '게시 기간', value: formatPeriod(confirmForm.startAt, confirmForm.endAt) },
    { label: '중요 공지', value: confirmForm.isImportant ? '예' : '아니오' },
  ];

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleOpenConfirm)}
      className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
    >
      <div className="flex items-start gap-3">
        <Field label="공지 구분" htmlFor="type" className="flex-1">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                id="type"
                options={NOTICE_TYPE_OPTIONS}
                value={field.value}
                onChange={handleChangeType}
              />
            )}
          />
        </Field>
        <Field
          label="대상 상품"
          htmlFor="productId"
          errorMessage={errors.productId?.message}
          className="flex-1"
        >
          <Controller
            control={control}
            name="productId"
            render={({ field }) => (
              <Select
                id="productId"
                options={productOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={type === 'SERVICE'}
                placeholder={
                  type === 'SERVICE' ? `${ALL_MEMBERS_TARGET_LABEL} (상품 선택 불필요)` : '선택'
                }
                hasError={Boolean(errors.productId)}
              />
            )}
          />
        </Field>
        <Checkbox label="중요 공지" className="mt-6 h-11 w-[120px]" {...register('isImportant')} />
      </div>

      <Field label="제목" htmlFor="title" errorMessage={errors.title?.message}>
        <TextInput
          id="title"
          placeholder="공지 제목을 입력해 주세요."
          hasError={Boolean(errors.title)}
          {...register('title')}
        />
      </Field>

      <Field label="내용" htmlFor="content" errorMessage={errors.content?.message}>
        <TextArea
          id="content"
          size="lg"
          placeholder="공지 내용을 입력해 주세요."
          hasError={Boolean(errors.content)}
          {...register('content')}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="게시 시작일시" htmlFor="startAt" errorMessage={errors.startAt?.message}>
          <TextInput
            id="startAt"
            type="datetime-local"
            hasError={Boolean(errors.startAt)}
            {...register('startAt')}
          />
        </Field>
        <Field label="게시 종료일시" htmlFor="endAt" errorMessage={errors.endAt?.message}>
          <TextInput
            id="endAt"
            type="datetime-local"
            hasError={Boolean(errors.endAt)}
            {...register('endAt')}
          />
        </Field>
      </div>

      {saveError && <Notice tone="danger">{getApiErrorMessage(saveError)}</Notice>}

      <div className="flex gap-2">
        {notice && (
          <Link
            to={getNoticeDeletePath(notice.noticeId)}
            className={buttonClassName({ variant: 'secondary' })}
          >
            비공개 / 삭제
          </Link>
        )}
        <div className="flex-1" />
        <Button variant="secondary" disabled={isSaving} onClick={() => void handleSaveDraft()}>
          임시 저장
        </Button>
        <Button variant="secondary" onClick={handleOpenPreview}>
          미리보기
        </Button>
        <Button type="submit" disabled={isSaving}>
          게시 확인
        </Button>
      </div>

      <NoticePreviewModal preview={preview} onClose={() => setPreview(null)} />
      <NoticePublishConfirmModal
        rows={confirmRows}
        onClose={() => setConfirmForm(null)}
        onConfirm={handlePublish}
        isSubmitting={isSaving}
      />
      <ImportantNoticeLimitModal period={limitPeriod} onClose={() => setLimitPeriod(null)} />
    </form>
  );
}
