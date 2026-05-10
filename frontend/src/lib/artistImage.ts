// Resolve enriquecimento de artista pelo MBID:
// 1. MusicBrainz: GET /artist/{mbid}?inc=url-rels — descobre Wikidata QID
// 2. Wikidata: GET /wiki/Special:EntityData/{Qid}.json — image, dates, sitelinks, description
// 3. Wikipedia: GET /api/rest_v1/page/summary/{title} — bio (extract)
//
// Tudo do browser. Se qualquer passo falhar, campos individuais ficam null —
// UI degrada graciosamente (omite o pedaço, mantém o resto).

import { useQuery } from '@tanstack/react-query';

interface MbUrlRel {
  type?: string;
  url?: { resource?: string };
}

interface MbArtistResponse {
  relations?: MbUrlRel[];
}

interface WikidataTimeValue {
  time?: string; // "+1968-05-04T00:00:00Z" ou "+1985-00-00T00:00:00Z"
}

interface WikidataClaim {
  mainsnak?: {
    datavalue?: { value?: string | WikidataTimeValue };
  };
}

interface WikidataEntityData {
  descriptions?: { en?: { value?: string } };
  claims?: {
    P18?: WikidataClaim[];  // image
    P569?: WikidataClaim[]; // date of birth
    P570?: WikidataClaim[]; // date of death
    P571?: WikidataClaim[]; // inception (formação)
    P576?: WikidataClaim[]; // dissolution (dissolução)
  };
  sitelinks?: { enwiki?: { title?: string; url?: string } };
}

interface WikidataResponse {
  entities?: Record<string, WikidataEntityData>;
}

interface WikipediaSummary {
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
}

export interface ArtistEnrichment {
  imageUrl: string | null;
  shortDescription: string | null; // 1-liner do Wikidata
  bio: string | null;              // 2-3 sentenças do Wikipedia summary
  birth: number | null;
  death: number | null;
  inception: number | null;
  dissolution: number | null;
  wikipediaUrl: string | null;
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
): Promise<WikidataEntityData | null> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const json = (await res.json()) as WikidataResponse;
  return json.entities?.[qid] ?? null;
}

function extractClaimString(claim?: WikidataClaim): string | null {
  const value = claim?.mainsnak?.datavalue?.value;
  return typeof value === 'string' ? value : null;
}

function extractClaimYear(claim?: WikidataClaim): number | null {
  const value = claim?.mainsnak?.datavalue?.value;
  if (!value || typeof value !== 'object' || !value.time) return null;
  // Format: "+1968-05-04T00:00:00Z" — pula o sinal, pega os primeiros 4 dígitos
  const match = value.time.match(/^[+-]?(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

function buildCommonsUrl(filename: string, width = 500): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    filename
  )}?width=${width}`;
}

async function fetchWikipediaSummary(
  title: string,
  signal?: AbortSignal
): Promise<WikipediaSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  return res.json();
}

async function resolveArtistEnrichment(
  mbid: string,
  signal?: AbortSignal
): Promise<ArtistEnrichment> {
  const empty: ArtistEnrichment = {
    imageUrl: null,
    shortDescription: null,
    bio: null,
    birth: null,
    death: null,
    inception: null,
    dissolution: null,
    wikipediaUrl: null,
  };

  // Etapa 1 — MB → QID
  const mb = await fetchArtistMb(mbid, signal);
  const qid = extractWikidataQid(mb.relations ?? []);
  if (!qid) return empty;

  // Etapa 2 — Wikidata
  const entity = await fetchWikidataEntity(qid, signal);
  if (!entity) return empty;

  const claims = entity.claims ?? {};
  const filename = extractClaimString(claims.P18?.[0]);
  const birth = extractClaimYear(claims.P569?.[0]);
  const death = extractClaimYear(claims.P570?.[0]);
  const inception = extractClaimYear(claims.P571?.[0]);
  const dissolution = extractClaimYear(claims.P576?.[0]);
  const shortDescription = entity.descriptions?.en?.value ?? null;
  const enwikiTitle = entity.sitelinks?.enwiki?.title ?? null;
  const wikipediaUrl = entity.sitelinks?.enwiki?.url ?? null;

  // Etapa 3 — Wikipedia summary (best-effort, falha não derruba o resto)
  let bio: string | null = null;
  if (enwikiTitle) {
    try {
      const summary = await fetchWikipediaSummary(enwikiTitle, signal);
      bio = summary?.extract ?? null;
    } catch {
      bio = null;
    }
  }

  return {
    imageUrl: filename ? buildCommonsUrl(filename, 500) : null,
    shortDescription,
    bio,
    birth,
    death,
    inception,
    dissolution,
    wikipediaUrl,
  };
}

// Hook principal — retorna o objeto inteiro
export function useArtistEnrichment(mbid: string | null | undefined) {
  return useQuery({
    queryKey: ['artist-enrichment', mbid],
    queryFn: ({ signal }) => resolveArtistEnrichment(mbid!, signal),
    enabled: !!mbid && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(mbid),
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
}

// Compat layer: mantém useArtistImage funcionando pra quem já usa
export function useArtistImage(mbid: string | null | undefined) {
  const q = useArtistEnrichment(mbid);
  return { ...q, data: q.data?.imageUrl ?? null };
}
