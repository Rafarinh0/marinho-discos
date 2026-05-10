export interface ArtistSummary {
  id: string;
  name: string;
}

export interface GenreSummary {
  id: string;
  name: string;
}

export interface TrackResponse {
  id: string;
  title: string;
  durationSeconds: number;
  trackNumber: number;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface AlbumDetailsResponse {
  id: string;
  externalId: string | null;
  title: string;
  releaseDate: string;
  durationSeconds: number;
  artist: ArtistSummary;
  genres: GenreSummary[];
  tracks: TrackResponse[];
  reviews: ReviewResponse[];
  averageRating: number | null;
  reviewCount: number;
}

export interface AlbumListItemResponse {
  id: string;
  externalId: string | null;
  title: string;
  releaseDate: string;
  artistName: string;
  trackCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ExternalAlbumSummary {
  externalId: string;
  title: string;
  artistName: string;
  artistExternalId: string | null;
  releaseYear: number | null;
}

export interface CreateReviewForExternalAlbumResponse {
  albumId: string;
  reviewId: string;
}

export interface GetArtistResponse {
  id: string;
  name: string;
}

export interface ApiError {
  code: string;
  message: string;
  errors?: Array<{ property: string; error: string }>;
}
