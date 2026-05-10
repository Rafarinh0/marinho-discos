import { apiGet } from './client';
import type { GetArtistResponse } from './types';

export function getArtistById(id: string, signal?: AbortSignal) {
  return apiGet<GetArtistResponse>(`/api/artists/${id}`, signal);
}
