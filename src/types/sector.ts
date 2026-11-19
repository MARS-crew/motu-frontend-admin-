// 상품 카테고리 (GET /sectors). 상장 신청·상품 검색에는 sectorCode 를 보냅니다.
export type Sector = {
  sectorCode: number;
  sectorName: string;
};
