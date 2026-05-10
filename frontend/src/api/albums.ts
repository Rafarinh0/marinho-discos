import { apiGet } from './client';
import type {
  AlbumDetailsResponse,
  AlbumListItemResponse,
  PagedResult,
  ReviewResponse,
} from './types';

export function getAlbumById(id: string, signal?: AbortSignal) {
  return apiGet<AlbumDetailsResponse>(`/api/albums/${id}`, signal);
}

export interface ListAlbumsParams {
  page?: number;
  pageSize?: number;
  artistId?: string;
  genreId?: string;
}

export function listAlbums(params: ListAlbumsParams = {}, signal?: AbortSignal) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.pageSize) q.set('pageSize', String(params.pageSize));
  if (params.artistId) q.set('artistId', params.artistId);
  if (params.genreId) q.set('genreId', params.genreId);
  const suffix = q.toString();
  return apiGet<PagedResult<AlbumListItemResponse>>(
    `/api/albums${suffix ? `?${suffix}` : ''}`,
    signal
  );
}

export function listAlbumReviews(
  albumId: string,
  page = 1,
  pageSize = 10,
  signal?: AbortSignal
) {
  const q = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiGet<PagedResult<ReviewResponse>>(
    `/api/albums/${albumId}/reviews?${q.toString()}`,
    signal
  );
}
