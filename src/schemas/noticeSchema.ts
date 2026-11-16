import { z } from 'zod';

// ADM-NTC-02 공지 작성 및 수정
// 상품별 공지는 대상 상품이 필요하고, 게시 종료일시는 시작일시 이후여야 합니다.
export const noticeFormSchema = z
  .object({
    type: z.enum(['SERVICE', 'PRODUCT']),
    productId: z.string(),
    isImportant: z.boolean(),
    title: z.string().trim().min(1, '공지 제목을 입력해 주세요.'),
    content: z.string().trim().min(1, '공지 내용을 입력해 주세요.'),
    // YYYY-MM-DDTHH:mm
    startAt: z.string().min(1, '게시 시작일시를 선택해 주세요.'),
    endAt: z.string().min(1, '게시 종료일시를 선택해 주세요.'),
  })
  .refine((form) => form.type === 'SERVICE' || Boolean(form.productId), {
    message: '대상 상품을 선택해 주세요.',
    path: ['productId'],
  })
  .refine((form) => !form.startAt || !form.endAt || form.startAt < form.endAt, {
    message: '게시 종료일시는 시작일시 이후로 선택해 주세요.',
    path: ['endAt'],
  });

export type NoticeForm = z.infer<typeof noticeFormSchema>;

// ADM-NTC-04 공지 비공개·삭제 (처리 사유 필수)
export const noticeHideSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, '처리 사유를 입력해 주세요.')
    .max(200, '처리 사유는 200자까지 입력할 수 있습니다.'),
});

export type NoticeHideForm = z.infer<typeof noticeHideSchema>;
