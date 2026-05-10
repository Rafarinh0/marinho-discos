import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { Cover } from './Cover';
import { useLang } from '../i18n/LangProvider';
import { importExternalAlbum } from '../api/externalCatalog';
import type { ExternalAlbumSummary } from '../api/types';

interface Props {
  results: ExternalAlbumSummary[];
}

export function ResultsGrid({ results }: Props) {
  const { t } = useLang();
  const navigate = useNavigate();

  const importMutation = useMutation({
    mutationFn: importExternalAlbum,
    onSuccess: ({ id }) => navigate(`/albums/${id}`),
  });

  const handleClick = (r: ExternalAlbumSummary) => {
    if (importMutation.isPending) return;
    importMutation.mutate(r.externalId);
  };

  return (
    <>
      <div className="library-grid">
        {results.map((r) => {
          const isImporting =
            importMutation.isPending && importMutation.variables === r.externalId;
          return (
            <div
              key={r.externalId}
              className="cover-card"
              onClick={() => handleClick(r)}
              style={{ opacity: isImporting ? 0.6 : 1 }}
            >
              <Cover album={r} />
              <div style={{ marginTop: 12 }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.15,
                    marginBottom: 4,
                    textWrap: 'balance' as const,
                  }}
                >
                  {r.title}
                </div>
                <div
                  className="font-mono muted"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {r.artistName}
                  {r.releaseYear ? ` · ${r.releaseYear}` : ''}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className="chip">
                    {isImporting ? (t('Importing…', 'Importando…')) : `↓ ${t('Import', 'Importar')}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {importMutation.isError && (
        <div
          className="card"
          style={{ marginTop: 24, borderColor: 'var(--accent)', color: 'var(--ink-2)' }}
        >
          {t('Import failed.', 'Falha na importação.')}{' '}
          <span className="muted">
            {(importMutation.error as Error)?.message ?? ''}
          </span>
        </div>
      )}
    </>
  );
}
