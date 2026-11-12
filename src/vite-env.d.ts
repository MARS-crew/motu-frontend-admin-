/// <reference types="vite/client" />

// vite/client 의 ImportMetaEnv 를 확장해야 하므로 interface 로 선언합니다.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}
