const API_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const GUARDIAN_BASE = 'https://content.guardianapis.com';
const ALLOWED_PARAMS = /^[a-zA-Z0-9 _-]{1,100}$/;

const CATEGORY_QUERY = {
  'All': 'travel',
  'Travel Tips': 'travel tips',
  'Destinations': 'travel destinations',
  'Adventure': 'adventure travel',
  'Budget Travel': 'budget travel',
};

export async function fetchBlogs(category = 'All', search = '') {
  const base = CATEGORY_QUERY[category] || 'travel';
  const raw = (search.trim() || base).slice(0, 100);
  if (!ALLOWED_PARAMS.test(raw)) throw new Error('Invalid search query');
  const query = encodeURIComponent(raw);
  const url = new URL(`${GUARDIAN_BASE}/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('show-fields', 'thumbnail,trailText,byline,wordcount');
  url.searchParams.set('page-size', '12');
  url.searchParams.set('api-key', API_KEY);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.response?.status !== 'ok') throw new Error('Failed to fetch blogs');

  return data.response.results
    .filter(a => a.fields?.thumbnail && a.fields?.trailText)
    .map(a => ({
      img: a.fields.thumbnail,
      title: a.webTitle,
      excerpt: a.fields.trailText,
      category: category === 'All' ? 'Travel' : category,
      date: new Date(a.webPublicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: a.fields.byline || 'The Guardian',
      readTime: `${Math.max(2, Math.ceil((a.fields.wordcount || 400) / 200))} min read`,
      url: a.webUrl,
    }));
}

