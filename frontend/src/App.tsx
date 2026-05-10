import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchPage } from './pages/SearchPage';
import { AlbumPage } from './pages/AlbumPage';
import { LibraryPage } from './pages/LibraryPage';
import { ArtistPage } from './pages/ArtistPage';

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
