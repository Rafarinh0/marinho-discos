import { useLang } from '../i18n/LangProvider';

export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface Props {
  page: number;
  pageSize: PageSize;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: PageSize) => void;
}

// Botão neutro pra navegação
function NavButton({
  onClick,
  disabled,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="font-mono"
      style={{
        appearance: 'none',
        background: 'transparent',
        border: '1px solid var(--rule-2)',
        color: disabled ? 'var(--ink-4)' : 'var(--ink-2)',
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .15s, color .15s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = 'var(--rule)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { t } = useLang();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return (
    <div
      className="flex items-center justify-between"
      style={{
        marginTop: 32,
        gap: 16,
        flexWrap: 'wrap',
        paddingTop: 20,
        borderTop: '1px solid var(--rule)',
      }}
    >
      <div className="flex gap-3 items-center">
        <span
          className="font-mono muted"
          style={{ fontSize: 11, letterSpacing: '0.06em' }}
        >
          {t('Per page', 'Por página')}:
        </span>
        <div
          className="flex"
          style={{
            border: '1px solid var(--rule-2)',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => onPageSizeChange(size)}
              className="font-mono"
              style={{
                appearance: 'none',
                border: 0,
                background: pageSize === size ? 'var(--accent)' : 'transparent',
                color: pageSize === size ? 'var(--accent-ink)' : 'var(--ink-2)',
                padding: '6px 14px',
                fontSize: 11,
                letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <span
          className="font-mono muted"
          style={{ fontSize: 11, letterSpacing: '0.06em' }}
        >
          {total === 0
            ? t('No results', 'Sem resultados')
            : t(`${from}–${to} of ${total}`, `${from}–${to} de ${total}`)}
        </span>
        <div className="flex gap-1">
          <NavButton
            onClick={() => onPageChange(1)}
            disabled={safePage <= 1}
            ariaLabel={t('First page', 'Primeira página')}
          >
            «
          </NavButton>
          <NavButton
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            ariaLabel={t('Previous page', 'Página anterior')}
          >
            ‹
          </NavButton>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.06em',
              padding: '6px 12px',
              color: 'var(--ink)',
            }}
          >
            {safePage} / {totalPages}
          </span>
          <NavButton
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            ariaLabel={t('Next page', 'Próxima página')}
          >
            ›
          </NavButton>
          <NavButton
            onClick={() => onPageChange(totalPages)}
            disabled={safePage >= totalPages}
            ariaLabel={t('Last page', 'Última página')}
          >
            »
          </NavButton>
        </div>
      </div>
    </div>
  );
}
