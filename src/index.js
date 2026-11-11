/**
 * NetworkGuard — drop-in HTTP-layer network simulation for React Native / Expo.
 *
 * Supported boundary: requests via NetworkGuard.createClient() or NetworkGuard.simulateRequest().
 * This does not intercept other fetch/axios instances in your app.
 */
export { NetworkGuard, NetworkSimulationError } from './engine/NetworkGuard';
export { NETWORK_PROFILES, PROFILE_LIST, DEFAULT_BASE_URL, SAMPLE_ENDPOINTS } from './constants/networkProfiles';
export { createGuardedClient } from './services/apiClient';
export { transferDelayMs, formatKbps } from './utils/bandwidth';
export { applyJitter, rollPacketLoss } from './utils/latency';
