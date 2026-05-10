import { apiGet } from './client';
import type { GenreSummary } from './types';

export function listGenres(signal?: AbortSignal) {
  return apiGet<GenreSummary[]>('/api/genres', signal);
}
