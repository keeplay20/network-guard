/**
 * Transfer time for a payload over a link at kbps (kilobits per second).
 * timeMs = (bytes × 8 bits) / kbps
 */
export function transferDelayMs(byteLength, kbps) {
  if (!byteLength || byteLength <= 0) return 0;
  if (!kbps || kbps <= 0) return 0;
  return Math.ceil((byteLength * 8) / kbps);
}

export function formatKbps(kbps) {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} Mbps`;
  return `${kbps} kbps`;
}

export function estimateByteLength(body) {
  if (body == null) return 0;
  if (typeof body === 'string') return new TextEncoder().encode(body).length;
  if (body instanceof ArrayBuffer) return body.byteLength;
  if (typeof body === 'object') {
    try {
      return new TextEncoder().encode(JSON.stringify(body)).length;
    } catch {
      return 0;
    }
  }
  return String(body).length;
}
