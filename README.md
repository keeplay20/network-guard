# NetworkGuard

**NetworkGuard** is a developer tool for React Native (Expo) that simulates approximate network conditions on **your HTTP requests** — slow links, offline, packet loss, jitter, and timeouts — while still calling **real APIs**.

> **Important:** Simulation runs only on traffic sent through `NetworkGuard.createClient()` or `NetworkGuard.simulateRequest()`. It does not modify device Wi‑Fi/cellular. Presets are **approximate**, not carrier-accurate.

## Run the app

```bash
npm install
npm start
```

- **Dashboard** — profiles, custom sliders, API base URL, request monitor  
- **Playground** — send real sample requests, inspect responses, compare profiles  

## Run tests

```bash
npm test
```

## Integrate in your app

See [INTEGRATION.md](./INTEGRATION.md).

Minimal example:

```javascript
import { NetworkGuard } from './src';

NetworkGuard.configure({ profile: 'slow-3g' });
const api = NetworkGuard.createClient({ baseURL: 'https://api.example.com' });
const { data, durationMs } = await api.get('/products');
```

## Architecture

```
src/engine/          NetworkGuard.js, NetworkSimulator.js, RequestInterceptor.js
src/services/        apiClient.js (createClient)
src/store/           Zustand UI state (synced to NetworkGuard)
src/screens/         Dashboard + Playground
```

## Default sample API

Playground uses [DummyJSON](https://dummyjson.com) (`https://dummyjson.com`). Change the base URL on the Dashboard.

## License

Private / MIT — use and copy the `engine` folder into your projects as needed.
