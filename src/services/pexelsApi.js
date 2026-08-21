const API_KEY = import.meta.env.VITE_PEXELS_KEY;
const BASE = 'https://api.pexels.com/v1';
const SAFE_QUERY = /^[a-zA-Z0-9 _+'-]{1,100}$/;

const headers = { Authorization: API_KEY };

const CATEGORY_QUERIES = {
  All:       'travel destinations',
  Beaches:   'beach tropical',
  Mountains: 'mountain peaks',
  Culture:   'culture heritage temple',
  Adventure: 'adventure hiking',
  Wildlife:  'wildlife safari animals',
  Cities:    'city skyline night',
};

export async function fetchGalleryImages(category = 'All', page = 1, perPage = 12, searchQuery = '') {
  const raw = searchQuery.trim() || CATEGORY_QUERIES[category] || 'travel';
  if (!SAFE_QUERY.test(raw)) throw new Error('Invalid search query');
  const url = new URL(`${BASE}/search`);
  url.searchParams.set('query', raw);
  url.searchParams.set('per_page', perPage);
  url.searchParams.set('page', page);
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error('Pexels API error');
  const data = await res.json();
  return {
    images: data.photos.map(p => ({
      id: p.id,
      src: p.src.large2x,
      thumb: p.src.medium,
      title: p.alt || 'Travel Photo',
      location: p.photographer,
      cat: searchQuery.trim() ? 'Search' : (category === 'All' ? 'Travel' : category),
    })),
    totalResults: data.total_results,
    nextPage: data.next_page ? page + 1 : null,
  };
}

export async function fetchHeroSlides() {
  const res = await fetch(
    `${BASE}/search?query=travel+landscape&per_page=5&page=1`,
    { headers }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.photos.map(p => p.src.landscape || p.src.large2x);
}

