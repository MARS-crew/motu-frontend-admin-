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
import {
  ABNORMAL_TRADE_ACTION_OPTIONS,
  ABNORMAL_TRADE_TYPE_LABELS,
  ANOMALY_ACTION_LABELS,
} from '@/constants/monitoring';
import { getMemberStatusPath, getProductTradingPath } from '@/constants/routes';
import type { AbnormalTradeActionForm } from '@/schemas/monitoringSchema';
import { abnormalTradeActionSchema } from '@/schemas/monitoringSchema';
import type { MemberStatusLocationState } from '@/types/member';
import type { ProductTradingLocationState } from '@/types/product';
import { useAnomalyDetailQuery } from '@/queries/useAnomaliesQuery';
import { useDismissAnomalyMutation, useReviewAnomalyMutation } from '@/queries/useAnomalyMutations';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTimeText } from '@/utils/date';

// ADM-MON-02 이상 거래 상세 (탐지 근거 확인과 관리자 조치)
// 상품 거래 중지·회원 정지는 해당 화면으로 대상과 사유를 넘겨 그 화면에서 최종 확정합니다.
export default function MonitoringDetailPage() {
  const { alertId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [noIssueReason, setNoIssueReason] = useState<string | null>(null);
  const anomalyId = Number(alertId);
  const review = useReviewAnomalyMutation(anomalyId);
  const dismiss = useDismissAnomalyMutation(anomalyId);
  const actionError = review.error ?? dismiss.error;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AbnormalTradeActionForm>({
    resolver: zodResolver(abnormalTradeActionSchema),
    defaultValues: { action: 'PAUSE_PRODUCT', reason: '' },
  });

  const { data: trade, isPending, isError, error } = useAnomalyDetailQuery(anomalyId);
  if (isError) return <PlaceholderSection description={getApiErrorMessage(error)} />;
  if (isPending) {
    return (
      <PlaceholderSection
        description={
          Number(alertId) > 0
            ? '이상 거래를 불러오는 중입니다.'
            : '이상 거래 내역을 찾을 수 없습니다.'
        }
      />
    );
  }

  const { status } = trade;
  // 상품과 관계없는 이상 거래는 거래 중지를 고를 수 없습니다.
  const actionOptions = trade.productId
    ? ABNORMAL_TRADE_ACTION_OPTIONS
    : ABNORMAL_TRADE_ACTION_OPTIONS.filter((option) => option.value !== 'PAUSE_PRODUCT');

  // 거래 중지·회원 정지는 '확인중'으로 바꾼 뒤 해당 화면으로 넘어가 그 화면에서 확정합니다.
  // 확정하면 이 이상 거래도 처리완료로 바뀌고, 취소하면 확인중으로 남습니다.
  const handleConfirmAction = ({ action, reason }: AbnormalTradeActionForm) => {
    dismiss.reset();
    if (action === 'NO_ISSUE') {
      setNoIssueReason(reason.trim());
      return;
    }
    if (action === 'PAUSE_PRODUCT') {
      const { productId } = trade;
      if (!productId) return;
      const state: ProductTradingLocationState = {
        reason,
        returnTo: location.pathname,
        anomalyId,
      };
      review.mutate('STOCK_PAUSE', {
        onSuccess: () => void navigate(getProductTradingPath(productId), { state }),
      });
      return;
    }
    const state: MemberStatusLocationState = {
      status: 'BLOCKED',
      reason,
      returnTo: location.pathname,
      anomalyId,
    };
    review.mutate('USER_BLOCK', {
      onSuccess: () => void navigate(getMemberStatusPath(trade.memberId), { state }),
    });
  };
  // 이상 없음은 이 화면에서 바로 처리완료로 바꾸고 관리자 활동 이력에 기록합니다.
  const handleConfirmNoIssue = () => {
    if (!noIssueReason) return;
    dismiss.mutate(noIssueReason, { onSettled: () => setNoIssueReason(null) });
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
            {
              label: '상품',
              value: trade.productCode ? `${trade.productName ?? '-'} / ${trade.productCode}` : '-',
            },
            { label: '회원', value: `${trade.memberLoginId} / ${trade.memberCode}` },
            { label: '주문 ID', value: trade.orderId ?? '-' },
            { label: '체결 ID', value: trade.tradeId ?? '-' },
          ]}
        />
        <InfoCard title="탐지 근거" tone="danger" className="flex-1" items={trade.evidences} />
      </div>

      {status === 'RESOLVED' ? (
        <InfoCard
          title="처리 결과"
          items={[
            { label: '조치', value: trade.action ? ANOMALY_ACTION_LABELS[trade.action] : '-' },
            { label: '조치 사유', value: trade.actionReason ?? '-' },
            {
              label: '처리',
              value: trade.handledAt
                ? `${formatDateTimeText(trade.handledAt)} · ${trade.handlerLoginId ?? '-'}`
                : '-',
            },
          ]}
        />
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
                      options={actionOptions}
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
            {status === 'REVIEWING' && trade.action && (
              <Notice>
                {ANOMALY_ACTION_LABELS[trade.action]} 화면으로 넘어간 뒤 아직 확정되지 않았습니다. (
                {trade.handlerLoginId ?? '-'}
                {trade.handledAt ? ` · ${formatDateTimeText(trade.handledAt)}` : ''})
              </Notice>
            )}
            {actionError && <Notice tone="danger">{getApiErrorMessage(actionError)}</Notice>}
            <div className="flex justify-end">
              <Button type="submit" disabled={review.isPending || dismiss.isPending}>
                조치 내용 확인
              </Button>
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
