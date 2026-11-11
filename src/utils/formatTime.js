export function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
