import { z } from 'zod';

const toNumber = (value: string) => Number(value.replaceAll(',', ''));

const optionalNumberText = (label: string) =>
  z
    .string()
    .refine(
      (value) => !value.trim() || (Number.isInteger(toNumber(value)) && toNumber(value) >= 0),
      `${label}은 0 이상 숫자로 입력해 주세요.`,
    );

// ADM-PRD-03 상장 상품 정보 수정
// 상품명·카테고리·노출 상태·수정 사유는 필수, MAU·거래액을 입력하면 지표 기준일이 필요합니다.
export const productEditSchema = z
  .object({
    productName: z.string().trim().min(1, '상품명을 입력해 주세요.'),
    category: z.string().min(1, '카테고리를 선택해 주세요.'),
    exposure: z.string().min(1, '노출 상태를 선택해 주세요.'),
    intro: z.string(),
    officialUrl: z
      .string()
      .trim()
      .refine((value) => !value || URL.canParse(value), 'URL 형식이 올바르지 않습니다.'),
    imageFileName: z.string(),
    mau: optionalNumberText('MAU'),
    transactionAmount: optionalNumberText('거래액'),
    // YYYY-MM-DD
    metricsBaseDate: z.string(),
    reason: z.string().trim().min(1, '수정 사유를 입력해 주세요.'),
  })
  .refine(
    (form) => !(form.mau.trim() || form.transactionAmount.trim()) || Boolean(form.metricsBaseDate),
    { message: 'MAU나 거래액을 입력하면 지표 기준일을 선택해 주세요.', path: ['metricsBaseDate'] },
  );

export type ProductEditForm = z.infer<typeof productEditSchema>;

// ADM-PRD-04 거래 중지 (사용자 안내문은 선택)
export const productPauseSchema = z.object({
  reason: z.string().trim().min(1, '중지 사유를 입력해 주세요.'),
  userNotice: z.string(),
});

export type ProductPauseForm = z.infer<typeof productPauseSchema>;

// ADM-PRD-04 거래 재개
export const productResumeSchema = z.object({
  reason: z.string().trim().min(1, '재개 사유를 입력해 주세요.'),
});

export type ProductResumeForm = z.infer<typeof productResumeSchema>;

// ADM-PRD-05 상품 종료 (사유·안내문 필수, 최종 확인 체크 후 종료)
export const productCloseSchema = z.object({
  reason: z.string().trim().min(1, '종료 사유를 입력해 주세요.'),
  userNotice: z.string().trim().min(1, '사용자 안내문을 입력해 주세요.'),
  isConfirmed: z.boolean().refine(Boolean, '종료 후 다시 거래할 수 없음을 확인해 주세요.'),
});

export type ProductCloseForm = z.infer<typeof productCloseSchema>;
