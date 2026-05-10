import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useTheme } from '../theme/ThemeProvider';
import { useLang } from '../i18n/LangProvider';
import { WhaleMark } from './WhaleMark';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();

  //keeps the input synced with the query param
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  const isDiscover = location.pathname === '/';
  const isLibrary = location.pathname.startsWith('/library');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div
          className="brand"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        >
          <WhaleMark />
          <div className="brand-name">
            marinho<em>discos</em>
          </div>
        </div>

        <form className="header-search" onSubmit={submitSearch}>
          <svg className="header-search-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={t('Search MusicBrainz…', 'Buscar no MusicBrainz…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => !isDiscover && navigate('/')}
          />
        </form>

        <nav className="nav">
          <button
            data-active={isDiscover ? '1' : undefined}
            onClick={() => navigate('/')}
          >
            {t('Discover', 'Descobrir')}
          </button>
          <button
            data-active={isLibrary ? '1' : undefined}
            onClick={() => navigate('/library')}
          >
            {t('Library', 'Biblioteca')}
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
            aria-label={t('Toggle language', 'Alternar idioma')}
            title={t('Toggle language', 'Alternar idioma')}
            style={{ padding: '8px 10px' }}
          >
            {lang === 'en' ? 'PT' : 'EN'}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t('Toggle theme', 'Alternar tema')}
            title={t('Toggle theme', 'Alternar tema')}
            style={{ padding: '8px 10px' }}
          >
            {theme === 'dark' ? '☼' : '☾'}
          </button>
        </nav>
      </div>
    </header>
  );
}
