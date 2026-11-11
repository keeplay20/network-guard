import {
  simulatePreRequest,
  simulateDownloadDelay,
  NetworkSimulationError,
  normalizeConfig,
} from '../src/engine/NetworkSimulator';
import { transferDelayMs } from '../src/utils/bandwidth';
import { applyJitter, rollPacketLoss } from '../src/utils/latency';

describe('bandwidth', () => {
  test('transfer delay scales with payload', () => {
    expect(transferDelayMs(1000, 400)).toBeGreaterThan(transferDelayMs(100, 400));
  });

  test('zero kbps yields no delay', () => {
    expect(transferDelayMs(5000, 0)).toBe(0);
  });
});

describe('latency', () => {
  test('jitter stays within bounds', () => {
    for (let i = 0; i < 20; i += 1) {
      const v = applyJitter(500, 100, () => 0.5);
      expect(v).toBeGreaterThanOrEqual(400);
      expect(v).toBeLessThanOrEqual(600);
    }
  });

  test('packet loss roll respects probability', () => {
    const always = rollPacketLoss(100, () => 0.01);
    const never = rollPacketLoss(0, () => 0.99);
    expect(always).toBe(true);
    expect(never).toBe(false);
  });
});

describe('simulatePreRequest', () => {
  test('offline fails immediately', () => {
    expect(() =>
      simulatePreRequest(normalizeConfig({ offline: true, enabled: true, profileId: 'offline' }), {})
    ).toThrow(NetworkSimulationError);
  });

  test('disabled skips simulation', () => {
    const res = simulatePreRequest(normalizeConfig({ enabled: false }), { body: '{}' });
    expect(res.skipped).toBe(true);
  });

  test('slow profile adds upload and latency budget', () => {
    const cfg = normalizeConfig({
      enabled: true,
      offline: false,
      profileId: 'slow-3g',
      latencyMs: 500,
      jitterMs: 0,
      uploadKbps: 200,
      packetLossPercent: 0,
      failureProbability: 0,
    });
    const res = simulatePreRequest(cfg, { body: 'x'.repeat(1000) }, () => 0);
    expect(res.uploadDelayMs).toBeGreaterThan(0);
    expect(res.latencyAppliedMs).toBe(500);
  });
});

describe('simulateDownloadDelay', () => {
  test('larger responses take longer on slow links', () => {
    const cfg = normalizeConfig({ enabled: true, downloadKbps: 50 });
    const small = simulateDownloadDelay(cfg, 200);
    const large = simulateDownloadDelay(cfg, 8000);
    expect(large).toBeGreaterThan(small);
  });
});
