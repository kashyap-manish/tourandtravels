const API_KEY = '57903695-8bcd5562ae6f2d6f59b1a03b4';
const BASE = '/pixabay';

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
  const q = encodeURIComponent(searchQuery.trim() || CATEGORY_QUERIES[category] || 'travel');
  const url = `${BASE}/?key=${API_KEY}&q=${q}&image_type=photo&per_page=${perPage}&page=${page}&safesearch=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Pixabay API error');
  const data = await res.json();
  return {
    images: (data.hits || []).map(p => ({
      id: p.id,
      src: p.largeImageURL,
      thumb: p.webformatURL,
      title: p.tags?.split(',')[0]?.trim() || 'Travel Photo',
      location: p.user,
      cat: searchQuery.trim() ? 'Search' : (category === 'All' ? 'Travel' : category),
    })),
    totalResults: data.totalHits,
    nextPage: data.totalHits > page * perPage ? page + 1 : null,
  };
}

export async function fetchHeroSlides() {
  const url = `${BASE}/?key=${API_KEY}&q=travel+landscape&image_type=photo&per_page=5&page=1&safesearch=true`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits || []).map(p => p.largeImageURL);
}
