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
import { PRODUCT_EXPOSURE_LABELS } from '@/constants/product';
import { useProductDetailQuery } from '@/queries/useProductDetailQuery';
import { useUpdateProductMutation } from '@/queries/useProductStatusMutations';
import { useSectorsQuery } from '@/queries/useSectorsQuery';
import { getProductDetailPath } from '@/constants/routes';
import type { ProductEditForm } from '@/schemas/productSchema';
import { productEditSchema } from '@/schemas/productSchema';
import type { ProductExposure, UpdateAdminStockRequest } from '@/types/product';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText } from '@/utils/date';
import { formatNumber } from '@/utils/format';

const EXPOSURE_OPTIONS: SelectOption<ProductExposure>[] = [
  { value: 'PUBLIC', label: PRODUCT_EXPOSURE_LABELS.PUBLIC },
  { value: 'PRIVATE', label: PRODUCT_EXPOSURE_LABELS.PRIVATE },
];

const CURRENT_IMAGE_LABEL = '현재 등록 이미지';

const toNumberText = (value: number | null) => (value === null ? '' : formatNumber(value));
const toNumberOrNull = (value: string) => (value.trim() ? Number(value.replaceAll(',', '')) : null);

// 수정 폼 → 상품 수정 API 요청 (비운 값은 null 로 보내 지웁니다)
const toUpdateRequest = (form: ProductEditForm): UpdateAdminStockRequest => ({
  name: form.productName.trim(),
  sectorCode: Number(form.category),
  isPublic: form.exposure === 'PUBLIC',
  description: form.intro.trim() || null,
  officialUrl: form.officialUrl.trim() || null,
  mau: toNumberOrNull(form.mau),
  transactionVolume: toNumberOrNull(form.transactionAmount),
  metricsBaseDate: form.metricsBaseDate || null,
  reason: form.reason.trim(),
});

const normalizeNumber = (value: string) =>
  value.trim() ? formatNumber(Number(value.replaceAll(',', ''))) : '-';

// 변경된 항목만 '변경 전 → 변경 후'로 보여줍니다. 긴 글은 '수정됨'으로 줄입니다.
const getChangedRows = (
  before: ProductEditForm,
  after: ProductEditForm,
  sectorOptions: SelectOption[],
): InfoItem[] => {
  const getSectorName = (code: string) =>
    sectorOptions.find((option) => option.value === code)?.label ?? code;
  const rows: InfoItem[] = [];
  const pushIfChanged = (label: string, prev: string, next: string, isLongText = false) => {
    if (prev === next) return;
    rows.push({ label, value: isLongText ? '수정됨' : `${prev || '-'} → ${next || '-'}` });
  };

  pushIfChanged('상품명', before.productName, after.productName.trim());
  pushIfChanged('카테고리', getSectorName(before.category), getSectorName(after.category));
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
  const [pendingForm, setPendingForm] = useState<ProductEditForm | null>(null);
  const {
    mutate: updateProduct,
    isPending: isSaving,
    error: saveError,
    reset: resetSave,
  } = useUpdateProductMutation(Number(productId));

  const { data: product } = useProductDetailQuery(Number(productId));
  const { data: sectors = [] } = useSectorsQuery();
  const sectorOptions: SelectOption[] = sectors.map((sector) => ({
    value: String(sector.sectorCode),
    label: sector.sectorName,
  }));
  // 카테고리는 코드(GET /sectors)를 문자열로 다룹니다.
  const defaultValues: ProductEditForm = {
    productName: product?.productName ?? '',
    category: product ? String(product.sectorCode) : '',
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
  } = useForm<ProductEditForm>({
    resolver: zodResolver(productEditSchema),
    // 상세를 받아오면 현재 값으로 채웁니다. 이미 고친 값은 유지합니다.
    values: defaultValues,
    resetOptions: { keepDirtyValues: true },
  });

  if (!product) return <PlaceholderSection description="상장 상품을 불러오는 중입니다." />;

  const detailPath = getProductDetailPath(product.productId);

  const handleSelectImage = () => imageInputRef.current?.click();
  // TODO(MOTU-23-1): 대표 이미지 업로드 API 가 없어 선택한 파일명만 표시하고 저장하지 않습니다.
  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setValue('imageFileName', file.name, { shouldDirty: true });
  };
  const handleCancel = () => void navigate(detailPath);
  const handleOpenConfirm = (form: ProductEditForm) => {
    resetSave();
    setPendingForm(form);
    setConfirmRows(getChangedRows(defaultValues, form, sectorOptions));
  };
  const handleCloseConfirm = () => setConfirmRows(null);
  // 변경 전·후 값과 사유는 서버가 관리자 활동 이력에 저장합니다.
  const handleSave = () => {
    if (!pendingForm) return;
    updateProduct(toUpdateRequest(pendingForm), {
      onSuccess: () => void navigate(detailPath, { replace: true }),
    });
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
                options={sectorOptions}
                value={field.value}
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
        {/* 상품 소개 칸은 공식 URL 입력칸 위쪽부터 대표 이미지 입력칸 아래쪽까지 채웁니다. */}
        <Field label="상품 소개" htmlFor="intro">
          <TextArea id="intro" size="fill" {...register('intro')} />
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
        onClose={handleCloseConfirm}
        onConfirm={handleSave}
        isSubmitting={isSaving}
        errorMessage={saveError ? getApiErrorMessage(saveError) : undefined}
      />
    </form>
  );
}
