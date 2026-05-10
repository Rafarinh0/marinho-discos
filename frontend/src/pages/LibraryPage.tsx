import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useLang } from '../i18n/LangProvider';
import { listAlbums } from '../api/albums';
import { listGenres } from '../api/genres';
import { Cover } from '../components/Cover';
import { Pagination, type PageSize } from '../components/Pagination';
import { fmtYear } from '../lib/format';
import type { AlbumListItemResponse, GenreSummary } from '../api/types';

type Layout = 'grid' | 'list';
type Sort = 'artist' | 'year-new' | 'year-old' | 'title';

export function LibraryPage() {
  const { t } = useLang();

  const [layout, setLayout] = useState<Layout>('grid');
  const [sort, setSort] = useState<Sort>('year-new');
  const [genreId, setGenreId] = useState<string | undefined>(undefined);
  const [yearFilter, setYearFilter] = useState<string>('');

  // Pagination state — client-side
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(20);

  // Genres pra filtro
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: ({ signal }) => listGenres(signal),
  });

  // Single fetch — alto pageSize cobre qualquer biblioteca pessoal
  const { data: albumsResp, isLoading } = useQuery({
    queryKey: ['library', { genreId }],
    queryFn: ({ signal }) =>
      listAlbums({ page: 1, pageSize: 500, genreId }, signal),
  });

  const allAlbums = albumsResp?.items ?? [];

  // Reset página quando filtros/sort/pageSize mudam
  useEffect(() => {
    setPage(1);
  }, [genreId, yearFilter, sort, pageSize]);

  // Filtro de ano (client-side)
  const filtered = useMemo(() => {
    const yearTrim = yearFilter.trim();
    if (!yearTrim) return allAlbums;
    return allAlbums.filter((a) => a.releaseDate?.startsWith(yearTrim) ?? false);
  }, [allAlbums, yearFilter]);

  // Ordenação client-side
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'artist') arr.sort((a, b) => a.artistName.localeCompare(b.artistName));
    else if (sort === 'title') arr.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'year-new')
      arr.sort((a, b) => {
        const aT = a.releaseDate ? new Date(a.releaseDate).getTime() : -Infinity;
        const bT = b.releaseDate ? new Date(b.releaseDate).getTime() : -Infinity;
        return bT - aT;
      });
    else if (sort === 'year-old')
      arr.sort((a, b) => {
        const aT = a.releaseDate ? new Date(a.releaseDate).getTime() : Infinity;
        const bT = b.releaseDate ? new Date(b.releaseDate).getTime() : Infinity;
        return aT - bT;
      });
    return arr;
  }, [filtered, sort]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const tracks = filtered.reduce((s, a) => s + a.trackCount, 0);
    return { total, tracks };
  }, [filtered]);

  // Slice paginado
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  return (
    <div className="shell" style={{ paddingTop: 32 }}>
      <header style={{ marginBottom: 36 }}>
        <div className="eyebrow">◐ {t('Personal collection', 'Coleção pessoal')}</div>
        <div
          className="flex items-baseline justify-between"
          style={{ gap: 32, flexWrap: 'wrap', marginTop: 6 }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {t('My library', 'Minha biblioteca')}
          </h1>
          <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
            <Stat label={t('Albums', 'Álbuns')} value={stats.total} />
            <Stat label={t('Tracks', 'Faixas')} value={stats.tracks} accent />
          </div>
        </div>
      </header>

      <Filters
        sort={sort}
        onSortChange={setSort}
        layout={layout}
        onLayoutChange={setLayout}
        genres={genres}
        genreId={genreId}
        onGenreChange={setGenreId}
        yearFilter={yearFilter}
        onYearChange={setYearFilter}
        count={sorted.length}
      />

      {isLoading ? (
        <Loading />
      ) : sorted.length === 0 ? (
        <EmptyState filtered={!!(genreId || yearFilter)} />
      ) : (
        <>
          {layout === 'grid' ? (
            <GridView albums={paginated} />
          ) : (
            <ListView albums={paginated} />
          )}
          <Pagination
            page={page}
            pageSize={pageSize}
            total={sorted.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Stats

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
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Filters

interface FiltersProps {
  sort: Sort;
  onSortChange: (s: Sort) => void;
  layout: Layout;
  onLayoutChange: (l: Layout) => void;
  genres: GenreSummary[];
  genreId?: string;
  onGenreChange: (id?: string) => void;
  yearFilter: string;
  onYearChange: (y: string) => void;
  count: number;
}

function Filters({
  sort,
  onSortChange,
  layout,
  onLayoutChange,
  genres,
  genreId,
  onGenreChange,
  yearFilter,
  onYearChange,
  count,
}: FiltersProps) {
  const { t } = useLang();

  const sortOptions: Array<[Sort, string]> = [
    ['year-new', t('Newest first', 'Mais novos')],
    ['year-old', t('Oldest first', 'Mais antigos')],
    ['artist', t('Artist A→Z', 'Artista A→Z')],
    ['title', t('Title A→Z', 'Título A→Z')],
  ];

  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: 28, gap: 16, flexWrap: 'wrap' }}
    >
      <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
        {sortOptions.map(([k, label]) => (
          <button
            key={k}
            className="chip"
            onClick={() => onSortChange(k)}
            style={{
              cursor: 'pointer',
              background:
                sort === k
                  ? 'color-mix(in oklab, var(--accent) 14%, transparent)'
                  : undefined,
              borderColor:
                sort === k
                  ? 'color-mix(in oklab, var(--accent) 50%, transparent)'
                  : undefined,
              color: sort === k ? 'var(--accent)' : undefined,
            }}
          >
            {label}
          </button>
        ))}

        {/* Genre dropdown disfarçado de chip */}
        <select
          value={genreId ?? ''}
          onChange={(e) => onGenreChange(e.target.value || undefined)}
          className="chip"
          style={{
            cursor: 'pointer',
            appearance: 'none',
            background: genreId
              ? 'color-mix(in oklab, var(--accent) 14%, transparent)'
              : 'var(--bg-2)',
            borderColor: genreId
              ? 'color-mix(in oklab, var(--accent) 50%, transparent)'
              : undefined,
            color: genreId ? 'var(--accent)' : undefined,
            paddingRight: 22,
          }}
        >
          <option value="">{t('All genres', 'Todos os gêneros')}</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Year input */}
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder={t('Year', 'Ano')}
          className="chip font-mono"
          style={{
            width: 88,
            background: yearFilter
              ? 'color-mix(in oklab, var(--accent) 14%, transparent)'
              : 'var(--bg-2)',
            borderColor: yearFilter
              ? 'color-mix(in oklab, var(--accent) 50%, transparent)'
              : undefined,
            color: yearFilter ? 'var(--accent)' : 'var(--ink-2)',
            outline: 'none',
            textAlign: 'center',
          }}
        />
      </div>

      <div className="flex gap-3 items-center">
        <div
          className="font-mono muted"
          style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {count} {t(count === 1 ? 'record' : 'records', count === 1 ? 'disco' : 'discos')}
        </div>
        <div
          className="flex"
          style={{
            border: '1px solid var(--rule-2)',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          {(['grid', 'list'] as Layout[]).map((l) => (
            <button
              key={l}
              onClick={() => onLayoutChange(l)}
              className="font-mono"
              style={{
                appearance: 'none',
                border: 0,
                background: layout === l ? 'var(--accent)' : 'transparent',
                color: layout === l ? 'var(--accent-ink)' : 'var(--ink-2)',
                padding: '6px 14px',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              aria-label={l}
            >
              {l === 'grid' ? '▦' : '☰'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Views

function GridView({ albums }: { albums: AlbumListItemResponse[] }) {
  const navigate = useNavigate();
  return (
    <div className="library-grid">
      {albums.map((a) => (
        <div
          key={a.id}
          className="cover-card"
          onClick={() => navigate(`/albums/${a.id}`)}
        >
          <Cover album={a} />
          <div style={{ marginTop: 12 }}>
            <div
              className="font-display"
              style={{ fontSize: 18, lineHeight: 1.15, textWrap: 'balance' as const }}
            >
              {a.title}
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
              {a.artistName} · {fmtYear(a.releaseDate)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({ albums }: { albums: AlbumListItemResponse[] }) {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <div className="library-list">
      {albums.map((a) => (
        <div
          key={a.id}
          className="row"
          onClick={() => navigate(`/albums/${a.id}`)}
        >
          <Cover album={a} />
          <div style={{ minWidth: 0 }}>
            <div
              className="font-display"
              style={{ fontSize: 20, lineHeight: 1.1, textWrap: 'balance' as const }}
            >
              {a.title}
            </div>
            <div
              className="font-mono muted"
              style={{
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: 3,
              }}
            >
              {a.artistName} · {fmtYear(a.releaseDate)}
            </div>
          </div>
          <div
            className="font-mono muted tabular"
            style={{
              fontSize: 11,
              letterSpacing: '0.06em',
              minWidth: 60,
              textAlign: 'right',
            }}
          >
            {a.trackCount} {t('tracks', 'faixas')}
          </div>
          <div style={{ minWidth: 56, textAlign: 'right' }}>
            <span
              className="font-mono muted"
              style={{ fontSize: 11, letterSpacing: '0.06em' }}
            >
              ▸
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// States

function Loading() {
  const { t } = useLang();
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
        ◐
      </div>
      <div className="muted">{t('Loading library…', 'Carregando biblioteca…')}</div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  const { t } = useLang();
  return (
    <div className="card" style={{ textAlign: 'center', padding: '56px 24px' }}>
      <div className="font-display" style={{ fontSize: 36, marginBottom: 8 }}>
        ◯
      </div>
      <div className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
        {filtered
          ? t('Nothing matches these filters', 'Nada bate com esses filtros')
          : t('Your library is empty', 'Sua biblioteca está vazia')}
      </div>
      <p className="muted" style={{ maxWidth: 360, margin: '0 auto' }}>
        {filtered
          ? t('Try clearing some filters above.', 'Tente limpar alguns filtros acima.')
          : t(
              'Search for an album from the home page and import it to get started.',
              'Busque um álbum na página inicial e importe pra começar.'
            )}
      </p>
    </div>
  );
}
