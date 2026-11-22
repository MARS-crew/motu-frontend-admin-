import { z } from 'zod';

// ADM-ACC-02 관리자 계정 생성 (담당 업무는 참고값으로 선택 입력, 길이 규칙은 서버와 같습니다)
export const adminCreateSchema = z.object({
  loginId: z
    .string()
    .trim()
    .min(1, '관리자 아이디를 입력해 주세요.')
    .regex(/^[a-z0-9]{5,20}$/, '영문 소문자·숫자 5~20자로 입력해 주세요.'),
  name: z
    .string()
    .trim()
    .min(1, '관리자명을 입력해 주세요.')
    .max(20, '관리자명은 20자까지 입력할 수 있습니다.'),
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해 주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
  duty: z.string().trim().max(50, '담당 업무는 50자까지 입력할 수 있습니다.'),
});

export type AdminCreateForm = z.infer<typeof adminCreateSchema>;

// ADM-ACC-02 관리자 계정 상태 변경 (사유 필수)
export const adminStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  reason: z
    .string()
    .trim()
    .min(1, '변경 사유를 입력해 주세요.')
    .max(200, '변경 사유는 200자까지 입력할 수 있습니다.'),
});

export type AdminStatusForm = z.infer<typeof adminStatusSchema>;
