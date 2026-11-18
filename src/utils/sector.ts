import type { SelectOption } from '@/components/common/Select';
import type { Sector } from '@/types/sector';

// 카테고리 검색 드롭다운 옵션 (Select 는 문자열 값을 쓰므로 코드를 문자열로 바꿉니다)
export const toSectorFilterOptions = (sectors: Sector[] = []): SelectOption[] => [
  { value: 'ALL', label: '전체' },
  ...sectors.map((sector) => ({ value: String(sector.sectorCode), label: sector.sectorName })),
];
