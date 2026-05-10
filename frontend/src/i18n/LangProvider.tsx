import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'pt';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, pt: string) => string;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

const STORAGE_KEY = 'md.lang';

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'pt') return stored;
  // Heurística: navegador em pt → pt
  if (typeof navigator !== 'undefined' && navigator.language?.startsWith('pt')) return 'pt';
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  }, [lang]);

  const t = (en: string, pt: string) => (lang === 'pt' ? pt : en);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
