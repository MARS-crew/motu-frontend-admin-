import { z } from 'zod';

// ADM-LST-03 심사 결과 처리
// - 승인: 최종 상장가·총 발행량·상장일·거래 시작일시 + 처리 사유(상장가 조정 사유) 필수
// - 보완 요청: 보완 항목·요청 내용·보완 기한(KST, 현재 이후) 필수
// - 반려: 처리 사유 필수
export const listingReviewSchema = z
  .object({
    result: z.enum(['approve', 'revision', 'reject']),
    finalPrice: z.string(),
    totalSupply: z.string(),
    // YYYY-MM-DD
    listingDate: z.string(),
    // YYYY-MM-DDTHH:mm
    tradeStartAt: z.string(),
    reason: z.string(),
    revisionItem: z.string(),
    revisionRequest: z.string(),
    // YYYY-MM-DDTHH:mm (KST)
    revisionDeadline: z.string(),
  })
  .superRefine((form, context) => {
    const require = (path: keyof typeof form, message: string) => {
      if (!form[path].trim()) context.addIssue({ code: 'custom', path: [path], message });
    };
    const requirePositiveNumber = (path: 'finalPrice' | 'totalSupply', label: string) => {
      const value = Number(form[path].replaceAll(',', ''));
      if (!form[path].trim()) {
        context.addIssue({ code: 'custom', path: [path], message: `${label}을 입력해 주세요.` });
      } else if (!Number.isInteger(value) || value <= 0) {
        context.addIssue({
          code: 'custom',
          path: [path],
          message: `${label}은 1 이상 숫자로 입력해 주세요.`,
        });
      }
    };

    if (form.result === 'approve') {
      requirePositiveNumber('finalPrice', '최종 상장가');
      requirePositiveNumber('totalSupply', '총 발행량');
      require('listingDate', '상장일을 선택해 주세요.');
      require('tradeStartAt', '거래 시작일시를 선택해 주세요.');
      if (form.tradeStartAt && new Date(form.tradeStartAt) <= new Date()) {
        context.addIssue({
          code: 'custom',
          path: ['tradeStartAt'],
          message: '거래 시작일시는 현재 이후로 선택해 주세요.',
        });
      }
      if (
        form.listingDate &&
        form.tradeStartAt &&
        form.tradeStartAt.slice(0, 10) < form.listingDate
      ) {
        context.addIssue({
          code: 'custom',
          path: ['tradeStartAt'],
          message: '거래 시작일시는 상장일 이후로 선택해 주세요.',
        });
      }
      require('reason', '처리 사유를 입력해 주세요.');
    }
    if (form.result === 'revision') {
      require('revisionItem', '보완 항목을 선택해 주세요.');
      require('revisionRequest', '요청 내용을 입력해 주세요.');
      require('revisionDeadline', '보완 기한을 선택해 주세요.');
      if (form.revisionDeadline && new Date(form.revisionDeadline) <= new Date()) {
        context.addIssue({
          code: 'custom',
          path: ['revisionDeadline'],
          message: '보완 기한은 현재 이후로 선택해 주세요.',
        });
      }
    }
    if (form.result === 'reject') {
      require('reason', '처리 사유를 입력해 주세요.');
    }
  });

export type ListingReviewForm = z.infer<typeof listingReviewSchema>;

// ADM-LST-02 보완 기한 연장 (새 기한은 현재 시각과 기존 기한보다 늦어야 하고, 사유 필수)
export const createRevisionExtendSchema = (currentDeadline: string) =>
  z
    .object({
      // YYYY-MM-DDTHH:mm (KST)
      deadline: z.string().min(1, '새 보완 기한을 선택해 주세요.'),
      reason: z
        .string()
        .trim()
        .min(1, '연장 사유를 입력해 주세요.')
        .max(200, '연장 사유는 200자까지 입력할 수 있습니다.'),
    })
    .refine(
      (form) =>
        !form.deadline || (new Date(form.deadline) > new Date() && form.deadline > currentDeadline),
      { message: '새 기한은 현재 시각과 기존 기한보다 늦게 선택해 주세요.', path: ['deadline'] },
    );

export type RevisionExtendForm = z.infer<ReturnType<typeof createRevisionExtendSchema>>;
