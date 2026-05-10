import { useLang } from '../i18n/LangProvider';

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: '1px solid var(--rule)', marginTop: 80 }}>
      <div
        className="shell"
        style={{
          padding: '40px 32px',
          display: 'flex',
          gap: 24,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="font-mono muted"
          style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          ◐ Marinho<em style={{ color: 'var(--accent)' }}>Discos</em> · MD-{year}
        </div>
        <div
          className="font-mono muted"
          style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {t(
            'Catalog data via MusicBrainz · Open Database License',
            'Dados do catálogo via MusicBrainz · Open Database License'
          )}
        </div>
        <div
          className="font-mono muted italic"
          style={{ fontSize: 11, letterSpacing: '0.04em' }}
        >
          {t(
            '"Listen carefully. Then say something."',
            '"Escute com atenção. Aí fale alguma coisa."'
          )}
        </div>
      </div>
    </footer>
  );
}
