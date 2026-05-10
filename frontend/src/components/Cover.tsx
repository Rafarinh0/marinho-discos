import { useEffect, useState, type CSSProperties } from 'react';
import { paletteFor } from '../lib/palette';

//accepts both local album and a search result from the external source
export interface CoverAlbum {
  id?: string;
  externalId?: string | null;
  title: string;
  artist?: { name: string } | null;
  artistName?: string | null;
  releaseDate?: string | null;
  releaseYear?: number | null;
}

interface CoverProps {
  album: CoverAlbum;
  showStamp?: boolean;
  size?: number | 'auto';
}

const MBID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function deriveYear(album: CoverAlbum): string {
  if (album.releaseYear != null) return String(album.releaseYear);
  if (album.releaseDate) return String(album.releaseDate).slice(0, 4);
  return '—';
}

function deriveArtistName(album: CoverAlbum): string {
  return album.artist?.name ?? album.artistName ?? '';
}

function deriveStamp(album: CoverAlbum): string {
  const seed = album.id ?? album.externalId ?? album.title;
  const digits = seed.replace(/[^0-9]/g, '').slice(-3).padStart(3, '0');
  return digits || '001';
}

export function Cover({ album, showStamp = true, size = 'auto' }: CoverProps) {
  const externalId = album.externalId;
  const url =
    externalId && MBID_RE.test(externalId)
      ? `https://coverartarchive.org/release/${externalId}/front-500`
      : null;

  const [failed, setFailed] = useState<boolean>(!url);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setFailed(!url);
    setLoaded(false);
  }, [url]);

  const palette = paletteFor(album.title + (deriveArtistName(album) || ''));
  const styleVars = {
    ['--cover-c1']: palette.c1,
    ['--cover-c2']: palette.c2,
    width: size === 'auto' ? undefined : size,
    height: size === 'auto' ? undefined : size,
  } as CSSProperties;

  return (
    <div className="cover" style={styleVars}>
      {/* Placeholder estilizado, sempre presente atrás do <img> */}
      <div className="cover-inner">
        <div className="cover-meta">
          <span>{deriveArtistName(album).slice(0, 18)}</span>
          {showStamp && <div className="cover-stamp font-mono">{deriveStamp(album)}</div>}
        </div>
        <div className="cover-title">{album.title}</div>
        <div className="cover-meta">
          <span>{deriveYear(album)}</span>
          <span>◐ MD</span>
        </div>
      </div>
      {url && !failed && (
        <img
          src={url}
          alt={`${album.title} — ${deriveArtistName(album)}`}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .35s ease',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
