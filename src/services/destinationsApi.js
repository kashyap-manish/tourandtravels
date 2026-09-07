import api from './api';

export async function fetchDestinations({ search, category } = {}) {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;
  const res = await api.get('/tours', { params });
  return res.data;
}

