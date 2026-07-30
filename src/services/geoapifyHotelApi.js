const API_KEY = '6779502357004b60a1743a290e2be9df';

export async function fetchHotels(city = 'Philippines') {
  // Step 1: Geocode the city
  const geoRes = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${API_KEY}`
  );
  const geoData = await geoRes.json();
  const place = geoData.features?.[0];
  if (!place) return [];

  const [lon, lat] = place.geometry.coordinates;

  // Step 2: Fetch hotels near that location
  const placesRes = await fetch(
    `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},20000&limit=20&apiKey=${API_KEY}`
  );
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
