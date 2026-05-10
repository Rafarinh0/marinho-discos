import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useLang } from '../i18n/LangProvider';
import { getArtistById } from '../api/artists';
import { listAlbums } from '../api/albums';
import { Cover } from '../components/Cover';
import { fmtYear } from '../lib/format';
import { useArtistEnrichment, type ArtistEnrichment } from '../lib/artistImage';
import type { AlbumListItemResponse } from '../api/types';

export function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const navigate = useNavigate();

  const artistQuery = useQuery({
    queryKey: ['artist', id],
    queryFn: ({ signal }) => getArtistById(id!, signal),
    enabled: !!id,
  });

  const albumsQuery = useQuery({
    queryKey: ['library', { artistId: id }],
    queryFn: ({ signal }) =>
      listAlbums({ page: 1, pageSize: 200, artistId: id }, signal),
    enabled: !!id,
  });

  const albums = albumsQuery.data?.items ?? [];

  const sorted = useMemo(() => {
    return [...albums].sort((a, b) => {
      const aT = a.releaseDate ? new Date(a.releaseDate).getTime() : -Infinity;
      const bT = b.releaseDate ? new Date(b.releaseDate).getTime() : -Infinity;
      return bT - aT;
    });
  }, [albums]);

  const stats = useMemo(() => {
    const tracks = albums.reduce((s, a) => s + a.trackCount, 0);
    const years = albums
      .map((a) => (a.releaseDate ? parseInt(a.releaseDate.slice(0, 4), 10) : null))
      .filter((y): y is number => y !== null && !Number.isNaN(y));
    const yearSpan =
      years.length === 0
        ? '—'
        : years.length === 1 || Math.min(...years) === Math.max(...years)
        ? String(years[0])
        : `${Math.min(...years)} – ${Math.max(...years)}`;
    return { tracks, yearSpan };
  }, [albums]);

  if (artistQuery.isLoading || albumsQuery.isLoading) return <Loading />;
  if (artistQuery.error)
    return <ErrorView message={(artistQuery.error as Error).message} />;
  if (!artistQuery.data) return <NotFoundView />;

  const artist = artistQuery.data;

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

      <ArtistHero
        artist={artist}
        yearSpan={stats.yearSpan}
        albumsCount={albums.length}
        tracksCount={stats.tracks}
      />


      <hr className="rule rule-thick" />

      {/* Discography */}
      <section style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          ◐ {t('Discography', 'Discografia')}
        </div>
        {sorted.length === 0 ? (
          <EmptyDiscography />
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {sorted.map((a) => (
              <DiscographyRow key={a.id} album={a} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponentes

interface ArtistHeroProps {
  artist: { id: string; name: string; externalId: string | null };
  yearSpan: string;
  albumsCount: number;
  tracksCount: number;
}

function ArtistHero({ artist, yearSpan, albumsCount, tracksCount }: ArtistHeroProps) {
  const { t } = useLang();
  const { data: enrichment } = useArtistEnrichment(artist.externalId);

  // Year span: prioriza Wikidata (mais acurado), fallback pra derivado dos álbuns
  const headerYears = formatHeaderYears(enrichment, t) ?? yearSpan;
  const imageUrl = enrichment?.imageUrl ?? null;

  return (
    <>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 40,
          alignItems: 'flex-end',
          marginBottom: 24,
        }}
      >
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 10 }}>
            ▸ {t('Artist', 'Artista')} · {headerYears}
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: imageUrl ? 'clamp(48px, 7vw, 104px)' : 'clamp(56px, 9vw, 132px)',
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: '-0.025em',
              textWrap: 'balance' as const,
            }}
          >
            {artist.name}
          </h1>
          {enrichment?.shortDescription && (
            <div
              className="font-serif italic"
              style={{
                marginTop: 14,
                fontSize: 18,
                color: 'var(--ink-2)',
                textTransform: 'lowercase',
                letterSpacing: '0.005em',
              }}
            >
              {enrichment.shortDescription}
            </div>
          )}
          <div className="flex gap-8" style={{ marginTop: 28, flexWrap: 'wrap' }}>
            <Stat label={t('Albums in library', 'Álbuns na biblioteca')} value={albumsCount} />
            <Stat label={t('Tracks', 'Faixas')} value={tracksCount} accent />
          </div>
        </div>

        {imageUrl && (
          <div
            style={{
              flex: '0 0 auto',
              width: 'min(240px, 100%)',
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: 12,
              background: 'var(--bg-3)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <img
              src={imageUrl}
              alt={artist.name}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}
      </header>

      {enrichment?.bio && (
        <Bio
          text={enrichment.bio}
          wikipediaUrl={enrichment.wikipediaUrl}
        />
      )}
    </>
  );
}

function Bio({ text, wikipediaUrl }: { text: string; wikipediaUrl: string | null }) {
  const { t } = useLang();
  const truncated = text.length > 400 ? text.slice(0, 400).replace(/\s+\S*$/, '') + '…' : text;

  return (
    <div
      className="font-serif"
      style={{
        marginBottom: 40,
        maxWidth: 720,
        fontSize: 17,
        lineHeight: 1.55,
        color: 'var(--ink-2)',
        textWrap: 'pretty' as const,
      }}
    >
      {truncated}
      {wikipediaUrl && (
        <>
          {' '}
          <a
            href={wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono"
            style={{
              color: 'var(--accent)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid color-mix(in oklab, var(--accent) 50%, transparent)',
              paddingBottom: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {t('Read on Wikipedia ↗', 'Ver na Wikipedia ↗')}
          </a>
        </>
      )}
    </div>
  );
}

// Formata "1985 – present" / "1968 – 1991" / "1968 –"
function formatHeaderYears(
  e: ArtistEnrichment | undefined,
  t: (en: string, pt: string) => string
): string | null {
  if (!e) return null;
  // Banda
  if (e.inception != null) {
    if (e.dissolution != null) return `${e.inception} – ${e.dissolution}`;
    return `${e.inception} – ${t('present', 'presente')}`;
  }
  // Solo
  if (e.birth != null) {
    if (e.death != null) return `${e.birth} – ${e.death}`;
    return `b. ${e.birth}`;
  }
  return null;
}

function DiscographyRow({ album }: { album: AlbumListItemResponse }) {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <li
      onClick={() => navigate(`/albums/${album.id}`)}
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr auto',
        gap: 22,
        alignItems: 'center',
        padding: '18px 12px',
        margin: '0 -12px',
        borderBottom: '1px solid var(--rule)',
        cursor: 'pointer',
        transition: 'background .15s',
        borderRadius: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--rule)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: 88 }}>
        <Cover album={album} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          className="font-display"
          style={{ fontSize: 28, lineHeight: 1.1, textWrap: 'balance' as const }}
        >
          {album.title}
        </div>
        <div
          className="font-mono muted"
          style={{
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          {fmtYear(album.releaseDate)} · {album.trackCount} {t('tracks', 'faixas')}
        </div>
      </div>
      <div
        className="font-mono muted"
        style={{ fontSize: 18, lineHeight: 1, paddingRight: 8 }}
      >
        ›
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className="font-display tabular"
        style={{
          fontSize: 36,
          lineHeight: 1,
          color: accent ? 'var(--accent)' : 'var(--ink)',
        }}
      >
        {value}
      </div>
      <div
        className="font-mono muted"
        style={{
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// States

function Loading() {
  const { t } = useLang();
  return (
    <div className="shell" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: 48, marginBottom: 8 }}>
        ◐
      </div>
      <div className="muted">{t('Loading artist…', 'Carregando artista…')}</div>
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
        {t('Artist not found', 'Artista não encontrado')}
      </h2>
      <button className="btn btn-ghost" onClick={() => navigate('/library')}>
        {t('Back to library', 'Voltar à biblioteca')}
      </button>
    </div>
  );
}

function EmptyDiscography() {
  const { t } = useLang();
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div className="muted">
        {t(
          'No albums by this artist in your library yet.',
          'Nenhum álbum desse artista na sua biblioteca ainda.'
        )}
      </div>
    </div>
  );
}
