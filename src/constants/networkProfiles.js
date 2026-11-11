/**
 * Approximate simulation presets — not carrier-accurate emulation.
 * Speeds are in kilobits per second (kbps).
 */
export const DEFAULT_CONFIG = {
  enabled: true,
  profileId: '4g',
  latencyMs: 50,
  jitterMs: 0,
  packetLossPercent: 0,
  downloadKbps: 10000,
  uploadKbps: 5000,
  failureProbability: 0,
  connectionTimeoutMs: 30000,
  offline: false,
};

export const NETWORK_PROFILES = {
  offline: {
    id: 'offline',
    label: 'Offline',
    description: 'Simulated no connectivity — requests fail immediately.',
    offline: true,
    latencyMs: 0,
    jitterMs: 0,
    packetLossPercent: 0,
    downloadKbps: 0,
    uploadKbps: 0,
    failureProbability: 0,
  },
  'slow-2g': {
    id: 'slow-2g',
    label: 'Slow 2G',
    description: '~50 kbps down, ~20 kbps up, ~2000ms latency (approx).',
    offline: false,
    latencyMs: 2000,
    jitterMs: 200,
    packetLossPercent: 2,
    downloadKbps: 50,
    uploadKbps: 20,
    failureProbability: 0,
  },
  'slow-3g': {
    id: 'slow-3g',
    label: 'Slow 3G',
    description: '~400 kbps down, ~200 kbps up, ~500ms latency (approx).',
    offline: false,
    latencyMs: 500,
    jitterMs: 80,
    packetLossPercent: 1,
    downloadKbps: 400,
    uploadKbps: 200,
    failureProbability: 0,
  },
  'fast-3g': {
    id: 'fast-3g',
    label: 'Fast 3G',
    description: '~1.5 Mbps down, ~750 kbps up, ~150ms latency (approx).',
    offline: false,
    latencyMs: 150,
    jitterMs: 40,
    packetLossPercent: 0.5,
    downloadKbps: 1500,
    uploadKbps: 750,
    failureProbability: 0,
  },
  '4g': {
    id: '4g',
    label: '4G',
    description: '~10 Mbps down, ~5 Mbps up, ~50ms latency (approx).',
    offline: false,
    latencyMs: 50,
    jitterMs: 10,
    packetLossPercent: 0,
    downloadKbps: 10000,
    uploadKbps: 5000,
    failureProbability: 0,
  },
  'high-latency': {
    id: 'high-latency',
    label: 'High latency',
    description: 'Fast link with ~1500ms RTT and jitter (approx).',
    offline: false,
    latencyMs: 1500,
    jitterMs: 300,
    packetLossPercent: 0,
    downloadKbps: 5000,
    uploadKbps: 2000,
    failureProbability: 0,
  },
  unstable: {
    id: 'unstable',
    label: 'Unstable',
    description: 'Variable latency, packet loss, intermittent failures (approx).',
    offline: false,
    latencyMs: 400,
    jitterMs: 250,
    packetLossPercent: 8,
    downloadKbps: 800,
    uploadKbps: 400,
    failureProbability: 0.25,
  },
};

export const PROFILE_LIST = Object.values(NETWORK_PROFILES);

export const SAMPLE_ENDPOINTS = [
  { id: 'products', method: 'GET', path: '/products', label: 'GET /products' },
  { id: 'users', method: 'GET', path: '/users', label: 'GET /users' },
  { id: 'orders', method: 'GET', path: '/carts', label: 'GET /carts (orders)' },
  {
    id: 'login',
    method: 'POST',
    path: '/auth/login',
    label: 'POST /auth/login',
    body: { username: 'emilys', password: 'emilyspass', expiresInMins: 30 },
  },
];

/** Default public API for the built-in playground (configurable in dashboard). */
export const DEFAULT_BASE_URL = 'https://dummyjson.com';
