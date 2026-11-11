import { DEFAULT_CONFIG, NETWORK_PROFILES } from '../constants/networkProfiles';
import { interceptedFetch } from './RequestInterceptor';
import { normalizeConfig } from './NetworkSimulator';
import { createGuardedClient } from '../services/apiClient';

let currentConfig = { ...DEFAULT_CONFIG };
const listeners = new Set();

function snapshotConfig() {
  return { ...currentConfig };
}

function notify() {
  listeners.forEach((fn) => fn(snapshotConfig()));
}

function mergeProfile(profileKey, overrides = {}) {
  const profile = profileKey ? NETWORK_PROFILES[profileKey] : null;
  const base = profile
    ? {
        profileId: profile.id,
        offline: profile.offline,
        latencyMs: profile.latencyMs,
        jitterMs: profile.jitterMs,
        packetLossPercent: profile.packetLossPercent,
        downloadKbps: profile.downloadKbps,
        uploadKbps: profile.uploadKbps,
        failureProbability: profile.failureProbability ?? 0,
      }
    : {};

  return normalizeConfig({
    ...currentConfig,
    ...base,
    ...overrides,
    profileId: overrides.profile || overrides.profileId || base.profileId || currentConfig.profileId,
  });
}

export const NetworkGuard = {
  /**
   * Apply a built-in profile and/or custom overrides.
   * Does NOT change device Wi‑Fi/cellular — HTTP-layer simulation only.
   */
  configure(options = {}) {
    const { profile, profileId, ...raw } = options;
    const rest = mapAliases(raw);
    const key = profile || profileId;
    if (key && NETWORK_PROFILES[key]) {
      currentConfig = mergeProfile(key, rest);
      currentConfig.profileId = key;
    } else {
      currentConfig = normalizeConfig({ ...currentConfig, ...rest });
    }
    notify();
    return snapshotConfig();
  },

  reset() {
    currentConfig = { ...DEFAULT_CONFIG };
    notify();
    return snapshotConfig();
  },

  getCurrentConfig() {
    return snapshotConfig();
  },

  setEnabled(enabled) {
    currentConfig = { ...currentConfig, enabled: Boolean(enabled) };
    notify();
    return snapshotConfig();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Internal config ref for interceptors (always live). */
  _getConfigRef() {
    return currentConfig;
  },

  /**
   * Run one HTTP request through the simulation engine (real fetch).
   */
  async simulateRequest(request = {}) {
    const {
      url,
      method = 'GET',
      headers = {},
      body,
      signal,
      onPhase,
      random,
    } = request;

    if (!url) {
      throw new Error('NetworkGuard.simulateRequest: url is required');
    }

    const result = await interceptedFetch(
      url,
      { method, headers, body, signal },
      currentConfig,
      { onPhase, random }
    );

    const json = await parseResponseBody(result.response);

    return {
      ok: result.response.ok,
      status: result.response.status,
      statusText: result.response.statusText,
      headers: result.response.headers,
      data: json.data,
      rawBody: json.rawBody,
      durationMs: result.durationMs,
      responseSize: result.responseSize,
      profileId: result.profileId,
      simulatedPreDelayMs: result.simulatedPreDelayMs,
      downloadDelayMs: result.downloadDelayMs,
    };
  },

  /**
   * Axios-like client; reads live config on every request.
   * Only requests made through this client are simulated.
   */
  createClient(options = {}) {
    return createGuardedClient(this, options);
  },
};

function mapAliases(opts) {
  const o = { ...opts };
  if (o.latency != null) o.latencyMs = o.latency;
  if (o.packetLoss != null) o.packetLossPercent = o.packetLoss;
  if (o.downloadSpeed != null) o.downloadKbps = o.downloadSpeed;
  if (o.uploadSpeed != null) o.uploadKbps = o.uploadSpeed;
  return o;
}

async function parseResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();
  if (contentType.includes('application/json')) {
    try {
      return { data: JSON.parse(rawBody), rawBody };
    } catch {
      return { data: rawBody, rawBody };
    }
  }
  return { data: rawBody, rawBody };
}

export { NetworkSimulationError } from './NetworkSimulator';
