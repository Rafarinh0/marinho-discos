// Resolve a imagem de um artista pelo MBID:
// 1. MusicBrainz: GET /artist/{mbid}?inc=url-rels — encontra o link de Wikidata
//    (MB descontinuou as relações 'wikipedia' diretas; tudo passa por Wikidata agora)
// 2. Wikidata: GET /wiki/Special:EntityData/{Qid}.json — pega o claim P18 (imagem)
// 3. Commons: monta URL Special:FilePath?width=500 — serve a imagem
//
// Tudo do browser direto. MB, Wikidata e Commons todos suportam CORS.
// Se qualquer passo falhar (sem link, sem P18, etc.), retorna null —
// o componente cai pro layout só-typography graciosamente.

import { useQuery } from '@tanstack/react-query';

interface MbUrlRel {
  type?: string;
  url?: { resource?: string };
}

interface MbArtistResponse {
  id: string;
  name: string;
  relations?: MbUrlRel[];
}

interface WikidataClaim {
  mainsnak?: {
    datavalue?: { value?: string };
  };
}

interface WikidataEntity {
  entities?: Record<string, { claims?: { P18?: WikidataClaim[] } }>;
}

const MB_BASE = 'https://musicbrainz.org/ws/2';

async function fetchArtistMb(mbid: string, signal?: AbortSignal): Promise<MbArtistResponse> {
  const url = `${MB_BASE}/artist/${mbid}?inc=url-rels&fmt=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`MusicBrainz ${res.status}`);
  return res.json();
}

function extractWikidataQid(rels: MbUrlRel[]): string | null {
  const wd = rels.find(
    (r) => r.type === 'wikidata' && r.url?.resource?.includes('wikidata.org/wiki/')
  );
  const resource = wd?.url?.resource;
  if (!resource) return null;
  const match = resource.match(/\/wiki\/(Q\d+)$/);
  return match ? match[1] : null;
}

async function fetchWikidataEntity(
  qid: string,
  signal?: AbortSignal
): Promise<WikidataEntity> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Wikidata ${res.status}`);
  return res.json();
}

function extractP18Filename(entity: WikidataEntity, qid: string): string | null {
  const claim = entity.entities?.[qid]?.claims?.P18?.[0];
  return claim?.mainsnak?.datavalue?.value ?? null;
}

function buildCommonsUrl(filename: string, width = 500): string {
  // Special:FilePath aceita o nome do arquivo URL-encoded; serve a imagem direto
  // (com redirect 302 pra storage). ?width= redimensiona on-the-fly.
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filename
  )}?width=${width}`;
}

async function resolveArtistImage(
  mbid: string,
  signal?: AbortSignal
): Promise<string | null> {
  const mb = await fetchArtistMb(mbid, signal);
  const qid = extractWikidataQid(mb.relations ?? []);
  if (!qid) return null;

  try {
    const wd = await fetchWikidataEntity(qid, signal);
    const filename = extractP18Filename(wd, qid);
    if (!filename) return null;
    return buildCommonsUrl(filename, 500);
  } catch {
    // Wikidata 404 ou shape inesperado → sem imagem
    return null;
  }
}

export function useArtistImage(mbid: string | null | undefined) {
  return useQuery({
    queryKey: ['artist-image', mbid],
    queryFn: ({ signal }) => resolveArtistImage(mbid!, signal),
    enabled: !!mbid && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(mbid),
    staleTime: 24 * 60 * 60 * 1000, // 24h — imagem de artista raramente muda
    retry: false, // se MB não tem link, retentar não resolve
  });
}
