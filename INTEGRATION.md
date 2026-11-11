# NetworkGuard — Integration Guide

NetworkGuard simulates **approximate** network conditions at the **HTTP client layer**. It does **not** change your device’s Wi‑Fi or cellular radio, and it does **not** intercept traffic from other `fetch`/`axios` instances unless you route through NetworkGuard.

## Supported boundary

| In scope | Out of scope |
|----------|----------------|
| `NetworkGuard.createClient()` | Global `fetch` monkey-patching |
| `NetworkGuard.simulateRequest()` | System-wide throttling (Charles, Proxyman, etc.) |
| Live `NetworkGuard.configure()` / `reset()` | Claiming exact 2G/3G/4G carrier emulation |

## Quick start (in this repo)

```javascript
import { NetworkGuard } from './src/engine/NetworkGuard';

// 1. Pick a simulated profile (approximate preset)
NetworkGuard.configure({ profile: 'slow-3g' });

// 2. Create a client — reads live config on every call
const client = NetworkGuard.createClient({
  baseURL: 'https://your-api.com',
});

// 3. Use like axios
const res = await client.get('/products');
console.log(res.data, res.durationMs, res.profileId);
```

## Copy into your Expo / React Native app

1. Copy these folders into your app (e.g. `src/network-guard/`):

   - `src/engine/`
   - `src/services/apiClient.js`
   - `src/constants/networkProfiles.js`
   - `src/utils/bandwidth.js`, `latency.js`, `formatters.js`

2. Import from a single barrel:

   ```javascript
   export { NetworkGuard } from './network-guard/engine/NetworkGuard';
   ```

3. In `__DEV__` only, add a dev screen or menu:

   ```javascript
   import { NetworkGuard } from './network-guard/engine/NetworkGuard';

   export function DevNetworkMenu() {
     return (
       <Button title="Slow 3G" onPress={() => NetworkGuard.configure({ profile: 'slow-3g' })} />
     );
   }
   ```

4. Point your data layer at the guarded client:

   ```javascript
   // services/http.js
   import { NetworkGuard } from '../network-guard/engine/NetworkGuard';

   export const api = NetworkGuard.createClient({ baseURL: process.env.EXPO_PUBLIC_API_URL });
   ```

## API reference

### `NetworkGuard.configure(options)`

```javascript
NetworkGuard.configure({
  profile: 'slow-3g', // offline | slow-2g | slow-3g | fast-3g | 4g | high-latency | unstable
  latency: 500,       // alias latencyMs
  latencyMs: 500,
  jitterMs: 80,
  packetLoss: 5,      // alias packetLossPercent
  downloadSpeed: 400, // alias downloadKbps (kilobits/s, approximate)
  uploadSpeed: 200,   // alias uploadKbps
  failureProbability: 0.25,
  connectionTimeoutMs: 30000,
});
```

### `NetworkGuard.reset()`

Restores default **4G** profile and clears custom overrides.

### `NetworkGuard.getCurrentConfig()`

Returns the active simulation config snapshot.

### `NetworkGuard.setEnabled(false)`

Bypasses simulation (direct `fetch` timing). Useful to compare “with vs without” Guard.

### `NetworkGuard.createClient({ baseURL, defaultHeaders })`

Returns `{ get, post, put, delete, request }`. Each method returns:

```typescript
{
  ok: boolean;
  status: number;
  data: unknown;
  durationMs: number;
  responseSize: number;
  profileId: string;
  simulatedPreDelayMs: number;
  downloadDelayMs: number;
}
```

### `NetworkGuard.simulateRequest({ url, method, headers, body, signal })`

Low-level single request (used by the client internally).

## UI states in your app

Map results to your components:

| Outcome | Your UI |
|---------|---------|
| `res.ok` | Success view with `res.data` |
| `NetworkSimulationError` / `err.simulated` | Offline / dropped connection banner |
| `SIM_TIMEOUT` | Timeout message |
| `!res.ok` | Real API error — **not fabricated** by Guard |

## Testing

```bash
npm test
```

Engine tests live in `__tests__/NetworkSimulator.test.js` and `NetworkGuard.test.js`.

## Future: npm package

This MVP is structured so `src/engine` + `src/services/apiClient.js` can become `@your-scope/network-guard` with the same public API.
