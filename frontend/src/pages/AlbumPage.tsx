import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLang } from '../i18n/LangProvider';
import { getAlbumById } from '../api/albums';
import { createReview, deleteReview, updateReview } from '../api/reviews';
import { Cover } from '../components/Cover';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewModal } from '../components/ReviewModal';
import { Skeleton } from '../components/Skeleton';
import { fmtTime, fmtTotalTime, fmtYear, ratingBuckets } from '../lib/format';
import type { AlbumDetailsResponse, ReviewResponse } from '../api/types';

type ReviewingState =
  | { mode: 'create' }
  | { mode: 'edit'; review: ReviewResponse }
  | null;

export function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewing, setReviewing] = useState<ReviewingState>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const { data: album, isLoading, error } = useQuery({
    queryKey: ['album', id],
    queryFn: ({ signal }) => getAlbumById(id!, signal),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['album', id] });
    queryClient.invalidateQueries({ queryKey: ['library'] });
  };

  const createMutation = useMutation({
    mutationFn: (body: { rating: number; comment: string | null }) =>
      createReview(id!, body),
    onSuccess: () => {
      invalidate();
      setReviewing(null);
      setModalError(null);
    },
    onError: (err: Error) => setModalError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      reviewId,
      body,
    }: {
      reviewId: string;
      body: { rating: number; comment: string | null };
    }) => updateReview(reviewId, body),
    onSuccess: () => {
      invalidate();
      setReviewing(null);
      setModalError(null);
    },
    onError: (err: Error) => setModalError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => invalidate(),
  });

  const handleSave = (data: { rating: number; comment: string | null }) => {
    if (!reviewing) return;
    if (reviewing.mode === 'create') {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ reviewId: reviewing.review.id, body: data });
    }
  };

  const handleDelete = (review: ReviewResponse) => {
    if (!window.confirm(t('Delete this review?', 'Apagar esta review?'))) return;
    deleteMutation.mutate(review.id);
  };

  const closeModal = () => {
    if (createMutation.isPending || updateMutation.isPending) return;
    setReviewing(null);
    setModalError(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorView message={(error as Error).message} />;
  if (!album) return <NotFoundView />;

  const isSavingModal = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="shell" style={{ paddingTop: 24 }}>
      <button
        className="font-mono muted"
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: 0,
          padding: '8px 0',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        ← {t('Back', 'Voltar')}
      </button>

      <Hero album={album} />

      <hr className="rule rule-thick" />

      <Score album={album} onWriteReview={() => setReviewing({ mode: 'create' })} />

      <hr className="rule" />

      <ContentTwoColumns
        album={album}
        onWriteReview={() => setReviewing({ mode: 'create' })}
        onEditReview={(r) => setReviewing({ mode: 'edit', review: r })}
        onDeleteReview={handleDelete}
      />

      {reviewing && (
        <ReviewModal
          album={album}
          existing={reviewing.mode === 'edit' ? reviewing.review : null}
          onSave={handleSave}
          onClose={closeModal}
          isSaving={isSavingModal}
          errorMessage={modalError}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero — cover + meta

function Hero({ album }: { album: AlbumDetailsResponse }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const year = fmtYear(album.releaseDate);

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 380px) 1fr',
        gap: 56,
        alignItems: 'flex-end',
        marginBottom: 48,
      }}
    >
      <div style={{ position: 'relative' }}>
        <Cover album={album} />
        <div
          style={{
            position: 'absolute',
            top: -14,
            right: -14,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            padding: '6px 10px',
            borderRadius: 999,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            transform: 'rotate(4deg)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          ◆ MD ORIGINAL PRESS
        </div>
      </div>

      <div>
        <div
          className="eyebrow"
          style={{ marginBottom: 12, color: 'var(--accent)' }}
        >
          ▸ {album.genres[0]?.name ?? t('Album', 'Álbum')}
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(40px, 6vw, 84px)',
            lineHeight: 0.96,
            margin: '0 0 18px',
            letterSpacing: '-0.02em',
            textWrap: 'balance' as const,
          }}
        >
          {album.title}
        </h1>
        <div
          className="font-serif"
          style={{ fontSize: 22, lineHeight: 1.3, marginBottom: 28 }}
        >
          {t('by', 'por')}{' '}
          <em
            onClick={() => navigate(`/artists/${album.artist.id}`)}
            style={{
              color: 'var(--accent)',
              cursor: 'pointer',
              borderBottom: '1px dashed color-mix(in oklab, var(--accent) 50%, transparent)',
              paddingBottom: 1,
              fontStyle: 'italic',
            }}
            title={t('See more by this artist', 'Ver mais deste artista')}
          >
            {album.artist.name}
          </em>
        </div>

        <dl
          className="font-mono"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '16px 24px',
            margin: 0,
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <Meta label={t('Released', 'Lançado')} value={year} />
          <Meta label={t('Tracks', 'Faixas')} value={String(album.tracks.length)} />
          <Meta
            label={t('Runtime', 'Duração')}
            value={fmtTotalTime(album.durationSeconds, 'en')}
          />
          {album.externalId && (
            <Meta label="MBID" value={album.externalId.slice(0, 8) + '…'} mono />
          )}
        </dl>

        {album.genres.length > 0 && (
          <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 22 }}>
            {album.genres.map((g) => (
              <span key={g.id} className="chip">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div style={{ color: 'var(--ink-3)', fontSize: 10, fontWeight: 500 }}>{label}</div>
      <div
        style={{
          color: 'var(--ink)',
          fontSize: 13,
          marginTop: 4,
          fontFamily: mono ? 'JetBrains Mono, monospace' : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Score block

function Score({
  album,
  onWriteReview,
}: {
  album: AlbumDetailsResponse;
  onWriteReview: () => void;
}) {
  const { t } = useLang();
  const buckets = ratingBuckets(album.reviews);
  const maxBucket = Math.max(1, ...buckets);
  const avg = album.averageRating;

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 280px) 1fr auto',
        gap: 48,
        alignItems: 'center',
        padding: '20px 0 36px',
      }}
    >
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          {t('Average rating', 'Nota média')}
        </div>
        {avg != null ? (
          <>
            <div className="score">
              {Math.floor(avg)}
              <span className="score-decimal">
                .{((avg * 10) % 10).toFixed(0)}
              </span>
              <span
                className="font-mono muted"
                style={{ fontSize: 13, marginLeft: 6, letterSpacing: '0.08em' }}
              >
                / 10
              </span>
            </div>
            <div
              className="font-mono muted"
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 6,
              }}
            >
              {album.reviewCount} {album.reviewCount === 1 ? 'review' : 'reviews'}
            </div>
          </>
        ) : (
          <div
            className="font-display"
            style={{ fontSize: 56, color: 'var(--ink-3)', lineHeight: 1 }}
          >
            —
          </div>
        )}
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          {t('Distribution', 'Distribuição')}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 56 }}>
          {buckets.map((count, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: `${(count / maxBucket) * 100}%`,
                  minHeight: count ? 3 : 0,
                  background: count ? 'var(--accent)' : 'var(--rule-2)',
                  borderRadius: '2px 2px 0 0',
                  transition: 'height .3s',
                }}
              />
              <div className="font-mono muted" style={{ fontSize: 9 }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={onWriteReview}>
        ✎ {t('Write a review', 'Escrever review')}
      </button>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tracklist + Reviews

function ContentTwoColumns({
  album,
  onWriteReview,
  onEditReview,
  onDeleteReview,
}: {
  album: AlbumDetailsResponse;
  onWriteReview: () => void;
  onEditReview: (r: ReviewResponse) => void;
  onDeleteReview: (r: ReviewResponse) => void;
}) {
  const { t } = useLang();

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: 56,
        marginTop: 24,
      }}
    >
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          ◐ {t('Tracklist', 'Faixas')}
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {album.tracks.map((tr) => (
            <li
              key={tr.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto',
                gap: 12,
                alignItems: 'baseline',
                padding: '10px 0',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <span className="font-mono muted tabular" style={{ fontSize: 11 }}>
                {String(tr.trackNumber).padStart(2, '0')}
              </span>
              <span className="font-serif" style={{ fontSize: 16, lineHeight: 1.3 }}>
                {tr.title}
              </span>
              <span className="font-mono muted tabular" style={{ fontSize: 11 }}>
                {fmtTime(tr.durationSeconds)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <div className="flex justify-between items-baseline" style={{ marginBottom: 18 }}>
          <div>
            <div className="eyebrow">◐ {t('Reviews', 'Reviews')}</div>
            <h3
              className="font-display"
              style={{ fontSize: 28, margin: '4px 0 0', lineHeight: 1 }}
            >
              {album.reviews.length
                ? t('What I thought', 'O que achei')
                : t('Be the first to write one', 'Seja o primeiro a escrever uma')}
            </h3>
          </div>
        </div>

        {album.reviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div
              className="font-display muted"
              style={{ fontSize: 40, marginBottom: 4 }}
            >
              ?
            </div>
            <div className="muted" style={{ marginBottom: 16 }}>
              {t('No words for this one yet.', 'Ainda sem palavras sobre este.')}
            </div>
            <button className="btn btn-primary" onClick={onWriteReview}>
              {t('Write the first review', 'Escrever o primeiro review')}
            </button>
          </div>
        ) : (
          <div className="flex-col gap-4">
            {[...album.reviews]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              .map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  onEdit={() => onEditReview(r)}
                  onDelete={() => onDeleteReview(r)}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// States

function Loading() {
  return (
    <div className="shell" style={{ paddingTop: 24 }}>
      <Skeleton width={120} height={14} radius={4} style={{ marginBottom: 24 }} />

      {/* Hero: cover + meta */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) 1fr',
          gap: 56,
          alignItems: 'flex-end',
          marginBottom: 48,
        }}
      >
        <Skeleton aspectRatio="1" radius={4} />
        <div>
          <Skeleton width={80} height={12} radius={4} style={{ marginBottom: 16 }} />
          <Skeleton width="80%" height={72} radius={6} style={{ marginBottom: 18 }} />
          <Skeleton width={220} height={22} radius={4} style={{ marginBottom: 28 }} />
          <div style={{ display: 'flex', gap: 24, marginBottom: 22 }}>
            <Skeleton width={80} height={36} radius={4} />
            <Skeleton width={80} height={36} radius={4} />
            <Skeleton width={80} height={36} radius={4} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Skeleton width={70} height={26} radius={999} />
            <Skeleton width={70} height={26} radius={999} />
          </div>
        </div>
      </section>

      <hr className="rule rule-thick" />

      {/* Score */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr auto',
          gap: 48,
          alignItems: 'center',
          padding: '20px 0 36px',
        }}
      >
        <Skeleton width={150} height={70} radius={6} />
        <Skeleton height={56} radius={4} />
        <Skeleton width={160} height={44} radius={999} />
      </section>

      <hr className="rule" />

      {/* Tracklist + reviews */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: 56,
          marginTop: 24,
        }}
      >
        <div>
          <Skeleton width={80} height={12} radius={4} style={{ marginBottom: 14 }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              height={36}
              radius={4}
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
        <div>
          <Skeleton width={120} height={12} radius={4} style={{ marginBottom: 14 }} />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={i}
              height={140}
              radius={14}
              style={{ marginBottom: 16 }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  const { t } = useLang();
  return (
    <div className="shell" style={{ paddingTop: 80 }}>
      <div className="card" style={{ borderColor: 'var(--accent)' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>
          {t('Error', 'Erro')}
        </div>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

function NotFoundView() {
  const { t } = useLang();
  const navigate = useNavigate();
  return (
    <div className="shell" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: 64, marginBottom: 12 }}>
        —
      </div>
      <h2 className="font-display" style={{ fontSize: 28, margin: '0 0 16px' }}>
        {t('Album not found', 'Álbum não encontrado')}
      </h2>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>
        {t('Back to discover', 'Voltar a descobrir')}
      </button>
    </div>
  );
}
