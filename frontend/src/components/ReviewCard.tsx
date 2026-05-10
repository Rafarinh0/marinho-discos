import { useState } from 'react';
import { useLang } from '../i18n/LangProvider';
import { relTime } from '../lib/format';
import type { ReviewResponse } from '../api/types';

interface Props {
  review: ReviewResponse;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({ review, onEdit, onDelete }: Props) {
  const { t, lang } = useLang();
  const [hover, setHover] = useState(false);

  return (
    <article
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        borderColor: hover ? 'var(--rule-2)' : undefined,
        transition: 'border-color .15s',
      }}
    >
      <header
        className="flex items-baseline justify-between"
        style={{ marginBottom: 14, gap: 16, flexWrap: 'wrap' }}
      >
        <div className="flex items-baseline gap-3">
          <div
            className="font-display"
            style={{ fontSize: 32, lineHeight: 1, color: 'var(--accent)' }}
          >
            {review.rating}
            <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>/10</span>
          </div>
          <div>
            <div
              className="font-mono"
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.04em' }}
            >
              @marinho
            </div>
            <div
              className="font-mono muted"
              style={{ fontSize: 10, letterSpacing: '0.06em', marginTop: 2 }}
            >
              {relTime(review.createdAt, lang)}
            </div>
          </div>
        </div>
        <div className="rating-bar">
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} data-on={i < review.rating ? '1' : '0'} />
          ))}
        </div>
      </header>

      {review.comment && (
        <p
          className="font-serif"
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--ink)',
            textWrap: 'pretty' as const,
          }}
        >
          {review.comment}
        </p>
      )}

      {(onEdit || onDelete) && (
        <div
          className="flex gap-2"
          style={{
            marginTop: 14,
            opacity: hover ? 1 : 0.55,
            transition: 'opacity .15s',
          }}
        >
          {onEdit && (
            <button className="chip" style={{ cursor: 'pointer' }} onClick={onEdit}>
              ✎ {t('Edit', 'Editar')}
            </button>
          )}
          {onDelete && (
            <button className="chip" style={{ cursor: 'pointer' }} onClick={onDelete}>
              ✕ {t('Delete', 'Remover')}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
