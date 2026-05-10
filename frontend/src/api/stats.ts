import { apiGet } from './client';
import type { ArtistStatsResponse, LibraryStatsResponse } from './types';

export function getLibraryStats(signal?: AbortSignal) {
  return apiGet<LibraryStatsResponse>('/api/library/stats', signal);
}

export function getArtistStats(artistId: string, signal?: AbortSignal) {
  return apiGet<ArtistStatsResponse>(`/api/artists/${artistId}/stats`, signal);
}
