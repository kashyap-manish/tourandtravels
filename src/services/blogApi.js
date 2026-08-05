const API_KEY = 'test';

const CATEGORY_QUERY = {
  'All': 'travel',
  'Travel Tips': 'travel tips',
  'Destinations': 'travel destinations',
  'Adventure': 'adventure travel',
  'Budget Travel': 'budget travel',
};

export async function fetchBlogs(category = 'All', search = '') {
  const base = CATEGORY_QUERY[category] || 'travel';
  const query = encodeURIComponent(search.trim() || base);
  const res = await fetch(
    `https://content.guardianapis.com/search?q=${query}&show-fields=thumbnail,trailText,byline,wordcount&page-size=12&api-key=${API_KEY}`
  );
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
