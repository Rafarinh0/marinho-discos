import { apiDelete, apiPost, apiPut } from './client';

export function createReview(
  albumId: string,
  body: { rating: number; comment: string | null }
) {
  return apiPost<{ id: string }>(`/api/albums/${albumId}/reviews`, body);
}

export function updateReview(
  reviewId: string,
  body: { rating: number; comment: string | null }
) {
  return apiPut<void>(`/api/reviews/${reviewId}`, body);
}

export function deleteReview(reviewId: string) {
  return apiDelete(`/api/reviews/${reviewId}`);
}
