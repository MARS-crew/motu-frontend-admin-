import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { Notice } from '@/components/common/Notice';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { TextArea } from '@/components/common/TextArea';
import { PRODUCT_TRADE_STATUS_LABELS } from '@/constants/product';
import { getProductDetailPreview } from '@/constants/productPreview';
import { getProductDetailPath } from '@/constants/routes';
import type { ProductPauseForm, ProductResumeForm } from '@/schemas/productSchema';
import { productPauseSchema, productResumeSchema } from '@/schemas/productSchema';
import type { ProductDetail, ProductTradingLocationState } from '@/types/product';
import { formatNumber } from '@/utils/format';

type TradingCardProps = {
  product: ProductDetail;
  defaultReason: string;
  onDone: () => void;
};

// 거래 중지: 미체결 주문 취소, 예약 포인트·수량 해제 후 신규 주문·체결 차단
function PauseCard({ product, defaultReason, onDone }: TradingCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductPauseForm>({
    resolver: zodResolver(productPauseSchema),
    defaultValues: { reason: defaultReason, userNotice: '' },
  });

  // TODO(MOTU-23-1): 거래 중지 API 연동
  const handlePause = () => onDone();

  return (
    <form noValidate onSubmit={handleSubmit(handlePause)} className="w-1/2">
      <InfoCard
        title="거래 중지 확인"
        className="gap-4"
        items={[
          { label: '대상 상품', value: product.productName },
          { label: '현재 상태', value: PRODUCT_TRADE_STATUS_LABELS[product.tradeStatus] },
        ]}
      >
        <Field label="중지 사유 *" htmlFor="pauseReason" errorMessage={errors.reason?.message}>
          <TextArea id="pauseReason" hasError={Boolean(errors.reason)} {...register('reason')} />
        </Field>
        <Field label="사용자 안내문" htmlFor="pauseNotice">
          <TextArea id="pauseNotice" {...register('userNotice')} />
        </Field>
        <Notice tone="danger">
          <p>미체결 주문 {formatNumber(product.openOrderCount)}건 취소</p>
          <p>예약 포인트·수량 해제</p>
        </Notice>
        <Button type="submit" variant="danger" className="w-full">
          거래 중지
        </Button>
      </InfoCard>
    </form>
  );
}

// 거래 재개: 재개 시점부터 주문과 거래를 다시 허용
function ResumeCard({ product, defaultReason, onDone }: TradingCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductResumeForm>({
    resolver: zodResolver(productResumeSchema),
    defaultValues: { reason: defaultReason },
  });

  // TODO(MOTU-23-1): 거래 재개 API 연동
  const handleResume = () => onDone();

  return (
    <form noValidate onSubmit={handleSubmit(handleResume)} className="w-1/2">
      <InfoCard
        title="거래 재개 확인"
        className="gap-4"
        items={[
          { label: '대상 상품', value: product.productName },
          { label: '현재 상태', value: PRODUCT_TRADE_STATUS_LABELS[product.tradeStatus] },
        ]}
      >
        <Field label="재개 사유 *" htmlFor="resumeReason" errorMessage={errors.reason?.message}>
          <TextArea id="resumeReason" hasError={Boolean(errors.reason)} {...register('reason')} />
        </Field>
        <Notice tone="success">재개 시점부터 24시간 거래를 다시 허용합니다.</Notice>
        <Button type="submit" className="w-full">
          거래 재개
        </Button>
      </InfoCard>
    </form>
  );
}

// ADM-PRD-04 거래 중지 및 재개 (거래 가능 → 중지, 거래 중지 → 재개)
export default function ProductTradingPage() {
  const { productId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ProductTradingLocationState;

  // TODO(MOTU-23-1): 상장 상품 상세 API 연동
  const product = getProductDetailPreview(productId);
  if (!product) return <PlaceholderSection description="상장 상품을 찾을 수 없습니다." />;

  const handleDone = () =>
    void navigate(state?.returnTo ?? getProductDetailPath(product.productId), { replace: true });
  const defaultReason = state?.reason ?? '';

  if (product.tradeStatus === 'ACTIVE') {
    return <PauseCard product={product} defaultReason={defaultReason} onDone={handleDone} />;
  }
  if (product.tradeStatus === 'PAUSED') {
    return <ResumeCard product={product} defaultReason={defaultReason} onDone={handleDone} />;
  }
  return (
    <PlaceholderSection
      description={`${PRODUCT_TRADE_STATUS_LABELS[product.tradeStatus]} 상품은 거래를 중지하거나 재개할 수 없습니다.`}
    />
  );
}
