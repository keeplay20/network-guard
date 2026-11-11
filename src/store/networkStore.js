import { create } from 'zustand';
import { NetworkGuard } from '../engine/NetworkGuard';
import {
  DEFAULT_CONFIG,
  DEFAULT_BASE_URL,
  NETWORK_PROFILES,
  SAMPLE_ENDPOINTS,
} from '../constants/networkProfiles';

const defaultEndpoint = SAMPLE_ENDPOINTS[0];

function syncFromGuard() {
  return NetworkGuard.getCurrentConfig();
}

export const useNetworkStore = create((set, get) => ({
  config: syncFromGuard(),
  baseURL: DEFAULT_BASE_URL,
  enabled: true,
  selectedEndpointId: defaultEndpoint.id,
  isRequestInFlight: false,
  lastResult: null,
  requestHistory: [],
  timeline: [],
  comparisonResults: [],
  comparisonRunning: false,

  init: () => {
    NetworkGuard.configure({ profile: '4g' });
    const unsub = NetworkGuard.subscribe((cfg) => set({ config: cfg, enabled: cfg.enabled }));
    set({ config: syncFromGuard() });
    return unsub;
  },

  setProfile: (profileId) => {
    NetworkGuard.configure({ profile: profileId });
    set({ config: syncFromGuard() });
  },

  applyCustomConfig: (partial) => {
    NetworkGuard.configure(partial);
    set({ config: syncFromGuard() });
  },

  setEnabled: (enabled) => {
    NetworkGuard.setEnabled(enabled);
    set({ enabled, config: syncFromGuard() });
  },

  resetGuard: () => {
    NetworkGuard.reset();
    set({
      config: syncFromGuard(),
      enabled: true,
      timeline: [],
      comparisonResults: [],
      lastResult: null,
    });
  },

  setBaseURL: (baseURL) => set({ baseURL: baseURL.trim() }),

  setSelectedEndpoint: (id) => set({ selectedEndpointId: id }),

  pushTimeline: (entry) =>
    set((s) => ({ timeline: [...s.timeline, { ...entry, id: `${Date.now()}-${s.timeline.length}` }] })),

  clearTimeline: () => set({ timeline: [] }),

  getClient: () => NetworkGuard.createClient({ baseURL: get().baseURL }),

  sendTestRequest: async () => {
    if (get().isRequestInFlight) return null;

    const endpoint =
      SAMPLE_ENDPOINTS.find((e) => e.id === get().selectedEndpointId) || defaultEndpoint;
    const client = get().getClient();
    const cfg = get().config;

    set({ isRequestInFlight: true, timeline: [] });
    get().pushTimeline({ step: 'start', label: 'Request started', color: 'blue' });

    const record = {
      id: `req-${Date.now()}`,
      endpoint: endpoint.label,
      method: endpoint.method,
      path: endpoint.path,
      profileId: cfg.profileId,
      status: null,
      durationMs: null,
      responseSize: null,
      ok: null,
      error: null,
      at: new Date().toISOString(),
    };

    try {
      get().pushTimeline({ step: 'simulate', label: `Profile: ${cfg.profileId}`, color: 'purple' });

      let result;
      if (endpoint.method === 'POST') {
        result = await client.post(endpoint.path, endpoint.body || {});
      } else {
        result = await client.get(endpoint.path);
      }

      get().pushTimeline({
        step: 'done',
        label: result.ok ? 'Success' : `HTTP ${result.status}`,
        color: result.ok ? 'green' : 'red',
      });

      record.status = result.status;
      record.durationMs = result.durationMs;
      record.responseSize = result.responseSize;
      record.ok = result.ok;

      set((s) => ({
        isRequestInFlight: false,
        lastResult: result,
        requestHistory: [record, ...s.requestHistory].slice(0, 50),
      }));
      return result;
    } catch (err) {
      get().pushTimeline({
        step: 'fail',
        label: err.message || 'Failed',
        color: 'red',
      });
      record.ok = false;
      record.error = err.message;
      record.durationMs = Date.now() - Date.parse(record.at);
      set((s) => ({
        isRequestInFlight: false,
        lastResult: { ok: false, error: err },
        requestHistory: [record, ...s.requestHistory].slice(0, 50),
      }));
      return null;
    }
  },

  runComparison: async () => {
    if (get().comparisonRunning || get().isRequestInFlight) return;

    const endpoint =
      SAMPLE_ENDPOINTS.find((e) => e.id === get().selectedEndpointId) || defaultEndpoint;
    const profilesToTest = ['4g', 'slow-3g', 'offline', 'unstable'];
    const saved = NetworkGuard.getCurrentConfig();

    set({ comparisonRunning: true, comparisonResults: [] });
    const results = [];

    for (const profileId of profilesToTest) {
      NetworkGuard.configure({ profile: profileId });
      const client = get().getClient();
      const row = {
        profileId,
        label: NETWORK_PROFILES[profileId]?.label || profileId,
        durationMs: null,
        result: '—',
      };

      if (profileId === 'offline') {
        try {
          await client.get(endpoint.path);
          row.result = 'Unexpected success';
        } catch {
          row.durationMs = 0;
          row.result = 'Failed (simulated offline)';
        }
      } else {
        const start = Date.now();
        try {
          const res = endpoint.method === 'POST'
            ? await client.post(endpoint.path, endpoint.body || {})
            : await client.get(endpoint.path);
          row.durationMs = res.durationMs ?? Date.now() - start;
          row.result = res.ok ? 'Success' : `HTTP ${res.status}`;
        } catch (err) {
          row.durationMs = Date.now() - start;
          row.result = err.simulated ? 'Failed (simulated)' : `Failed: ${err.message}`;
        }
      }
      results.push(row);
    }

    NetworkGuard.configure(saved);
    set({
      comparisonRunning: false,
      comparisonResults: results,
      config: syncFromGuard(),
    });
  },
}));

export function selectEndpoint(state) {
  return SAMPLE_ENDPOINTS.find((e) => e.id === state.selectedEndpointId) || SAMPLE_ENDPOINTS[0];
}
