import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useLang } from './i18n/LangProvider';

function Placeholder({ name }: { name: string }) {
  const { t } = useLang();
  return (
    <div className="shell" style={{ paddingTop: 64 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>◯ {name}</div>
      <h1
        className="font-display"
        style={{ fontSize: 'clamp(40px, 6vw, 72px)', margin: '0 0 24px' }}
      >
        {name}
      </h1>
      <p className="font-serif dim">
        {t('Coming up in the next phase.', 'Pronto na próxima fase.')}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Placeholder name="Discover" />} />
          <Route path="/library" element={<Placeholder name="Library" />} />
          <Route path="/albums/:id" element={<Placeholder name="Album" />} />
          <Route path="/artists/:id" element={<Placeholder name="Artist" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
