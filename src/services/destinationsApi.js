const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

const COUNTRY_COORDS = {
  philippines: [{ name: 'Manila', lat: 14.5995, lon: 120.9842 }, { name: 'Cebu', lat: 10.3157, lon: 123.8854 }, { name: 'Palawan', lat: 9.8349, lon: 118.7384 }],
  canada:      [{ name: 'Toronto', lat: 43.6532, lon: -79.3832 }, { name: 'Vancouver', lat: 49.2827, lon: -123.1207 }, { name: 'Montreal', lat: 45.5017, lon: -73.5673 }],
  thailand:    [{ name: 'Bangkok', lat: 13.7563, lon: 100.5018 }, { name: 'Phuket', lat: 7.8804, lon: 98.3923 }, { name: 'Chiang Mai', lat: 18.7883, lon: 98.9853 }],
  australia:   [{ name: 'Sydney', lat: -33.8688, lon: 151.2093 }, { name: 'Melbourne', lat: -37.8136, lon: 144.9631 }, { name: 'Brisbane', lat: -27.4698, lon: 153.0251 }],
  greece:      [{ name: 'Athens', lat: 37.9838, lon: 23.7275 }, { name: 'Santorini', lat: 36.3932, lon: 25.4615 }, { name: 'Mykonos', lat: 37.4467, lon: 25.3289 }],
  india:       [{ name: 'Goa', lat: 15.2993, lon: 74.1240 }, { name: 'Jaipur', lat: 26.9124, lon: 75.7873 }, { name: 'Kerala', lat: 10.8505, lon: 76.2711 }],
};

export async function fetchDestinations(country = 'india') {
  const cities = COUNTRY_COORDS[country.toLowerCase()] || COUNTRY_COORDS.india;
  const results = await Promise.all(
    cities.map(({ name, lat, lon }) =>
      fetch(
        `https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${lon},${lat},15000&limit=5&apiKey=${API_KEY}`
      )
        .then(r => r.json())
        .then(data =>
          (data.features || []).map((f, i) => {
            const p = f.properties;
            return {
              id: `${name}-${i}`,
              title: p.name || name,
              location: `${name}, ${country.charAt(0).toUpperCase() + country.slice(1)}`,
              img: `https://picsum.photos/seed/${encodeURIComponent(p.name || name)}/800/600`,
              price: '₹9,999/person',
              days: '3 Days Tour',
              features: ['🌍 Explore'],
              category: 'Culture',
              description: p.address_line2 || '',
            };
          })
        )
    )
  );
  return results.flat();
}
