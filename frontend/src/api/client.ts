import type { ApiError } from './types';

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export class ApiException extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    return (await res.json()) as ApiError;
  } catch {
    return { code: 'http_error', message: `HTTP ${res.status}` };
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal });
  if (!res.ok) throw new ApiException(res.status, await parseError(res));
  return res.json() as Promise<T>;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body?: B,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!res.ok) throw new ApiException(res.status, await parseError(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiPut<T, B = unknown>(
  path: string,
  body: B,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new ApiException(res.status, await parseError(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiDelete(path: string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE', signal });
  if (!res.ok) throw new ApiException(res.status, await parseError(res));
}
