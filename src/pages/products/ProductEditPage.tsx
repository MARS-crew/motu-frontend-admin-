import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import type { InfoItem } from '@/components/common/InfoCard';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import type { SelectOption } from '@/components/common/Select';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { TextInput } from '@/components/common/TextInput';
import { ProductEditConfirmModal } from '@/components/product/ProductEditConfirmModal';
import { LISTING_CATEGORY_LABELS } from '@/constants/listing';
import { PRODUCT_EXPOSURE_LABELS } from '@/constants/product';
import { getProductDetailPreview } from '@/constants/productPreview';
import { getProductDetailPath } from '@/constants/routes';
import type { ProductEditForm } from '@/schemas/productSchema';
import { productEditSchema } from '@/schemas/productSchema';
import type { ListingCategory } from '@/types/listing';
import type { ProductExposure } from '@/types/product';
import { formatDateTimeText } from '@/utils/date';
import { formatNumber } from '@/utils/format';

const CATEGORY_OPTIONS: SelectOption<ListingCategory>[] = (
  Object.keys(LISTING_CATEGORY_LABELS) as ListingCategory[]
).map((value) => ({ value, label: LISTING_CATEGORY_LABELS[value] }));

const EXPOSURE_OPTIONS: SelectOption<ProductExposure>[] = [
  { value: 'PUBLIC', label: PRODUCT_EXPOSURE_LABELS.PUBLIC },
  { value: 'PRIVATE', label: PRODUCT_EXPOSURE_LABELS.PRIVATE },
];

const CURRENT_IMAGE_LABEL = '현재 등록 이미지';

const toNumberText = (value: number | null) => (value === null ? '' : formatNumber(value));
const normalizeNumber = (value: string) =>
  value.trim() ? formatNumber(Number(value.replaceAll(',', ''))) : '-';

// 변경된 항목만 '변경 전 → 변경 후'로 보여줍니다. 긴 글은 '수정됨'으로 줄입니다.
const getChangedRows = (before: ProductEditForm, after: ProductEditForm): InfoItem[] => {
  const rows: InfoItem[] = [];
  const pushIfChanged = (label: string, prev: string, next: string, isLongText = false) => {
    if (prev === next) return;
    rows.push({ label, value: isLongText ? '수정됨' : `${prev || '-'} → ${next || '-'}` });
  };

  pushIfChanged('상품명', before.productName, after.productName.trim());
  pushIfChanged(
    '카테고리',
    LISTING_CATEGORY_LABELS[before.category as ListingCategory],
    LISTING_CATEGORY_LABELS[after.category as ListingCategory],
  );
  pushIfChanged(
    '노출 상태',
    PRODUCT_EXPOSURE_LABELS[before.exposure as ProductExposure],
    PRODUCT_EXPOSURE_LABELS[after.exposure as ProductExposure],
  );
  pushIfChanged('상품 소개', before.intro, after.intro, true);
  pushIfChanged('공식 URL', before.officialUrl, after.officialUrl.trim(), true);
  pushIfChanged('대표 이미지', before.imageFileName, after.imageFileName, true);
  pushIfChanged('MAU', normalizeNumber(before.mau), normalizeNumber(after.mau));
  pushIfChanged(
    '거래액',
    normalizeNumber(before.transactionAmount),
    normalizeNumber(after.transactionAmount),
  );
  pushIfChanged(
    '지표 기준일',
    formatDateTimeText(before.metricsBaseDate),
    formatDateTimeText(after.metricsBaseDate),
  );
  rows.push({ label: '수정 사유', value: after.reason.trim() });
  return rows;
};

// ADM-PRD-03 상장 상품 정보 수정 (거래 상태는 이 화면에서 바꾸지 않습니다)
export default function ProductEditPage() {
  const { productId = '' } = useParams();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [confirmRows, setConfirmRows] = useState<InfoItem[] | null>(null);

  // TODO(MOTU-23-1): 상장 상품 상세 API 연동
  const product = getProductDetailPreview(productId);
  const defaultValues: ProductEditForm = {
    productName: product?.productName ?? '',
    category: product?.category ?? '',
    exposure: product?.exposure ?? '',
    intro: product?.intro ?? '',
    officialUrl: product?.officialUrl ?? '',
    imageFileName: CURRENT_IMAGE_LABEL,
    mau: toNumberText(product?.metrics.mau ?? null),
    transactionAmount: toNumberText(product?.metrics.transactionAmount ?? null),
    metricsBaseDate: product?.metrics.baseDate ?? '',
    reason: '',
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductEditForm>({ resolver: zodResolver(productEditSchema), defaultValues });

  if (!product) return <PlaceholderSection description="상장 상품을 찾을 수 없습니다." />;

  const detailPath = getProductDetailPath(product.productId);

  const handleSelectImage = () => imageInputRef.current?.click();
  // TODO(MOTU-23-1): 대표 이미지 업로드 API 연동 (지금은 선택한 파일명만 표시)
  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setValue('imageFileName', file.name, { shouldDirty: true });
  };
  const handleCancel = () => void navigate(detailPath);
  const handleOpenConfirm = (form: ProductEditForm) =>
    setConfirmRows(getChangedRows(defaultValues, form));
  // TODO(MOTU-23-1): 상품 정보 수정 API 연동 (변경 전·후 값과 사유는 관리자 활동 이력에 저장)
  const handleSave = () => {
    setConfirmRows(null);
    void navigate(detailPath, { replace: true });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleOpenConfirm)}
      className="flex flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
    >
      <div className="grid grid-cols-3 gap-3">
        <Field label="상품명 *" htmlFor="productName" errorMessage={errors.productName?.message}>
          <TextInput
            id="productName"
            hasError={Boolean(errors.productName)}
            {...register('productName')}
          />
        </Field>
        <Field label="카테고리 *" htmlFor="category" errorMessage={errors.category?.message}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                id="category"
                options={CATEGORY_OPTIONS}
                value={field.value as ListingCategory | ''}
                onChange={field.onChange}
                hasError={Boolean(errors.category)}
              />
            )}
          />
        </Field>
        <Field label="노출 상태 *" htmlFor="exposure" errorMessage={errors.exposure?.message}>
          <Controller
            control={control}
            name="exposure"
            render={({ field }) => (
              <Select
                id="exposure"
                options={EXPOSURE_OPTIONS}
                value={field.value as ProductExposure | ''}
                onChange={field.onChange}
                hasError={Boolean(errors.exposure)}
              />
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="상품 소개" htmlFor="intro">
          <TextArea id="intro" {...register('intro')} />
        </Field>
        <div className="flex flex-col gap-3">
          <Field label="공식 URL" htmlFor="officialUrl" errorMessage={errors.officialUrl?.message}>
            <TextInput
              id="officialUrl"
              type="url"
              hasError={Boolean(errors.officialUrl)}
              {...register('officialUrl')}
            />
          </Field>
          <div className="flex items-end gap-2">
            <Field label="대표 이미지" htmlFor="imageFileName" className="flex-1">
              <TextInput id="imageFileName" readOnly {...register('imageFileName')} />
            </Field>
            <Button variant="secondary" onClick={handleSelectImage}>
              이미지 파일 선택
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleChangeImage}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="MAU" htmlFor="mau" errorMessage={errors.mau?.message}>
          <TextInput
            id="mau"
            inputMode="numeric"
            hasError={Boolean(errors.mau)}
            {...register('mau')}
          />
        </Field>
        <Field
          label="거래액"
          htmlFor="transactionAmount"
          errorMessage={errors.transactionAmount?.message}
        >
          <TextInput
            id="transactionAmount"
            inputMode="numeric"
            hasError={Boolean(errors.transactionAmount)}
            {...register('transactionAmount')}
          />
        </Field>
        <Field
          label="지표 기준일 (조건부 필수)"
          htmlFor="metricsBaseDate"
          errorMessage={errors.metricsBaseDate?.message}
        >
          <TextInput
            id="metricsBaseDate"
            type="date"
            hasError={Boolean(errors.metricsBaseDate)}
            {...register('metricsBaseDate')}
          />
        </Field>
      </div>

      <Field label="수정 사유 *" htmlFor="reason" errorMessage={errors.reason?.message}>
        <TextArea id="reason" hasError={Boolean(errors.reason)} {...register('reason')} />
      </Field>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCancel}>
          취소
        </Button>
        <Button type="submit">변경 내용 확인</Button>
      </div>

      <ProductEditConfirmModal
        rows={confirmRows}
        onClose={() => setConfirmRows(null)}
        onConfirm={handleSave}
      />
    </form>
  );
}
