import api from './api';

export async function fetchDestinations(country = 'india') {
  const res = await api.get('/tours', {
    params: country && country.toLowerCase() !== 'india' ? { search: country } : {},
  });
  return res.data;
}

