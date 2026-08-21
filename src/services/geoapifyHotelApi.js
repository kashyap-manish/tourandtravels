const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
const GEOAPIFY_BASE = 'https://api.geoapify.com';
const SAFE_CITY = /^[a-zA-Z0-9 ,.'()-]{1,100}$/;

export async function fetchHotels(city = 'Philippines') {
  if (!SAFE_CITY.test(city)) throw new Error('Invalid city name');

  // Step 1: Geocode the city
  const geoUrl = new URL(`${GEOAPIFY_BASE}/v1/geocode/search`);
  geoUrl.searchParams.set('text', city);
  geoUrl.searchParams.set('apiKey', API_KEY);
  const geoRes = await fetch(geoUrl.toString());
  const geoData = await geoRes.json();
  const place = geoData.features?.[0];
  if (!place) return [];

  const [lon, lat] = place.geometry.coordinates;

  // Step 2: Fetch hotels near that location
  const placesUrl = new URL(`${GEOAPIFY_BASE}/v2/places`);
  placesUrl.searchParams.set('categories', 'accommodation.hotel');
  placesUrl.searchParams.set('filter', `circle:${lon},${lat},20000`);
  placesUrl.searchParams.set('limit', '20');
  placesUrl.searchParams.set('apiKey', API_KEY);
  const placesRes = await fetch(placesUrl.toString());
  const placesData = await placesRes.json();

  return (placesData.features || []).map((f) => {
    const p = f.properties;
    return {
      name: p.name || 'Unnamed Hotel',
      location: [p.city, p.country].filter(Boolean).join(', ') || p.formatted || '',
      address: p.address_line2 || p.formatted || '',
      stars: p.datasource?.raw?.stars || p.datasource?.raw?.rating || 3,
      website: p.website || null,
      phone: p.phone || null,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    };
  });
}

