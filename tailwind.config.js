/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // 공통 색상은 여기에 등록합니다. (motu-frontend 앱과 같은 토큰 이름을 사용합니다)
      colors: {
        'motu-black': '#2E3138',
        'motu-text-primary': '#191F28',
        'motu-text-secondary': '#4E5968',
        'motu-text-tertiary': '#8B95A1',
        'motu-bg': '#F2F4F6',
        'motu-bg-secondary': '#EDEFF2',
        'motu-tonal': '#D9DDE3',
        'motu-border': '#E5E8EB',
        'motu-disabled': '#B0B8C1',
        'motu-red': '#F04452',
        'motu-red-light': '#FDECEE',
        'motu-btn-red': '#E5484D',
        'motu-blue': '#2175F3',
        'motu-grey': '#8B8E96',
        'motu-grey-light': '#BEBFC1',
        'motu-grey-lighter': '#EAEAEB',
        'motu-grey-chip': '#E8ECF0',
        'motu-green': '#0E9F6E',
        'motu-success': '#1A7F5A',
        'motu-success-light': '#E6F4EE',
      },
      // Figma 관리자 디자인의 텍스트 스타일입니다. [크기, 행간]
      fontSize: {
        'display-lg': ['24px', '32px'],
        'title-lg': ['18px', '24px'],
        'title-md': ['16px', '22px'],
        'title-sm': ['15px', '20px'],
        'body-md': ['14px', '20px'],
        'body-sm': ['13px', '18px'],
        'label-md': ['12px', '16px'],
        'label-sm': ['11px', '14px'],
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      spacing: {
        sidebar: '240px',
        header: '64px',
      },
      boxShadow: {
        // 달력 팝오버 등 화면 위에 뜨는 패널
        popover: '0px 8px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
