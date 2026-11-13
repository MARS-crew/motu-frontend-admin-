import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { Field } from '@/components/common/Field';
import { Notice } from '@/components/common/Notice';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { PRODUCT_TRADE_STATUS_LABELS, PRODUCT_TRADE_STATUS_TONES } from '@/constants/product';
import { getProductDetailPreview } from '@/constants/productPreview';
import { getProductDetailPath } from '@/constants/routes';
import type { ProductCloseForm } from '@/schemas/productSchema';
import { productCloseSchema } from '@/schemas/productSchema';
import { formatNumber } from '@/utils/format';

// ADM-PRD-05 상품 종료 확인 (종료 후 다시 거래할 수 없음)
export default function ProductClosePage() {
  const { productId = '' } = useParams();
  const navigate = useNavigate();

  // TODO(MOTU-23-1): 상장 상품 상세 API 연동
  const product = getProductDetailPreview(productId);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProductCloseForm>({
    resolver: zodResolver(productCloseSchema),
    mode: 'onChange',
    defaultValues: { reason: '', userNotice: '', isConfirmed: false },
  });
  // 사용자 앱 미리보기에 안내문을 바로 반영합니다.
  const userNotice = useWatch({ control, name: 'userNotice' });

  if (!product) return <PlaceholderSection description="상장 상품을 찾을 수 없습니다." />;
  if (product.tradeStatus === 'CLOSED') {
    return <PlaceholderSection description="이미 거래가 종료된 상품입니다." />;
  }

  const detailPath = getProductDetailPath(product.productId);
  const handleCancel = () => void navigate(detailPath);
  // TODO(MOTU-23-1): 상품 종료 API 연동 (처리 결과와 처리자는 관리자 활동 이력에 저장)
  const handleClose = () => void navigate(detailPath, { replace: true });

  return (
    <div className="flex items-start gap-5">
      <form
        noValidate
        onSubmit={handleSubmit(handleClose)}
        className="flex min-w-0 flex-1 flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-title-lg font-bold text-motu-text-primary">
            {product.productName} 거래를 종료하시겠습니까?
          </h2>
          <Badge tone={PRODUCT_TRADE_STATUS_TONES[product.tradeStatus]}>
            현재 {PRODUCT_TRADE_STATUS_LABELS[product.tradeStatus]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="종료 사유 *" htmlFor="closeReason" errorMessage={errors.reason?.message}>
            <TextArea id="closeReason" hasError={Boolean(errors.reason)} {...register('reason')} />
          </Field>
          <Field
            label="사용자 안내문 *"
            htmlFor="closeNotice"
            errorMessage={errors.userNotice?.message}
          >
            <TextArea
              id="closeNotice"
              placeholder="앱 상품 상세의 '거래 종료 안내'에 표시됩니다."
              hasError={Boolean(errors.userNotice)}
              {...register('userNotice')}
            />
          </Field>
        </div>

        <Notice tone="danger">
          <p>처리 영향</p>
          <p>• 신규 주문·체결 즉시 차단</p>
          <p>• 미체결 주문 {formatNumber(product.openOrderCount)}건 취소, 예약 포인트·수량 해제</p>
          <p>• 체결 완료된 보유 수량 유지 (자동 매도·환급 없음)</p>
          <p>• 상품 정보와 과거 거래 내역 조회 가능</p>
        </Notice>

        <Checkbox
          label="종료 후 다시 거래할 수 없음을 확인했습니다."
          {...register('isConfirmed')}
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" variant="danger" disabled={!isValid}>
            상품 종료
          </Button>
        </div>
      </form>

      <section className="flex w-[340px] shrink-0 flex-col gap-5 rounded-[14px] border border-motu-border bg-white p-6">
        <p className="text-label-md font-medium text-motu-text-secondary">
          사용자 앱 · 종료 후 상품 상세
        </p>
        <div className="flex flex-col gap-3 rounded-2xl bg-motu-bg px-4 py-5">
          <div className="flex items-center gap-2">
            <p className="text-title-lg font-bold text-motu-text-primary">{product.productName}</p>
            <Badge tone="muted">거래 종료</Badge>
          </div>
          <Notice>
            <p>거래 종료 안내</p>
            <p className="whitespace-pre-wrap break-keep">
              {userNotice.trim() || '사용자 안내문을 입력하면 여기에 표시됩니다.'}
            </p>
          </Notice>
          <div className="flex gap-2">
            <Button disabled className="flex-1">
              매수
            </Button>
            <Button disabled className="flex-1">
              매도
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
