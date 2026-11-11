import { NETWORK_CONDITIONS, CLIENT_TIMEOUT_MS } from '../constants/networkConditions';
import { getMockResponse } from '../constants/mockData';

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }
    const id = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(createAbortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function createAbortError() {
  const err = new Error('Request cancelled');
  err.code = 'CANCELLED';
  return err;
}

function shouldFailUnstable(successRate) {
  return Math.random() >= successRate;
}

/**
 * Simulates a single HTTP attempt according to the active network condition.
 */
export async function simulateNetworkAttempt({
  conditionId,
  unstableFailureProbability = 0.5,
  path,
  method,
  signal,
  onPhase,
}) {
  const condition = NETWORK_CONDITIONS[conditionId] || NETWORK_CONDITIONS.normal;
  const startedAt = Date.now();

  onPhase?.('network_check', { condition: condition.label });

  if (condition.mode === 'offline') {
    onPhase?.('request_sent', { note: 'No route to host' });
    return {
      ok: false,
      statusCode: 0,
      body: null,
      errorType: 'offline',
      errorMessage: 'No internet connection',
      durationMs: Date.now() - startedAt,
    };
  }

  onPhase?.('request_sent', { path, method });

  try {
    if (condition.mode === 'timeout') {
      const raceResult = await Promise.race([
        delay(condition.latencyMs, signal),
        delay(CLIENT_TIMEOUT_MS, signal).then(() => 'TIMEOUT'),
      ]);
      if (raceResult === 'TIMEOUT') {
        onPhase?.('server_response', { timedOut: true });
        return {
          ok: false,
          statusCode: 408,
          body: null,
          errorType: 'timeout',
          errorMessage: `Request timed out after ${CLIENT_TIMEOUT_MS}ms`,
          durationMs: Date.now() - startedAt,
        };
      }
    } else {
      await delay(condition.latencyMs, signal);
    }

    if (condition.mode === 'server_error') {
      onPhase?.('server_response', { status: 500 });
      return {
        ok: false,
        statusCode: 500,
        body: { error: 'Internal Server Error', code: 'SIM_500' },
        errorType: 'server_error',
        errorMessage: 'HTTP 500 — simulated server failure',
        durationMs: Date.now() - startedAt,
      };
    }

    if (condition.mode === 'unstable') {
      const successRate = 1 - unstableFailureProbability;
      if (shouldFailUnstable(successRate)) {
        onPhase?.('server_response', { unstable: true, failed: true });
        return {
          ok: false,
          statusCode: 0,
          body: null,
          errorType: 'network_unstable',
          errorMessage: 'Connection dropped (unstable network)',
          durationMs: Date.now() - startedAt,
        };
      }
    }

    const mock = getMockResponse(path, method);
    onPhase?.('server_response', { status: mock.status });

    return {
      ok: true,
      statusCode: mock.status,
      body: mock.body,
      errorType: null,
      errorMessage: null,
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    if (err.code === 'CANCELLED') {
      throw err;
    }
    return {
      ok: false,
      statusCode: 0,
      body: null,
      errorType: 'unknown',
      errorMessage: err.message,
      durationMs: Date.now() - startedAt,
    };
  }
}

export function getConditionSummary(conditionId) {
  const c = NETWORK_CONDITIONS[conditionId] || NETWORK_CONDITIONS.normal;
  return {
    label: c.label,
    latencyMs: c.latencyMs,
    successRate: c.successRate,
  };
}
