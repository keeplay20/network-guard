import { simulateNetworkAttempt } from './networkSimulator';
import { computeRetryDelay } from '../utils/backoff';
import { formatTimestamp } from '../utils/formatTime';

const TIMELINE_STEPS = [
  'request_started',
  'network_check',
  'request_sent',
  'server_response',
  'outcome',
  'retry_wait',
  'recovered',
  'final_failure',
];

function shouldRetry(errorType, retryConfig) {
  if (errorType === 'timeout') return retryConfig.retryOnTimeout;
  if (errorType === 'server_error') return retryConfig.retryOnServerError;
  if (errorType === 'network_unstable' || errorType === 'offline') return true;
  return false;
}

function createTimelineEntry(step, meta = {}) {
  return {
    id: `${step}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    step,
    label: meta.label || step.replace(/_/g, ' ').toUpperCase(),
    color: meta.color || 'blue',
    timestamp: Date.now(),
    meta,
  };
}

let activeController = null;

export function cancelActiveRequest() {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

export async function executeRequest({
  endpoint,
  getState,
  patchState,
  isManualRetry = false,
}) {
  const state = getState();
  if (state.isRequestInFlight && !isManualRetry) {
    return;
  }

  cancelActiveRequest();
  const controller = new AbortController();
  activeController = controller;

  const requestId = `req-${Date.now()}`;
  const conditionId = getState().conditionId;
  const retryConfig = { ...getState().retryConfig };
  const unstableFailureProbability = getState().unstableFailureProbability;

  const addLog = (message, eventType, status = 'info') => {
    patchState({
      logs: [
        {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: formatTimestamp(new Date()),
          message,
          eventType,
          status,
        },
        ...getState().logs,
      ],
    });
  };

  const pushTimeline = (entry) => {
    patchState({
      timeline: [...getState().timeline, entry],
    });
  };

  patchState({
    isRequestInFlight: true,
    lastEndpoint: endpoint,
    requestState: 'loading',
    activeRequestId: requestId,
    response: null,
    timeline: [],
    currentAttempt: 0,
  });

  addLog('Request initiated', 'request', 'info');
  addLog(`Network condition: ${getState().conditionLabel}`, 'network', 'info');
  pushTimeline(
    createTimelineEntry('request_started', {
      label: 'REQUEST STARTED',
      color: 'blue',
      endpoint: endpoint.label,
    })
  );

  const maxAttempts = 1 + Math.min(Math.max(retryConfig.maxRetries, 0), 5);
  let lastResult = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (controller.signal.aborted) {
      patchState({ isRequestInFlight: false, requestState: 'cancelled' });
      addLog('Request cancelled', 'cancel', 'warning');
      return;
    }

    patchState({ currentAttempt: attempt });

    if (attempt > 1) {
      const waitMs = computeRetryDelay(
        retryConfig.baseDelayMs,
        attempt - 1,
        retryConfig.exponentialBackoff
      );
      addLog(`Retry attempt ${attempt - 1} (waiting ${waitMs}ms)`, 'retry', 'warning');
      pushTimeline(
        createTimelineEntry('retry_wait', {
          label: `RETRY ${attempt - 1}`,
          color: 'amber',
          delayMs: waitMs,
        })
      );
      try {
        await new Promise((res, rej) => {
          const t = setTimeout(res, waitMs);
          controller.signal.addEventListener(
            'abort',
            () => {
              clearTimeout(t);
              rej(new Error('cancelled'));
            },
            { once: true }
          );
        });
      } catch {
        patchState({ isRequestInFlight: false, requestState: 'cancelled' });
        return;
      }
    }

    try {
      const result = await simulateNetworkAttempt({
        conditionId: getState().conditionId,
        unstableFailureProbability,
        path: endpoint.path,
        method: endpoint.method,
        signal: controller.signal,
        onPhase: (phase, meta) => {
          const colorMap = {
            network_check: 'blue',
            request_sent: 'purple',
            server_response: 'purple',
          };
          pushTimeline(
            createTimelineEntry(phase, {
              label: phase.replace(/_/g, ' ').toUpperCase(),
              color: colorMap[phase] || 'purple',
              ...meta,
            })
          );
        },
      });

      lastResult = result;

      if (result.ok) {
        pushTimeline(
          createTimelineEntry('outcome', {
            label: 'REQUEST SUCCESS',
            color: 'green',
            statusCode: result.statusCode,
          })
        );
        if (attempt > 1) {
          pushTimeline(
            createTimelineEntry('recovered', {
              label: 'RECOVERED',
              color: 'green',
            })
          );
          addLog('Request successful after retry', 'success', 'success');
        } else {
          addLog('Request successful', 'success', 'success');
        }

        patchState({
          isRequestInFlight: false,
          requestState: 'success',
          response: {
            statusCode: result.statusCode,
            body: result.body,
            durationMs: result.durationMs,
            attempt,
          },
        });
        activeController = null;
        return;
      }

      pushTimeline(
        createTimelineEntry('outcome', {
          label: 'REQUEST FAILURE',
          color: 'red',
          error: result.errorMessage,
        })
      );
      addLog(result.errorMessage, 'failure', 'error');

      const canRetry = attempt < maxAttempts && shouldRetry(result.errorType, retryConfig);
      if (!canRetry) {
        pushTimeline(
          createTimelineEntry('final_failure', {
            label: 'FINAL FAILURE',
            color: 'red',
          })
        );
        patchState({
          isRequestInFlight: false,
          requestState: 'error',
          response: {
            statusCode: result.statusCode,
            body: result.body,
            durationMs: result.durationMs,
            errorMessage: result.errorMessage,
            attempt,
          },
        });
        activeController = null;
        return;
      }
    } catch (err) {
      if (err.message === 'cancelled' || err.code === 'CANCELLED') {
        patchState({ isRequestInFlight: false, requestState: 'cancelled' });
        activeController = null;
        return;
      }
      addLog(err.message, 'failure', 'error');
      patchState({
        isRequestInFlight: false,
        requestState: 'error',
        response: { errorMessage: err.message, attempt },
      });
      activeController = null;
      return;
    }
  }

  patchState({
    isRequestInFlight: false,
    requestState: 'error',
    response: lastResult
      ? {
          statusCode: lastResult.statusCode,
          body: lastResult.body,
          durationMs: lastResult.durationMs,
          errorMessage: lastResult.errorMessage,
        }
      : null,
  });
  activeController = null;
}

export { TIMELINE_STEPS };
