import { transferDelayMs, estimateByteLength } from '../utils/bandwidth';
import {
  applyJitter,
  variableLatencySpike,
  rollPacketLoss,
  rollFailureProbability,
} from '../utils/latency';

export class NetworkSimulationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'NetworkSimulationError';
    this.code = code;
    this.simulated = true;
    this.details = details;
  }
}

export function normalizeConfig(config) {
  return {
    enabled: config.enabled !== false,
    profileId: config.profileId || '4g',
    offline: Boolean(config.offline),
    latencyMs: Math.max(0, config.latencyMs ?? 0),
    jitterMs: Math.max(0, config.jitterMs ?? 0),
    packetLossPercent: Math.min(100, Math.max(0, config.packetLossPercent ?? 0)),
    downloadKbps: Math.max(0, config.downloadKbps ?? 0),
    uploadKbps: Math.max(0, config.uploadKbps ?? 0),
    failureProbability: Math.min(1, Math.max(0, config.failureProbability ?? 0)),
    connectionTimeoutMs: Math.max(1000, config.connectionTimeoutMs ?? 30000),
  };
}

/**
 * Pre-request simulation phases (latency, packet loss, upload delay).
 * Returns { uploadDelayMs, latencyAppliedMs } or throws NetworkSimulationError.
 */
export function simulatePreRequest(config, requestMeta, random = Math.random) {
  const cfg = normalizeConfig(config);

  if (!cfg.enabled) {
    return { uploadDelayMs: 0, latencyAppliedMs: 0, skipped: true };
  }

  if (cfg.offline) {
    throw new NetworkSimulationError(
      'Simulated offline — no network route',
      'SIM_OFFLINE',
      { profileId: cfg.profileId }
    );
  }

  if (rollPacketLoss(cfg.packetLossPercent, random)) {
    throw new NetworkSimulationError(
      'Simulated packet loss',
      'SIM_PACKET_LOSS',
      { profileId: cfg.profileId }
    );
  }

  if (cfg.profileId === 'unstable' || cfg.failureProbability > 0) {
    if (rollFailureProbability(cfg.failureProbability, random)) {
      throw new NetworkSimulationError(
        'Simulated unstable connection drop',
        'SIM_UNSTABLE',
        { profileId: cfg.profileId }
      );
    }
  }

  const uploadBytes = estimateByteLength(requestMeta.body);
  const uploadDelayMs = transferDelayMs(uploadBytes, cfg.uploadKbps);

  const latencyAppliedMs =
    cfg.profileId === 'unstable'
      ? variableLatencySpike(cfg.latencyMs, cfg.jitterMs, random)
      : applyJitter(cfg.latencyMs, cfg.jitterMs, random);

  return { uploadDelayMs, latencyAppliedMs, uploadBytes };
}

/**
 * Post-response transfer delay from download bandwidth.
 */
export function simulateDownloadDelay(config, responseByteLength) {
  const cfg = normalizeConfig(config);
  if (!cfg.enabled || cfg.offline) return 0;
  return transferDelayMs(responseByteLength, cfg.downloadKbps);
}

export function buildLatencyBudget(preResult) {
  if (preResult.skipped) return 0;
  return (preResult.uploadDelayMs || 0) + (preResult.latencyAppliedMs || 0);
}
