import { Routes, Route, Navigate } from 'react-router-dom';
import { useLang } from './i18n/LangProvider';
import { useTheme } from './theme/ThemeProvider';

// Placeholders — serão substituídos nas fases D2-D7
function Placeholder({ name }: { name: string }) {
  const { t } = useLang();
  const { theme, toggle } = useTheme();
  return (
    <div className="shell" style={{ paddingTop: 64 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        marinho<em style={{ color: 'var(--accent)' }}>discos</em>
      </div>
      <h1 className="font-display" style={{ fontSize: 64, margin: '0 0 24px' }}>
        {name}
      </h1>
      <p className="font-serif dim">
        {t(
          'Phase D1 setup complete. Next phases will fill these pages.',
          'Setup da Fase D1 concluído. Próximas fases preenchem essas páginas.'
        )}
      </p>
      <button
        className="btn btn-ghost"
        onClick={toggle}
        style={{ marginTop: 24 }}
      >
        {t('Theme', 'Tema')}: {theme}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <main className="app-main">
      <Routes>
        <Route path="/" element={<Placeholder name="Discover" />} />
        <Route path="/library" element={<Placeholder name="Library" />} />
        <Route path="/albums/:id" element={<Placeholder name="Album" />} />
        <Route path="/artists/:id" element={<Placeholder name="Artist" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}
