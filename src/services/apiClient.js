import { estimateByteLength } from '../utils/bandwidth';

function joinUrl(baseURL, path) {
  if (!baseURL) return path;
  if (path.startsWith('http')) return path;
  const base = baseURL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Guarded HTTP client — simulation applies only to calls made through this instance.
 */
export function createGuardedClient(guard, { baseURL = '', defaultHeaders = {} } = {}) {
  const request = async (method, path, { data, headers, signal, params } = {}) => {
    let url = joinUrl(baseURL, path);
    if (params && typeof params === 'object') {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    const mergedHeaders = { ...defaultHeaders, ...headers };
    let body;
    if (data != null && method !== 'GET' && method !== 'HEAD') {
      if (typeof data === 'object' && !(data instanceof FormData)) {
        body = JSON.stringify(data);
        if (!mergedHeaders['Content-Type']) {
          mergedHeaders['Content-Type'] = 'application/json';
        }
      } else {
        body = data;
      }
    }

    return guard.simulateRequest({
      url,
      method,
      headers: mergedHeaders,
      body,
      signal,
    });
  };

  return {
    get: (path, config) => request('GET', path, config),
    post: (path, data, config) => request('POST', path, { ...config, data }),
    put: (path, data, config) => request('PUT', path, { ...config, data }),
    delete: (path, config) => request('DELETE', path, config),
    request: ({ method, url, data, ...config }) => {
      const fullUrl = url.startsWith('http') ? url : joinUrl(baseURL, url);
      return guard.simulateRequest({
        url: fullUrl,
        method: method || 'GET',
        body: data != null ? JSON.stringify(data) : undefined,
        headers: { ...defaultHeaders, ...config.headers },
        signal: config.signal,
      });
    },
    estimateUploadBytes: estimateByteLength,
  };
}
