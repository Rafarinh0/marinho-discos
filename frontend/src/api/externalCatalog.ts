import { apiGet, apiPost } from './client';
import type {
  CreateReviewForExternalAlbumResponse,
  ExternalAlbumSummary,
} from './types';

export function searchExternalAlbums(
  query: string,
  limit = 12,
  signal?: AbortSignal
) {
  const encoded = encodeURIComponent(query);
  return apiGet<ExternalAlbumSummary[]>(
    `/api/external-catalog/albums?query=${encoded}&limit=${limit}`,
    signal
  );
}

export function importExternalAlbum(externalId: string) {
  return apiPost<{ id: string }>(
    `/api/external-catalog/albums/${externalId}/import`
  );
}

export function createReviewForExternalAlbum(
  externalId: string,
  body: { rating: number; comment: string | null }
) {
  return apiPost<CreateReviewForExternalAlbumResponse>(
    `/api/external-catalog/albums/${externalId}/reviews`,
    body
  );
}
