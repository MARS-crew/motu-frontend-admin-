import type { Inquiry } from '@/types/inquiry';

// TODO(MOTU-30-1): 계정·인증 문의 관리 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 17 · 계정·인증 문의 관리, 최신순)
export const INQUIRIES_PREVIEW: Inquiry[] = [
  {
    inquiryCode: 'INQ-018',
    type: 'LOGIN_FAILED_LOCKED',
    status: 'SUBMITTED',
    replyEmail: 'name@example.com',
    content: '계정 잠금 해제를 문의합니다.',
    createdAt: '2026-11-08T11:10',
    handlerLoginId: null,
    answer: null,
    answeredAt: null,
  },
  {
    inquiryCode: 'INQ-017',
    type: 'PHONE_UNAVAILABLE',
    status: 'IN_PROGRESS',
    replyEmail: 'traveler@example.com',
    content: '등록한 휴대폰 번호를 더 이상 사용하지 않아 인증을 받을 수 없습니다.',
    createdAt: '2026-11-08T10:25',
    handlerLoginId: 'admin01',
    answer: null,
    answeredAt: null,
  },
  {
    inquiryCode: 'INQ-016',
    type: 'SUSPENDED',
    status: 'SUBMITTED',
    replyEmail: 'tester@example.com',
    content: '계정이 정지된 사유를 알고 싶습니다.',
    createdAt: '2026-11-07T16:40',
    handlerLoginId: null,
    answer: null,
    answeredAt: null,
  },
  {
    inquiryCode: 'INQ-015',
    type: 'LOGIN_FAILED_LOCKED',
    status: 'APPROVED',
    replyEmail: 'motu@example.com',
    content: '비밀번호를 여러 번 틀려 로그인이 안 됩니다.',
    createdAt: '2026-11-06T09:05',
    handlerLoginId: 'admin02',
    answer: '본인 확인 후 계정 잠금을 해제했습니다. 비밀번호 재설정 후 로그인해 주세요.',
    answeredAt: '2026-11-06T13:20',
  },
];
