/**
 * Add random jitter in range [-jitterMs, +jitterMs] to base latency (min 0).
 */
export function applyJitter(baseLatencyMs, jitterMs, random = Math.random) {
  if (!jitterMs || jitterMs <= 0) return Math.max(0, baseLatencyMs);
  const delta = (random() * 2 - 1) * jitterMs;
  return Math.max(0, Math.round(baseLatencyMs + delta));
}

/** Unstable profile: extra variable latency spike. */
export function variableLatencySpike(baseMs, jitterMs, random = Math.random) {
  const spike = random() < 0.35 ? jitterMs * (1 + random() * 2) : 0;
  return applyJitter(baseMs + spike, jitterMs, random);
}

export function rollPacketLoss(packetLossPercent, random = Math.random) {
  if (!packetLossPercent || packetLossPercent <= 0) return false;
  return random() * 100 < packetLossPercent;
}

export function rollFailureProbability(probability, random = Math.random) {
  if (!probability || probability <= 0) return false;
  return random() < probability;
}
