export function computeRetryDelay(baseDelayMs, attempt, exponentialBackoff) {
  if (!exponentialBackoff) {
    return baseDelayMs;
  }
  return baseDelayMs * Math.pow(2, attempt - 1);
}
