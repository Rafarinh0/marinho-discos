import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangProvider';
import { Cover } from './Cover';
import { fmtYear } from '../lib/format';
import type { AlbumDetailsResponse, ReviewResponse } from '../api/types';

interface Props {
  album: AlbumDetailsResponse;
  existing?: ReviewResponse | null;
  onSave: (data: { rating: number; comment: string | null }) => void;
  onClose: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
}

const MOOD_EN = [
  '—',
  'unlistenable',
  'bad',
  'meh',
  'average',
  'fine',
  'good',
  'great',
  'excellent',
  'brilliant',
  'masterpiece',
];
const MOOD_PT = [
  '—',
  'descartável',
  'fraco',
  'sofrível',
  'mediano',
  'ok',
  'bom',
  'ótimo',
  'excelente',
  'genial',
  'obra-prima',
];

export function ReviewModal({
  album,
  existing,
  onSave,
  onClose,
  isSaving = false,
  errorMessage = null,
}: Props) {
  const { t, lang } = useLang();
  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [comment, setComment] = useState<string>(existing?.comment ?? '');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const display = hoverRating ?? rating;
  const moodLabel = (lang === 'pt' ? MOOD_PT : MOOD_EN)[display] ?? '';

  const submit = () => {
    if (!rating) return;
    onSave({ rating, comment: comment.trim() || null });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--rule)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ width: 44, height: 44, flexShrink: 0 }}>
            <Cover album={album} showStamp={false} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="font-display"
              style={{
                fontSize: 18,
                lineHeight: 1.1,
                marginBottom: 2,
                textWrap: 'balance' as const,
              }}
            >
              {existing ? t('Edit your review of', 'Editar review de') : t('Review', 'Review')}{' '}
              {album.title}
            </div>
            <div
              className="font-mono muted"
              style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {album.artist.name} · {fmtYear(album.releaseDate)}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('Close', 'Fechar')}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--ink-3)',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
            }}
          >
            ✕
          </button>
        </header>

        <div style={{ padding: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {t('Your rating', 'Sua nota')}
          </div>
          <div className="flex items-baseline gap-3" style={{ marginBottom: 14 }}>
            <div
              className="font-display tabular"
              style={{
                fontSize: 64,
                lineHeight: 1,
                color: display ? 'var(--accent)' : 'var(--ink-4)',
              }}
            >
              {display || '—'}
            </div>
            <div className="font-mono muted" style={{ fontSize: 12, letterSpacing: '0.08em' }}>
              / 10
            </div>
            <div
              className="font-serif italic"
              style={{
                fontSize: 18,
                color: 'var(--ink-2)',
                marginLeft: 'auto',
                textAlign: 'right',
              }}
            >
              {moodLabel}
            </div>
          </div>
          <div
            className="rating-bar interactive"
            style={{ ['--bar-h' as string]: '32px', marginBottom: 24 } as React.CSSProperties}
            onMouseLeave={() => setHoverRating(null)}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <i
                key={i}
                data-on={i < display ? '1' : '0'}
                style={{ width: 'clamp(20px, 4.5vw, 36px)' }}
                onMouseEnter={() => setHoverRating(i + 1)}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>

          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {t('Your words', 'Suas palavras')}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(
              'What did you think? Optional, but encouraged.',
              'O que você achou? Opcional, mas recomendado.'
            )}
            rows={6}
            className="font-serif"
            style={{
              width: '100%',
              resize: 'vertical',
              minHeight: 120,
              padding: '14px 16px',
              border: '1px solid var(--rule-2)',
              borderRadius: 10,
              background: 'var(--bg-2)',
              color: 'var(--ink)',
              fontSize: 16,
              lineHeight: 1.5,
              outline: 'none',
            }}
          />
          <div
            className="font-mono muted"
            style={{
              fontSize: 10,
              letterSpacing: '0.06em',
              marginTop: 6,
              textAlign: 'right',
            }}
          >
            {comment.length} {t('chars', 'caracteres')}
          </div>

          {errorMessage && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                border: '1px solid var(--accent)',
                borderRadius: 8,
                color: 'var(--accent)',
                fontSize: 13,
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>

        <footer
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn btn-ghost" onClick={onClose} disabled={isSaving}>
            {t('Cancel', 'Cancelar')}
          </button>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={!rating || isSaving}
            style={{
              opacity: rating && !isSaving ? 1 : 0.4,
              pointerEvents: rating && !isSaving ? 'auto' : 'none',
            }}
          >
            {isSaving
              ? t('Saving…', 'Salvando…')
              : existing
              ? t('Save changes', 'Salvar alterações')
              : t('Publish review', 'Publicar review')}
          </button>
        </footer>
      </div>
    </div>
  );
}
