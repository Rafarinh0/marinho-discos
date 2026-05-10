import { useEffect, useMemo, useState } from 'react';
import { Cover } from './Cover';
import { paletteFor } from '../lib/palette';

export interface HeroAlbum {
  id: string;
  title: string;
  externalId?: string | null;
  artist?: { name: string } | null;
  artistName?: string | null;
  releaseDate?: string | null;
}

interface Props {
  picks: HeroAlbum[];
}

//if picks is empty, the component won't render anything
export function HeroVisual({ picks }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || picks.length < 2) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % picks.length), 2800);
    return () => window.clearInterval(id);
  }, [paused, picks.length]);

  const stack = useMemo(() => {
    if (picks.length === 0) return [];
    return Array.from({ length: Math.min(4, picks.length) }).map(
      (_, k) => picks[(idx + k) % picks.length]
    );
  }, [picks, idx]);

  if (picks.length === 0) return null;

  const recordAlbum = picks[(idx + picks.length - 1) % picks.length];
  const recordPalette = paletteFor(
    recordAlbum.title + (recordAlbum.artist?.name ?? recordAlbum.artistName ?? '')
  );

  const current = picks[idx];
  const stamp = current.id.replace(/[^0-9]/g, '').slice(-3).padStart(3, '0') || '001';
  const artistName = current.artist?.name ?? current.artistName ?? '';

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: 460,
        margin: '0 auto',
        perspective: '1400px',
      }}
    >
      {/* Disco girando atrás */}
      <div
        key={recordAlbum.id}
        className="spin"
        style={{
          position: 'absolute',
          top: '8%',
          right: 0,
          width: '74%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: `radial-gradient(circle at center,
            ${recordPalette.c1} 0 13%,
            #0a0604 13% 14%,
            #1a1208 14% 26%,
            #0a0604 26% 27%,
            #18110a 27% 44%,
            #0a0604 44% 45%,
            #1a1208 45% 62%,
            #0a0604 62% 63%,
            #14100a 63% 100%)`,
          boxShadow: '0 14px 44px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          zIndex: 1,
          transition: 'background 1.2s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6%',
            aspectRatio: 1,
            marginLeft: '-3%',
            marginTop: '-3%',
            background: 'var(--bg)',
            borderRadius: '50%',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* Stack de sleeves */}
      <div
        style={{
          position: 'absolute',
          inset: '6% 22% 6% 0',
          zIndex: 2,
          transformStyle: 'preserve-3d',
        }}
      >
        {stack.map((album, k) => {
          const offsets = [
            { tx: 0, ty: 0, rot: 0, scale: 1, opacity: 1, blur: 0 },
            { tx: 14, ty: 14, rot: -1.5, scale: 0.97, opacity: 1, blur: 0 },
            { tx: 28, ty: 28, rot: -3, scale: 0.94, opacity: 0.9, blur: 0.5 },
            { tx: 42, ty: 42, rot: -4.5, scale: 0.91, opacity: 0.7, blur: 1 },
          ];
          const o = offsets[k];
          return (
            <div
              key={`${album.id}-${idx}-${k}`}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translate(${o.tx}px, ${o.ty}px) rotate(${o.rot}deg) scale(${o.scale})`,
                opacity: o.opacity,
                filter: o.blur ? `blur(${o.blur}px)` : undefined,
                transition:
                  'transform .9s cubic-bezier(.2,.9,.25,1.05), opacity .7s, filter .7s',
                zIndex: 10 - k,
                animation: k === 0 ? 'sleevePull .9s cubic-bezier(.4,.05,.3,1) both' : undefined,
                boxShadow:
                  k === 0
                    ? '0 22px 50px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.25)'
                    : '0 8px 18px rgba(0,0,0,0.3)',
              }}
            >
              <Cover album={album} />
            </div>
          );
        })}
      </div>

      {/* Caption embaixo */}
      <div
        style={{
          position: 'absolute',
          bottom: -8,
          left: 0,
          right: '20%',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.16em' }}>
          ◆ MD-{stamp}
        </div>
        <div
          key={current.id}
          style={{
            animation: 'captionIn .6s ease-out',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(18px, 2.6vw, 24px)',
              lineHeight: 1.05,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
            }}
          >
            {current.title}
          </span>
          {artistName && (
            <span
              className="font-serif italic"
              style={{ fontSize: 'clamp(13px, 1.6vw, 15px)', color: 'var(--ink-2)' }}
            >
              — {artistName}
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sleevePull {
          0%   { transform: translate(-30px, -42px) rotate(-9deg) scale(0.92); opacity: 0; }
          55%  { transform: translate(4px, -6px) rotate(-2deg) scale(1.01); opacity: 1; }
          100% { transform: translate(0, 0) rotate(0) scale(1); opacity: 1; }
        }
        @keyframes captionIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
