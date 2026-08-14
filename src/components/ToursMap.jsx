import { useEffect, useRef } from 'react';

const cityCoords = {
  hyderabad:   [17.3850, 78.4867],
  'new-delhi': [28.6139, 77.2090],
  goa:         [15.2993, 74.1240],
  bengaluru:   [12.9716, 77.5946],
  mumbai:      [19.0760, 72.8777],
  jaipur:      [26.9124, 75.7873],
  kerala:      [10.8505, 76.2711],
  ladakh:      [34.1526, 77.5771],
};

export default function ToursMap({ slug, tours }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let L;
    let map;

    async function init() {
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }

      const center = cityCoords[slug] || [20.5937, 78.9629];
      map = L.map(mapRef.current, { scrollWheelZoom: false }).setView(center, 11);
      instanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        html: `<svg width="28" height="36" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#f97316"/>
          <circle cx="16" cy="12" r="6" fill="white"/>
        </svg>`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
      });

      tours.forEach((t, i) => {
        const base = cityCoords[slug] || [20.5937, 78.9629];
        const pos = [
          base[0] + (i % 3 - 1) * 0.05,
          base[1] + (Math.floor(i / 3) - 1) * 0.05,
        ];
        L.marker(pos, { icon: pinIcon })
          .addTo(map)
          .bindPopup(`
            <div style="width:170px">
              <img src="${t.img}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:8px"/>
              <p style="font-weight:700;font-size:13px;margin:0 0 4px">${t.title}</p>
              <p style="font-size:11px;color:#6b7280;margin:0 0 4px">📍 ${t.location}</p>
              <p style="font-size:13px;font-weight:700;color:#f97316;margin:0">${t.price}</p>
            </div>
          `);
      });
    }

    if (mapRef.current) init();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [slug, tours]);

  return (
    <div style={{ height: 480, borderRadius: 16, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
