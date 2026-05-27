import type { ServerHealthData } from '@/types/serverHealth';

/**
 * 서버 상태 확인 목 데이터 — 정상 상태
 */
export const MOCK_SERVER_HEALTH: ServerHealthData = {
  servers: {
    applications: [
      {
        name: 'user_back',
        status: 'UP',
        responseMs: 120,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
      {
        name: 'admin_back',
        status: 'UP',
        responseMs: 80,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
    ],
    infrastructure: [
      {
        name: 'mysql',
        status: 'UP',
        responseMs: 45,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
      {
        name: 'redis',
        status: 'UP',
        responseMs: 8,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
    ],
  },
  dbConnectionPool: [
    {
      name: 'Spring Boot',
      used: 10,
      total: 24,
    },
  ],
  summary: {
    totalCount: 4,
    normalCount: 4,
    slowCount: 0,
    averageResponseMs: 63,
  },
};

/**
 * 서버 상태 확인 목 데이터 — 일부 지연 상태
 */
export const MOCK_SERVER_HEALTH_SLOW: ServerHealthData = {
  servers: {
    applications: [
      {
        name: 'user_back',
        status: 'UP',
        responseMs: 120,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
      {
        name: 'admin_back',
        status: 'SLOW',
        responseMs: 620,
        lastCheckedAt: '2026-05-26T14:31:02',
      },
    ],
    infrastructure: [
      {
        name: 'mysql',
        status: 'UP',
        responseMs: 45,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
      {
        name: 'redis',
        status: 'UP',
        responseMs: 8,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
    ],
  },
  dbConnectionPool: [
    {
      name: 'Spring Boot',
      used: 18,
      total: 24,
    },
  ],
  summary: {
    totalCount: 4,
    normalCount: 3,
    slowCount: 1,
    averageResponseMs: 198,
  },
};

/**
 * 서버 상태 확인 목 데이터 — 장애 상태
 */
export const MOCK_SERVER_HEALTH_DOWN: ServerHealthData = {
  servers: {
    applications: [
      {
        name: 'user_back',
        status: 'DOWN',
        responseMs: 0,
        lastCheckedAt: '2026-05-26T14:30:00',
      },
      {
        name: 'admin_back',
        status: 'UP',
        responseMs: 95,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
    ],
    infrastructure: [
      {
        name: 'mysql',
        status: 'UP',
        responseMs: 52,
        lastCheckedAt: '2026-05-26T14:32:07',
      },
      {
        name: 'redis',
        status: 'DOWN',
        responseMs: 0,
        lastCheckedAt: '2026-05-26T14:28:33',
      },
    ],
  },
  dbConnectionPool: [
    {
      name: 'Spring Boot',
      used: 22,
      total: 24,
    },
  ],
  summary: {
    totalCount: 4,
    normalCount: 2,
    slowCount: 0,
    averageResponseMs: 37,
  },
};
