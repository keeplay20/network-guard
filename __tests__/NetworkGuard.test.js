import { NetworkGuard } from '../src/engine/NetworkGuard';

describe('NetworkGuard API', () => {
  beforeEach(() => {
    NetworkGuard.reset();
  });

  test('configure applies profile', () => {
    const cfg = NetworkGuard.configure({ profile: 'slow-3g' });
    expect(cfg.profileId).toBe('slow-3g');
    expect(cfg.latencyMs).toBe(500);
  });

  test('reset restores defaults', () => {
    NetworkGuard.configure({ profile: 'offline' });
    const cfg = NetworkGuard.reset();
    expect(cfg.profileId).toBe('4g');
    expect(cfg.offline).toBe(false);
  });

  test('custom overrides merge', () => {
    NetworkGuard.configure({ profile: '4g', latencyMs: 999 });
    expect(NetworkGuard.getCurrentConfig().latencyMs).toBe(999);
  });

  test('subscribe notifies on configure', () => {
    const fn = jest.fn();
    const unsub = NetworkGuard.subscribe(fn);
    NetworkGuard.configure({ profile: 'slow-2g' });
    expect(fn).toHaveBeenCalled();
    unsub();
  });
});
