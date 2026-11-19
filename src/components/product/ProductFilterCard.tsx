import type { FormEvent } from 'react';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import { TextInput } from '@/components/common/TextInput';
import {
  PRODUCT_EXPOSURE_FILTER_OPTIONS,
  PRODUCT_TRADE_STATUS_FILTER_OPTIONS,
} from '@/constants/product';
import { useSectorsQuery } from '@/queries/useSectorsQuery';
import type { ProductFilters } from '@/types/product';
import { toSectorFilterOptions } from '@/utils/sector';

type ProductSearchFilters = Omit<ProductFilters, 'page'>;

type ProductFilterCardProps = {
  filters: ProductSearchFilters;
  onSearch: (filters: ProductSearchFilters) => void;
};

// ADM-PRD-01 검색 조건 (상품명·상품 ID, 상품 상태, 카테고리, 노출 상태)
export function ProductFilterCard({ filters, onSearch }: ProductFilterCardProps) {
  const [draft, setDraft] = useState(filters);
  const { data: sectors } = useSectorsQuery();

  const updateDraft = (next: Partial<ProductSearchFilters>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <Field label="상품 검색" htmlFor="filter-keyword" className="flex-1">
        <TextInput
          id="filter-keyword"
          placeholder="상품명·상품 ID"
          value={draft.keyword}
          onChange={(event) => updateDraft({ keyword: event.target.value })}
        />
      </Field>
      <Field label="상품 상태" htmlFor="filter-trade-status" className="flex-1">
        <Select
          id="filter-trade-status"
          options={PRODUCT_TRADE_STATUS_FILTER_OPTIONS}
          value={draft.tradeStatus}
          onChange={(tradeStatus) => updateDraft({ tradeStatus })}
        />
      </Field>
      <Field label="카테고리" htmlFor="filter-category" className="flex-1">
        <Select
          id="filter-category"
          options={toSectorFilterOptions(sectors)}
          value={draft.sectorCode}
          onChange={(sectorCode) => updateDraft({ sectorCode })}
        />
      </Field>
      <Field label="노출 상태" htmlFor="filter-exposure" className="flex-1">
        <Select
          id="filter-exposure"
          options={PRODUCT_EXPOSURE_FILTER_OPTIONS}
          value={draft.exposure}
          onChange={(exposure) => updateDraft({ exposure })}
        />
      </Field>
      <Button type="submit">검색</Button>
    </form>
  );
}
