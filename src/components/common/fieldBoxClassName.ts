// 입력 박스(TextInput, Select, DateField, TextArea) 공통 스타일입니다.
export const FIELD_BOX_CLASS_NAME =
  'w-full rounded-xl border border-motu-border bg-white px-3.5 text-body-md font-medium text-motu-text-primary outline-none placeholder:text-motu-text-tertiary focus:border-motu-black disabled:border-transparent disabled:bg-motu-border disabled:text-motu-text-secondary';

// 읽기 전용 상태는 회색 배경(surface/disabled)으로 표시합니다.
// CSS :read-only 는 div·button 에도 걸리므로 input·textarea 에만 붙입니다.
export const FIELD_BOX_READ_ONLY_CLASS_NAME =
  'read-only:border-transparent read-only:bg-motu-border read-only:text-motu-text-secondary';

export const FIELD_BOX_ERROR_CLASS_NAME = 'border-motu-btn-red focus:border-motu-btn-red';
