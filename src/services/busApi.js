const GEO_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export async function geocodeCity(city) {
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&type=city&limit=1&apiKey=${GEO_KEY}`
  );
  const data = await res.json();
  const f = data.features?.[0];
  if (!f) throw new Error(`City not found: "${city}"`);
  return {
    name: f.properties.city || f.properties.name,
    country: f.properties.country,
    lat: f.properties.lat,
    lon: f.properties.lon,
  };
}

export async function getRouteInfo(fromLat, fromLon, toLat, toLon) {
  const res = await fetch(
    `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLon}|${toLat},${toLon}&mode=drive&apiKey=${GEO_KEY}`
  );
  const data = await res.json();
  const leg = data.features?.[0]?.properties?.legs?.[0];
  if (!leg) return { distanceKm: null, durationMin: null };
  return {
    distanceKm: Math.round(leg.distance / 1000),
    durationMin: Math.round(leg.time / 60),
  };
}

export async function getBusStations(lat, lon) {
  const res = await fetch(
    `https://api.geoapify.com/v2/places?categories=public_transport.bus&filter=circle:${lon},${lat},15000&limit=12&apiKey=${GEO_KEY}`
  );
  const data = await res.json();
  return data.features || [];
}
