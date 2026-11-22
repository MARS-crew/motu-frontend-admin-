import { z } from 'zod';

// ADM-INQ-01 이메일 답변 (비밀번호·인증번호는 답변에 넣지 않습니다)
export const inquiryAnswerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, '이메일 답변을 입력해 주세요.')
    .max(5000, '이메일 답변은 5,000자까지 입력할 수 있습니다.'),
});

export type InquiryAnswerForm = z.infer<typeof inquiryAnswerSchema>;
