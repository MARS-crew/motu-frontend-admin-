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
import type { SelectOption } from '@/components/common/Select';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { ImportantNoticeLimitModal } from '@/components/notice/ImportantNoticeLimitModal';
import type { NoticePreview } from '@/components/notice/NoticePreviewModal';
import { NoticePreviewModal } from '@/components/notice/NoticePreviewModal';
import { NoticePublishConfirmModal } from '@/components/notice/NoticePublishConfirmModal';
import {
  ALL_MEMBERS_TARGET_LABEL,
  MAX_IMPORTANT_NOTICES,
  NOTICE_TYPE_FULL_LABELS,
  NOTICE_TYPE_OPTIONS,
} from '@/constants/notice';
import { getNoticePreview, NOTICES_PREVIEW } from '@/constants/noticePreview';
import { PRODUCTS_PREVIEW } from '@/constants/productPreview';
import { getNoticeDeletePath, ROUTES } from '@/constants/routes';
import type { NoticeForm } from '@/schemas/noticeSchema';
import { noticeFormSchema } from '@/schemas/noticeSchema';
import type { NoticeType } from '@/types/notice';
import { formatMonthDayTime } from '@/utils/date';

// TODO(MOTU-26-1): 상장 상품 목록 API로 교체합니다.
const PRODUCT_OPTIONS: SelectOption[] = PRODUCTS_PREVIEW.map((product) => ({
  value: product.productId,
  label: `${product.productName} / ${product.productId}`,
}));

const getProductLabel = (productId: string) =>
  PRODUCT_OPTIONS.find((option) => option.value === productId)?.label ?? productId;

const getProductName = (productId: string) =>
  PRODUCTS_PREVIEW.find((product) => product.productId === productId)?.productName ?? null;

// 09.03 20:30 ~ 09.10 23:59
const formatPeriod = (startAt: string, endAt: string) =>
  `${formatMonthDayTime(startAt)} ~ ${formatMonthDayTime(endAt)}`;

// TODO(MOTU-26-1): 중요 공지 개수 검사는 서버 응답으로 교체합니다.
// 게시 중·게시 예약 중요 공지와 겹치는 구간을 훑어 동시에 몇 개가 되는지 셉니다.
// 종료 시각과 다음 시작 시각이 같으면 겹치지 않습니다.
const exceedsImportantLimit = (form: NoticeForm, noticeId: string | undefined) => {
  if (!form.isImportant) return false;
  const others = NOTICES_PREVIEW.filter(
    (notice) =>
      notice.noticeId !== noticeId &&
      notice.isImportant &&
      (notice.status === 'PUBLISHED' || notice.status === 'SCHEDULED') &&
      notice.startAt !== null &&
      notice.endAt !== null &&
      notice.startAt < form.endAt &&
      notice.endAt > form.startAt,
  );
  const points = [form.startAt, ...others.map((notice) => notice.startAt as string)];
  return points.some((point) => {
    const overlapping = others.filter(
      (notice) => (notice.startAt as string) <= point && point < (notice.endAt as string),
    );
    return (
      point >= form.startAt && point < form.endAt && overlapping.length >= MAX_IMPORTANT_NOTICES
    );
  });
};

// ADM-NTC-02 공지 작성 및 수정 (공지 ID가 있으면 기존 공지 수정)
export default function NoticeFormPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [confirmRows, setConfirmRows] = useState<InfoItem[] | null>(null);
  const [preview, setPreview] = useState<NoticePreview | null>(null);
  const [limitPeriod, setLimitPeriod] = useState<string | null>(null);

  // TODO(MOTU-26-1): 공지 상세 API 연동
  const notice = noticeId ? getNoticePreview(noticeId) : null;
  const isEdit = Boolean(noticeId);

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
    defaultValues: {
      type: notice?.type ?? 'SERVICE',
      productId: notice?.productId ?? '',
      isImportant: notice?.isImportant ?? false,
      title: notice?.title ?? '',
      content: notice?.content ?? '',
      startAt: notice?.startAt ?? '',
      endAt: notice?.endAt ?? '',
    },
  });
  const type = useWatch({ control, name: 'type' });

  if (isEdit && (!notice || notice.status === 'DELETED')) {
    return <PlaceholderSection description="공지를 찾을 수 없습니다." />;
  }

  const handleChangeType = (nextType: NoticeType) => {
    setValue('type', nextType);
    // 전체 공지는 대상 상품을 고르지 않습니다.
    if (nextType === 'SERVICE') setValue('productId', '', { shouldValidate: true });
  };

  // 임시 저장은 제목만 있으면 됩니다.
  // TODO(MOTU-26-1): 공지 임시 저장 API 연동
  const handleSaveDraft = async () => {
    if (await trigger('title')) void navigate(ROUTES.NOTICES);
  };

  const handleOpenPreview = () => {
    const form = getValues();
    setPreview({
      productName: form.type === 'PRODUCT' ? getProductName(form.productId) : null,
      title: form.title.trim(),
      startAt: form.startAt,
      content: form.content,
    });
  };

  const handleOpenConfirm = (form: NoticeForm) => {
    const period = formatPeriod(form.startAt, form.endAt);
    if (exceedsImportantLimit(form, noticeId)) {
      setLimitPeriod(period);
      return;
    }
    setConfirmRows([
      { label: '공지 구분', value: NOTICE_TYPE_FULL_LABELS[form.type] },
      { label: '제목', value: form.title.trim() },
      {
        label: '게시 대상',
        value: form.type === 'PRODUCT' ? getProductLabel(form.productId) : ALL_MEMBERS_TARGET_LABEL,
      },
      { label: '게시 기간', value: period },
      { label: '중요 공지', value: form.isImportant ? '예' : '아니오' },
    ]);
  };

  // TODO(MOTU-26-1): 공지 게시 API 연동 (시작일시가 미래이면 게시 예약으로 저장)
  const handlePublish = () => {
    setConfirmRows(null);
    void navigate(ROUTES.NOTICES, { replace: true });
  };

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
                options={PRODUCT_OPTIONS}
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
        <Button variant="secondary" onClick={() => void handleSaveDraft()}>
          임시 저장
        </Button>
        <Button variant="secondary" onClick={handleOpenPreview}>
          미리보기
        </Button>
        <Button type="submit">게시 확인</Button>
      </div>

      <NoticePreviewModal preview={preview} onClose={() => setPreview(null)} />
      <NoticePublishConfirmModal
        rows={confirmRows}
        onClose={() => setConfirmRows(null)}
        onConfirm={handlePublish}
      />
      <ImportantNoticeLimitModal period={limitPeriod} onClose={() => setLimitPeriod(null)} />
    </form>
  );
}
