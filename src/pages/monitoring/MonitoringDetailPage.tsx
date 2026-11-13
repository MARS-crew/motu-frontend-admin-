import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { InfoCard } from '@/components/common/InfoCard';
import { Notice } from '@/components/common/Notice';
import { PlaceholderSection } from '@/components/common/PlaceholderSection';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { AbnormalTradeStatusBadge } from '@/components/monitoring/AbnormalTradeStatusBadge';
import { NoIssueConfirmModal } from '@/components/monitoring/NoIssueConfirmModal';
import { ABNORMAL_TRADE_ACTION_OPTIONS, ABNORMAL_TRADE_TYPE_LABELS } from '@/constants/monitoring';
import { getAbnormalTradeDetailPreview } from '@/constants/monitoringPreview';
import { getProductTradingPath, ROUTES } from '@/constants/routes';
import type { AbnormalTradeActionForm } from '@/schemas/monitoringSchema';
import { abnormalTradeActionSchema } from '@/schemas/monitoringSchema';
import type { AbnormalTradeStatus } from '@/types/monitoring';
import type { ProductTradingLocationState } from '@/types/product';
import { formatDateTimeText } from '@/utils/date';

// ADM-MON-02 이상 거래 상세 (탐지 근거 확인과 관리자 조치)
// 상품 거래 중지·회원 정지는 해당 화면으로 대상과 사유를 넘겨 그 화면에서 최종 확정합니다.
export default function MonitoringDetailPage() {
  const { alertId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [noIssueReason, setNoIssueReason] = useState<string | null>(null);
  // TODO(MOTU-25-1): 처리 결과는 API 응답으로 갱신합니다. 지금은 화면에서만 바꿉니다.
  const [processedStatus, setProcessedStatus] = useState<AbnormalTradeStatus | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AbnormalTradeActionForm>({
    resolver: zodResolver(abnormalTradeActionSchema),
    defaultValues: { action: 'PAUSE_PRODUCT', reason: '' },
  });

  // TODO(MOTU-25-1): 이상 거래 상세 API 연동
  const trade = getAbnormalTradeDetailPreview(alertId);
  if (!trade) return <PlaceholderSection description="이상 거래 내역을 찾을 수 없습니다." />;

  const status = processedStatus ?? trade.status;

  const handleConfirmAction = ({ action, reason }: AbnormalTradeActionForm) => {
    if (action === 'NO_ISSUE') {
      setNoIssueReason(reason.trim());
      return;
    }
    if (action === 'PAUSE_PRODUCT') {
      // 거래 중지 화면에서 확정·취소 후 이 상세로 돌아옵니다.
      const state: ProductTradingLocationState = { reason, returnTo: location.pathname };
      void navigate(getProductTradingPath(trade.productId), { state });
      return;
    }
    // TODO(MOTU-28): 회원 상태 변경 화면(ADM-MBR-02-01)으로 대상 회원과 사유를 넘깁니다.
    void navigate(ROUTES.MEMBERS, { state: { memberId: trade.memberId, reason } });
  };
  // TODO(MOTU-25-1): 이상 없음 처리 API 연동 (처리완료로 변경, 관리자 활동 이력 기록)
  const handleConfirmNoIssue = () => {
    setNoIssueReason(null);
    setProcessedStatus('DONE');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-title-lg font-bold text-motu-text-primary">{trade.alertId}</h2>
        <AbnormalTradeStatusBadge status={status} />
      </div>

      <div className="flex items-stretch gap-5">
        <InfoCard
          title="탐지 정보"
          className="flex-1"
          items={[
            { label: '탐지 유형', value: ABNORMAL_TRADE_TYPE_LABELS[trade.type] },
            { label: '발생일시', value: formatDateTimeText(trade.detectedAt) },
            { label: '상품', value: `${trade.productName} / ${trade.productId}` },
            { label: '회원', value: `${trade.memberLoginId} / ${trade.memberId}` },
            { label: '주문 ID', value: trade.orderId },
            { label: '체결 ID', value: trade.tradeId },
          ]}
        />
        <InfoCard title="탐지 근거" tone="danger" className="flex-1" items={trade.evidences} />
      </div>

      {status === 'DONE' ? (
        <Notice tone="success">
          처리완료된 이상 거래입니다. 처리 기록은 관리자 활동 이력에서 확인합니다.
        </Notice>
      ) : (
        <form noValidate onSubmit={handleSubmit(handleConfirmAction)}>
          <InfoCard title="관리자 조치" className="gap-4">
            <div className="flex items-start gap-3">
              <Field
                label="조치 유형"
                htmlFor="action"
                errorMessage={errors.action?.message}
                className="w-[320px] shrink-0"
              >
                <Controller
                  control={control}
                  name="action"
                  render={({ field }) => (
                    <Select
                      id="action"
                      options={ABNORMAL_TRADE_ACTION_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <Field
                label="조치 사유 *"
                htmlFor="actionReason"
                errorMessage={errors.reason?.message}
                className="flex-1"
              >
                <TextArea
                  id="actionReason"
                  hasError={Boolean(errors.reason)}
                  {...register('reason')}
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit">조치 내용 확인</Button>
            </div>
          </InfoCard>
        </form>
      )}

      <NoIssueConfirmModal
        trade={trade}
        reason={noIssueReason}
        onClose={() => setNoIssueReason(null)}
        onConfirm={handleConfirmNoIssue}
      />
    </div>
  );
}
