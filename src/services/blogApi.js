const API_KEY = 'pub_b747e5e0db06418da7da6474b12f49a0';

const CATEGORY_QUERY = {
  'All': 'travel',
  'Travel Tips': 'travel tips',
  'Destinations': 'travel destinations',
  'Adventure': 'adventure travel',
  'Budget Travel': 'budget travel',
};

export async function fetchBlogs(category = 'All', search = '') {
  const q = (search.trim() || CATEGORY_QUERY[category] || 'travel').slice(0, 100);
  const url = new URL('/newsdata/api/1/news', window.location.origin);
  url.searchParams.set('apikey', API_KEY);
  url.searchParams.set('q', q);
  url.searchParams.set('language', 'en');

  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.status !== 'success') throw new Error('Failed to fetch blogs');

  return (data.results || [])
    .filter(a => a.image_url && a.description)
    .map(a => ({
      img: a.image_url,
      title: a.title,
      excerpt: a.description,
      category: category === 'All' ? 'Travel' : category,
      date: new Date(a.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: a.source_name || 'Unknown',
      readTime: `${Math.max(2, Math.ceil((a.description?.split(' ').length || 100) / 200))} min read`,
      url: a.link,
    }));
}
