import { useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useLang } from '../i18n/LangProvider';
import { searchExternalAlbums } from '../api/externalCatalog';
import { listAlbums } from '../api/albums';
import { Cover } from '../components/Cover';
import { HeroVisual, type HeroAlbum } from '../components/HeroVisual';
import { ResultsGrid } from '../components/ResultsGrid';
import { fmtYear } from '../lib/format';
import type { AlbumListItemResponse } from '../api/types';

export function SearchPage() {
  const { t } = useLang();
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';

  return (
    <div className="shell">
      {query ? <SearchResults query={query} /> : <DiscoverHome t={t} />}
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const { t } = useLang();
  const { data, isLoading, error } = useQuery({
    queryKey: ['search-external', query],
    queryFn: ({ signal }) => searchExternalAlbums(query, 20, signal),
    enabled: query.length >= 2,
  });

  const count = data?.length ?? 0;

  return (
    <>
      <div style={{ paddingTop: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          {t(
            `MusicBrainz · ${count} ${count === 1 ? 'result' : 'results'}`,
            `MusicBrainz · ${count} ${count === 1 ? 'resultado' : 'resultados'}`
          )}
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            margin: '0 0 32px',
            lineHeight: 1.05,
          }}
        >
          {t('Searching for', 'Buscando por')}{' '}
          <em style={{ color: 'var(--accent)' }}>"{query}"</em>
        </h1>
      </div>

      {isLoading && <LoadingPlaceholder lang={t} />}
      {error && <ErrorCard message={(error as Error).message} />}
      {!isLoading && !error && (data?.length ?? 0) === 0 && <EmptyResult />}
      {!isLoading && !error && data && data.length > 0 && <ResultsGrid results={data} />}
    </>
  );
}

function DiscoverHome({ t }: { t: (en: string, pt: string) => string }) {
  //fetch first albums from the library to feed the carousel
  const { data: library } = useQuery({
    queryKey: ['library', 'recent'],
    queryFn: ({ signal }) => listAlbums({ page: 1, pageSize: 12 }, signal),
  });

  const albums = library?.items ?? [];
  const heroPicks: HeroAlbum[] = albums.slice(0, 6).map((a) => ({
    id: a.id,
    externalId: a.externalId,
    title: a.title,
    artistName: a.artistName,
    releaseDate: a.releaseDate,
  }));

  return (
    <>
      <Hero heroPicks={heroPicks} t={t} />

      <div className="strip" style={{ margin: '64px 0 56px' }}>
        <span>Side A</span>
        <span>33⅓ RPM</span>
        <span>{t('Cataloged with care', 'Catalogado com carinho')}</span>
        <span>MD-{String(albums.length).padStart(3, '0')}</span>
        <span>{t('Est. 2026', 'Desde 2026')}</span>
        <span>Side B</span>
      </div>

      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: 22, gap: 24, flexWrap: 'wrap' }}
      >
        <div>
          <div className="eyebrow">
            {t('Recently in your library', 'Recentes na sua biblioteca')}
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 36, margin: '6px 0 0', lineHeight: 1 }}
          >
            {t('Worth flipping through', 'Vale folhear')}
          </h2>
        </div>
      </div>

      {albums.length === 0 ? (
        <EmptyLibrary t={t} />
      ) : (
        <LibraryThumbsGrid items={albums} />
      )}
    </>
  );
}

function Hero({
  heroPicks,
  t,
}: {
  heroPicks: HeroAlbum[];
  t: (en: string, pt: string) => string;
}) {
  const navigate = useNavigate();
  const [val, setVal] = useState('');

  return (
    <section
      style={{
        padding: '64px 0 32px',
        display: 'grid',
        gridTemplateColumns: heroPicks.length > 0 ? '1.4fr 1fr' : '1fr',
        gap: 56,
        alignItems: 'center',
      }}
    >
      <div>
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          ◯ {t('A personal record library', 'Uma discoteca pessoal')}
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(40px, 6.4vw, 88px)',
            lineHeight: 0.98,
            margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}
        >
          {t('Every record,', 'Cada disco,')}
          <br />
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
            {t('worth a word.', 'uma palavra.')}
          </em>
        </h1>
        <p
          className="font-serif"
          style={{
            fontSize: 19,
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            maxWidth: 520,
            margin: '0 0 36px',
          }}
        >
          {t(
            'Search millions of releases on MusicBrainz, import them in a click, and rate them honestly on a 1-to-10 scale. No likes, no algorithm — just your liner notes.',
            'Pesquise milhões de lançamentos no MusicBrainz, importe com um clique e dê notas honestas de 1 a 10. Sem curtidas, sem algoritmo — só as suas anotações.'
          )}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = val.trim();
            if (trimmed) navigate(`/?q=${encodeURIComponent(trimmed)}`);
          }}
          className="flex gap-3"
          style={{ maxWidth: 520, alignItems: 'stretch' }}
        >
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={t(
              'Try "Radiohead" or paste a MusicBrainz ID',
              'Tente "Chico Buarque" ou cole um ID do MusicBrainz'
            )}
            className="font-mono"
            style={{
              flex: 1,
              appearance: 'none',
              border: '1px solid var(--rule-2)',
              background: 'var(--bg-2)',
              color: 'var(--ink)',
              padding: '14px 18px',
              borderRadius: 999,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-primary">
            {t('Search', 'Buscar')}
          </button>
        </form>
        <div
          className="flex gap-3 muted font-mono"
          style={{
            marginTop: 20,
            fontSize: 11,
            letterSpacing: '0.06em',
            flexWrap: 'wrap',
          }}
        >
          <span>↩ {t('Press enter to search', 'Pressione enter para buscar')}</span>
        </div>
      </div>

      {heroPicks.length > 0 && <HeroVisual picks={heroPicks} />}
    </section>
  );
}

function LibraryThumbsGrid({ items }: { items: AlbumListItemResponse[] }) {
  const navigate = useNavigate();
  return (
    <div className="library-grid">
      {items.map((a) => (
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

// ─────────────────────────────────────────────────────────────────────────
// States

function LoadingPlaceholder({ lang }: { lang: (en: string, pt: string) => string }): ReactNode {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div className="font-display" style={{ fontSize: 32, marginBottom: 6 }}>
        ◐
      </div>
      <div className="muted">{lang('Searching MusicBrainz…', 'Buscando no MusicBrainz…')}</div>
    </div>
  );
}

function EmptyResult() {
  const { t } = useLang();
  return (
    <div className="card" style={{ textAlign: 'center', padding: '56px 24px' }}>
      <div className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
        —
      </div>
      <div className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
        {t('Nothing in the crate', 'Nada na caixa')}
      </div>
      <p className="muted" style={{ maxWidth: 360, margin: '0 auto' }}>
        {t(
          'Try a different artist, album, or year. MusicBrainz indexes the whole world — keep digging.',
          'Tente outro artista, álbum ou ano. O MusicBrainz indexa o mundo inteiro — continue cavando.'
        )}
      </p>
    </div>
  );
}

function EmptyLibrary({ t }: { t: (en: string, pt: string) => string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '56px 24px' }}>
      <div className="font-display" style={{ fontSize: 36, marginBottom: 8 }}>
        ◯
      </div>
      <div className="font-display" style={{ fontSize: 22, marginBottom: 6 }}>
        {t('Your library is empty', 'Sua biblioteca está vazia')}
      </div>
      <p className="muted" style={{ maxWidth: 360, margin: '0 auto' }}>
        {t(
          'Search for an album above and import it to get started.',
          'Busque um álbum acima e importe pra começar.'
        )}
      </p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  const { t } = useLang();
  return (
    <div className="card" style={{ borderColor: 'var(--accent)' }}>
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>
        {t('Error', 'Erro')}
      </div>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}
