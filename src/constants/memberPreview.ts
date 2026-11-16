import type { MemberDetail, MemberSummary } from '@/types/member';

// TODO(MOTU-27-1): 회원 관리 API 연동 후 제거합니다.
// 퍼블리싱 확인용 예시 데이터입니다. (Figma 23 · 관리자 회원 관리)
// 회원 ID는 거래 모니터링 예시 데이터(USR-xxxx)와 맞춰 두었습니다.
// 가입일이 최신인 회원이 위에 오도록 정렬되어 있습니다.
export const MEMBERS_PREVIEW: MemberSummary[] = [
  {
    memberId: 'USR-1024',
    loginId: 'sunjung01',
    nickname: '선정',
    maskedEmail: 'sun***@mail.com',
    joinedAt: '2026-09-01',
    status: 'ACTIVE',
    lastLoginAt: '2026-09-06T20:14',
  },
  {
    memberId: 'USR-0441',
    loginId: 'pliuser2',
    nickname: '여행자',
    maskedEmail: 'tra***@mail.com',
    joinedAt: '2026-08-22',
    status: 'LOCKED',
    lastLoginAt: '2026-09-05T18:30',
  },
  {
    memberId: 'USR-0335',
    loginId: 'tester03',
    nickname: '테스터',
    maskedEmail: 'tes***@mail.com',
    joinedAt: '2026-08-10',
    status: 'SUSPENDED',
    lastLoginAt: '2026-09-03T09:12',
  },
  {
    memberId: 'USR-0902',
    loginId: 'user004',
    nickname: '모투왕',
    maskedEmail: 'inv***@mail.com',
    joinedAt: '2026-07-28',
    status: 'ACTIVE',
    lastLoginAt: '2026-09-06T19:01',
  },
  {
    memberId: 'USR-0117',
    loginId: 'minhyuk01',
    nickname: '민혁',
    maskedEmail: 'min***@mail.com',
    joinedAt: '2026-07-20',
    status: 'ACTIVE',
    lastLoginAt: '2026-09-06T08:45',
  },
  ...[
    ['USR-0098', 'hana77', '하나', 'han', '2026-07-15', 'ACTIVE', '2026-09-05T22:10'],
    ['USR-0087', 'stockkid', '주린이', 'sto', '2026-07-09', 'ACTIVE', '2026-09-04T12:40'],
    ['USR-0076', 'jiyoon', '지윤', 'jiy', '2026-07-02', 'LOCKED', '2026-08-30T17:05'],
    ['USR-0065', 'motufan', '모투팬', 'mot', '2026-06-25', 'ACTIVE', '2026-09-06T10:22'],
    ['USR-0054', 'daily_inv', '데일리', 'dai', '2026-06-18', 'ACTIVE', '2026-09-02T14:18'],
    ['USR-0043', 'bluechip', '블루칩', 'blu', '2026-06-11', 'SUSPENDED', '2026-08-21T11:30'],
    ['USR-0032', 'seoyeon', '서연', 'seo', '2026-06-04', 'ACTIVE', '2026-09-01T09:55'],
    ['USR-0021', 'longterm', '장투', 'lon', '2026-05-28', 'ACTIVE', '2026-08-29T21:47'],
  ].map(
    ([memberId, loginId, nickname, emailPrefix, joinedAt, status, lastLoginAt]): MemberSummary => ({
      memberId,
      loginId,
      nickname,
      maskedEmail: `${emailPrefix}***@mail.com`,
      joinedAt,
      status: status as MemberSummary['status'],
      lastLoginAt,
    }),
  ),
];

const DETAIL_PREVIEW: Omit<MemberDetail, keyof MemberSummary | 'lockReason'> = {
  isEmailVerified: true,
  isTwoFactorEnabled: true,
  maskedPhone: '010-****-1234',
  lastTwoFactorAt: '2026-09-06T19:42',
  availablePoints: 2345678,
  reservedPoints: 93093,
  holdingProductCount: 3,
  openOrderCount: 2,
  recentHistory: {
    processedAt: '2026-09-05T10:20',
    actionType: '잠금 해제',
    adminId: 'admin01',
    reason: '본인 확인 완료',
  },
};

export const getMemberDetailPreview = (memberId: string): MemberDetail | null => {
  const summary = MEMBERS_PREVIEW.find((member) => member.memberId === memberId);
  if (!summary) return null;
  return {
    ...summary,
    ...DETAIL_PREVIEW,
    lockReason: summary.status === 'LOCKED' ? '로그인 5회 누적 실패' : null,
  };
};
