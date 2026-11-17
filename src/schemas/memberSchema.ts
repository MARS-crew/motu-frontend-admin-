import { z } from 'zod';

import type { MemberStatus } from '@/types/member';

const REASON_MAX_LENGTH = 200;

const reasonSchema = z
  .string()
  .trim()
  .min(1, '사유 입력은 필수입니다.')
  .max(REASON_MAX_LENGTH, `사유는 ${REASON_MAX_LENGTH}자까지 입력할 수 있습니다.`);

// 1,000 → 1000 (숫자가 아니면 NaN)
export const toPointNumber = (value: string) =>
  value.trim() ? Number(value.replaceAll(',', '')) : Number.NaN;

const isPositiveInteger = (value: string) => {
  const amount = toPointNumber(value);
  return Number.isInteger(amount) && amount > 0;
};

// ADM-MBR-02-01 회원 상태 변경 (현재 상태와 같은 상태로는 바꿀 수 없음)
export const createMemberStatusSchema = (currentStatus: MemberStatus) =>
  z.object({
    status: z
      .enum(['ACTIVE', 'LOCKED', 'SUSPENDED'])
      .refine((status) => status !== currentStatus, '변경하려는 상태와 현재 상태가 같습니다.'),
    reason: reasonSchema,
  });

export type MemberStatusForm = z.infer<ReturnType<typeof createMemberStatusSchema>>;

// ADM-MBR-02-02 계정 잠금 해제
export const memberUnlockSchema = z.object({
  reason: reasonSchema,
});

export type MemberUnlockForm = z.infer<typeof memberUnlockSchema>;

// ADM-MBR-02-03 포인트 지급·회수 (회수는 사용 가능 포인트를 넘을 수 없음)
export const createMemberPointsSchema = (availablePoints: number) =>
  z
    .object({
      type: z.enum(['GRANT', 'REVOKE']),
      amount: z
        .string()
        .trim()
        .min(1, '처리 포인트 입력은 필수입니다.')
        .refine(isPositiveInteger, '처리 포인트는 0P보다 큰 숫자로 입력해 주세요.'),
      reason: reasonSchema,
    })
    .refine((form) => form.type === 'GRANT' || toPointNumber(form.amount) <= availablePoints, {
      message: '회수 포인트는 사용 가능 포인트를 초과할 수 없습니다.',
      path: ['amount'],
    });

export type MemberPointsForm = z.infer<ReturnType<typeof createMemberPointsSchema>>;

// ADM-MBR-03 초기 지급 포인트 설정
export const initialPointsSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, '변경 금액 입력은 필수입니다.')
    .refine(isPositiveInteger, '변경 금액은 0P보다 큰 숫자로 입력해 주세요.'),
  reason: reasonSchema,
});

export type InitialPointsForm = z.infer<typeof initialPointsSchema>;
