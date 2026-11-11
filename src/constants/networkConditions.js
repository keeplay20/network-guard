export const NETWORK_CONDITIONS = {
  normal: {
    id: 'normal',
    label: 'Normal',
    description: 'Stable connection, low latency',
    latencyMs: 100,
    successRate: 1,
    mode: 'success',
  },
  slow3g: {
    id: 'slow3g',
    label: 'Slow 3G',
    description: 'High latency, requests complete slowly',
    latencyMs: 3000,
    successRate: 1,
    mode: 'success',
  },
  offline: {
    id: 'offline',
    label: 'Offline',
    description: 'No connectivity — immediate failure',
    latencyMs: 0,
    successRate: 0,
    mode: 'offline',
  },
  timeout: {
    id: 'timeout',
    label: 'Timeout',
    description: 'Request exceeds client timeout',
    latencyMs: 5000,
    successRate: 0,
    mode: 'timeout',
  },
  serverError: {
    id: 'serverError',
    label: 'Server Error',
    description: 'Simulated HTTP 500 responses',
    latencyMs: 400,
    successRate: 0,
    mode: 'server_error',
  },
  unstable: {
    id: 'unstable',
    label: 'Unstable Network',
    description: 'Intermittent success and failure',
    latencyMs: 800,
    successRate: null,
    mode: 'unstable',
  },
};

export const CONDITION_LIST = Object.values(NETWORK_CONDITIONS);

export const CLIENT_TIMEOUT_MS = 3500;

export const MOCK_ENDPOINTS = [
  { id: 'users', method: 'GET', path: '/users', label: 'GET /users' },
  { id: 'products', method: 'GET', path: '/products', label: 'GET /products' },
  { id: 'orders', method: 'GET', path: '/orders', label: 'GET /orders' },
  { id: 'login', method: 'POST', path: '/login', label: 'POST /login' },
];

export const DEFAULT_RETRY_CONFIG = {
  maxRetries: 2,
  baseDelayMs: 1000,
  exponentialBackoff: true,
  retryOnTimeout: true,
  retryOnServerError: true,
};

export const SCENARIOS = [
  {
    id: 'happy_path',
    title: 'Happy Path',
    description: 'Normal → Request → Success',
    steps: [{ condition: 'normal' }, { action: 'send_request' }],
  },
  {
    id: 'slow_connection',
    title: 'Slow Connection',
    description: 'Slow 3G → Loading → Success',
    steps: [{ condition: 'slow3g' }, { action: 'send_request' }],
  },
  {
    id: 'offline_failure',
    title: 'Offline Failure',
    description: 'Offline → Request → Failure',
    steps: [{ condition: 'offline' }, { action: 'send_request' }],
  },
  {
    id: 'auto_recovery',
    title: 'Automatic Recovery',
    description: 'Offline → Fail → Normal → Retry → Success',
    steps: [
      { condition: 'offline' },
      { action: 'send_request' },
      { condition: 'normal' },
      { action: 'retry_last' },
    ],
  },
  {
    id: 'retry_storm',
    title: 'Retry Storm',
    description: 'Unstable network with backoff retries',
    steps: [
      { condition: 'unstable' },
      { setRetry: { maxRetries: 4, baseDelayMs: 500, exponentialBackoff: true } },
      { action: 'send_request' },
    ],
  },
];
