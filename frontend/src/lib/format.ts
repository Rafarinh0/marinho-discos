// Helpers de formatação compartilhados.

// Extrai "YYYY" do ISO date. null/undefined => "—" (semântica de "desconhecido").
export function fmtYear(releaseDate: string | null | undefined): string {
  if (!releaseDate) return '—';
  return releaseDate.slice(0, 4);
}

export function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

export function fmtTotalTime(s: number, lang: 'en' | 'pt'): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return lang === 'pt' ? `${h} h ${m} min` : `${h}h ${m}m`;
  return `${m} min`;
}

export function relTime(iso: string, lang: 'en' | 'pt'): string {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);

  if (lang === 'pt') {
    if (days < 1) return 'hoje';
    if (days < 2) return 'ontem';
    if (days < 30) return `há ${days} dias`;
    if (days < 365) return `há ${Math.floor(days / 30)} meses`;
    return `há ${Math.floor(days / 365)} anos`;
  }
  if (days < 1) return 'today';
  if (days < 2) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function ratingBuckets(reviews: Array<{ rating: number }>): number[] {
  const out = Array(10).fill(0);
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 10) out[r.rating - 1]++;
  });
  return out;
}
