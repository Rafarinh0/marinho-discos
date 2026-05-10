import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { SearchPage } from './pages/SearchPage';
import { AlbumPage } from './pages/AlbumPage';
import { LibraryPage } from './pages/LibraryPage';
import { ArtistPage } from './pages/ArtistPage';

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="app-main">
        {/* `key={pathname}` forces remount + triggers CSS fade-in */}
        <div key={location.pathname} className="route-transition">
          <Routes location={location}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/albums/:id" element={<AlbumPage />} />
            <Route path="/artists/:id" element={<ArtistPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}
