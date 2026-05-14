import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // any 타입 사용 금지
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: '컴포넌트에서 axios를 직접 import하지 마세요. src/api/axiosInstance를 사용하세요.',
            },
          ],
          patterns: [
            {
              group: ['axios/lib/*'],
              message: 'axios 내부 모듈을 직접 import하지 마세요.',
            },
          ],
        },
      ],
      // Redux import 금지
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message: '컴포넌트에서 axios를 직접 import하지 마세요. src/api/axiosInstance를 사용하세요.',
            },
            {
              name: 'redux',
              message: 'Redux 사용 금지. 서버 상태는 React Query, 클라이언트 상태는 Zustand를 사용하세요.',
            },
            {
              name: 'react-redux',
              message: 'Redux 사용 금지. 서버 상태는 React Query, 클라이언트 상태는 Zustand를 사용하세요.',
            },
            {
              name: '@reduxjs/toolkit',
              message: 'Redux 사용 금지. 서버 상태는 React Query, 클라이언트 상태는 Zustand를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
])
