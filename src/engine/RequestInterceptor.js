import {
  simulatePreRequest,
  simulateDownloadDelay,
  NetworkSimulationError,
  normalizeConfig,
} from './NetworkSimulator';

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function abortError() {
  const err = new Error('Request aborted');
  err.code = 'ABORTED';
  err.name = 'AbortError';
  return err;
}

async function readResponseSize(response) {
  try {
    const clone = response.clone();
    const buf = await clone.arrayBuffer();
    return buf.byteLength;
  } catch {
    return 0;
  }
}

/**
 * Executes a real fetch after applying simulated network conditions.
 * Does NOT fabricate HTTP success when the server fails.
 */
export async function interceptedFetch(url, options = {}, config, hooks = {}) {
  const cfg = normalizeConfig(config);
  const signal = options.signal;
  const method = (options.method || 'GET').toUpperCase();
  const startedAt = Date.now();
  const profileId = cfg.profileId;

  if (!cfg.enabled) {
    const response = await fetch(url, options);
    const responseSize = response.ok ? (await readResponseSize(response)) : 0;
    return {
      response,
      durationMs: Date.now() - startedAt,
      profileId,
      responseSize,
      simulatedPreDelayMs: 0,
      downloadDelayMs: 0,
    };
  }

  hooks.onPhase?.('preparing', { profileId, method, url });

  let preMeta = { uploadDelayMs: 0, latencyAppliedMs: 0 };

  try {
    preMeta = simulatePreRequest(cfg, { body: options.body }, hooks.random);
  } catch (err) {
    if (err instanceof NetworkSimulationError) {
      hooks.onPhase?.('failed', { phase: 'pre', code: err.code, message: err.message });
      throw err;
    }
    throw err;
  }

  const preDelay = (preMeta.uploadDelayMs || 0) + (preMeta.latencyAppliedMs || 0);
  if (preDelay > 0) {
    hooks.onPhase?.('latency', { ms: preDelay });
    await delay(preDelay, signal);
  }

  hooks.onPhase?.('fetching', { url });

  const timeoutMs = cfg.connectionTimeoutMs;
  const fetchController = new AbortController();
  const linkedAbort = () => fetchController.abort();
  signal?.addEventListener('abort', linkedAbort, { once: true });

  const timeoutId = setTimeout(() => fetchController.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: fetchController.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', linkedAbort);
    if (fetchController.signal.aborted && !signal?.aborted) {
      const timeoutErr = new Error(`Simulated connection timeout after ${timeoutMs}ms`);
      timeoutErr.code = 'SIM_TIMEOUT';
      hooks.onPhase?.('failed', { code: 'SIM_TIMEOUT' });
      throw timeoutErr;
    }
    hooks.onPhase?.('failed', { code: err.code || 'NETWORK_ERROR', message: err.message });
    throw err;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', linkedAbort);
  }

  if (!response.ok) {
    hooks.onPhase?.('response', { status: response.status, ok: false });
    const durationMs = Date.now() - startedAt;
    return {
      response,
      durationMs,
      profileId,
      responseSize: 0,
      simulatedPreDelayMs: preDelay,
      downloadDelayMs: 0,
    };
  }

  const responseSize = await readResponseSize(response);
  const downloadDelayMs = simulateDownloadDelay(cfg, responseSize);
  if (downloadDelayMs > 0) {
    hooks.onPhase?.('download', { ms: downloadDelayMs, bytes: responseSize });
    await delay(downloadDelayMs, signal);
  }

  hooks.onPhase?.('complete', { status: response.status, bytes: responseSize });

  return {
    response,
    durationMs: Date.now() - startedAt,
    profileId,
    responseSize,
    simulatedPreDelayMs: preDelay,
    downloadDelayMs,
  };
}
