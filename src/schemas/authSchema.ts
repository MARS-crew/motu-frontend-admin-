import { z } from 'zod';

export const loginSchema = z.object({
  loginId: z.string().trim().min(1, '관리자 아이디를 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export type LoginForm = z.infer<typeof loginSchema>;

// 비밀번호 조건: 8~20자, 영문·숫자·특수문자 각 1자 이상 (화면설계서 ADM-AUTH-01-01, ADM-AUTH-02-01)
const passwordRule = z
  .string()
  .min(8, '비밀번호는 8~20자로 입력해 주세요.')
  .max(20, '비밀번호는 8~20자로 입력해 주세요.')
  .regex(/[A-Za-z]/, '영문을 1자 이상 포함해 주세요.')
  .regex(/\d/, '숫자를 1자 이상 포함해 주세요.')
  .regex(/[^A-Za-z\d\s]/, '특수문자를 1자 이상 포함해 주세요.');

// 비밀번호 입력 아래에 항상 보여주는 안내 문구
export const PASSWORD_RULE_TEXT = '비밀번호 조건: 8~20자, 영문·숫자·특수문자 각 1개 이상';

export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.';

export const newPasswordSchema = z
  .object({
    newPassword: passwordRule,
    newPasswordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((form) => form.newPassword === form.newPasswordConfirm, {
    message: PASSWORD_MISMATCH_MESSAGE,
    path: ['newPasswordConfirm'],
  });

export type NewPasswordForm = z.infer<typeof newPasswordSchema>;

// 최초 로그인 시 임시 비밀번호 → 새 비밀번호 변경
export const initialPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 임시 비밀번호를 입력해 주세요.'),
    newPassword: passwordRule,
    newPasswordConfirm: z.string().min(1, '새 비밀번호 확인을 입력해 주세요.'),
  })
  .refine((form) => form.newPassword === form.newPasswordConfirm, {
    message: PASSWORD_MISMATCH_MESSAGE,
    path: ['newPasswordConfirm'],
  });

export type InitialPasswordForm = z.infer<typeof initialPasswordSchema>;

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '등록 이메일을 입력해 주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
});

export type PasswordResetRequestForm = z.infer<typeof passwordResetRequestSchema>;
