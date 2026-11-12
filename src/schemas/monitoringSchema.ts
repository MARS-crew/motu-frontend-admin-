import { z } from 'zod';

// ADM-MON-02 관리자 조치 (조치 유형 선택 + 조치 사유 필수)
export const abnormalTradeActionSchema = z.object({
  action: z.enum(['PAUSE_PRODUCT', 'SUSPEND_MEMBER', 'NO_ISSUE'], '조치 유형을 선택해 주세요.'),
  reason: z.string().trim().min(1, '조치 사유를 입력해 주세요.'),
});

export type AbnormalTradeActionForm = z.infer<typeof abnormalTradeActionSchema>;
