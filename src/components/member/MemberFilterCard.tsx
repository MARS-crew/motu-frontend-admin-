import type { FormEvent } from 'react';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { Field } from '@/components/common/Field';
import { Select } from '@/components/common/Select';
import { TextInput } from '@/components/common/TextInput';
import { MEMBER_STATUS_FILTER_OPTIONS } from '@/constants/member';
import type { MemberFilters } from '@/types/member';

type MemberSearch = Omit<MemberFilters, 'page'>;

type MemberFilterCardProps = {
  filters: MemberSearch;
  onSearch: (filters: MemberSearch) => void;
};

// ADM-MBR-01 검색 조건 (아이디·닉네임·회원 상태, [검색]을 눌렀을 때 반영)
export function MemberFilterCard({ filters, onSearch }: MemberFilterCardProps) {
  const [draft, setDraft] = useState(filters);

  const updateDraft = (next: Partial<MemberSearch>) => setDraft((prev) => ({ ...prev, ...next }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-[14px] border border-motu-border bg-white px-6 py-5"
    >
      <Field label="아이디" htmlFor="filter-login-id" className="flex-1">
        <TextInput
          id="filter-login-id"
          placeholder="회원 아이디를 입력하세요."
          value={draft.loginId}
          onChange={(event) => updateDraft({ loginId: event.target.value })}
        />
      </Field>
      <Field label="닉네임" htmlFor="filter-nickname" className="flex-1">
        <TextInput
          id="filter-nickname"
          placeholder="회원 닉네임을 입력하세요."
          value={draft.nickname}
          onChange={(event) => updateDraft({ nickname: event.target.value })}
        />
      </Field>
      <Field label="회원 상태" htmlFor="filter-status" className="flex-1">
        <Select
          id="filter-status"
          options={MEMBER_STATUS_FILTER_OPTIONS}
          value={draft.status}
          onChange={(status) => updateDraft({ status })}
        />
      </Field>
      <Button type="submit">검색</Button>
    </form>
  );
}
