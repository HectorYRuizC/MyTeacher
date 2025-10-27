import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  startPoint: { lat: number; lng: number; label: string };
  endPoint?: { lat: number; lng: number; label: string };
  height?: string;
  showRoute?: boolean;
}

const MapView = ({ startPoint, endPoint, height = '400px', showRoute = false }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([startPoint.lat, startPoint.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers and routes
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add start point marker
    const startIcon = L.divIcon({
      html: `<div class="w-8 h-8 bg-secondary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
      </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker([startPoint.lat, startPoint.lng], { icon: startIcon })
      .addTo(mapRef.current)
      .bindPopup(`<b>${startPoint.label}</b>`);

    // Add end point marker if provided
    if (endPoint) {
      const endIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([endPoint.lat, endPoint.lng], { icon: endIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${endPoint.label}</b>`);

      // Draw route line if requested
      if (showRoute) {
        const route = L.polyline(
          [
            [startPoint.lat, startPoint.lng],
            [endPoint.lat, endPoint.lng],
          ],
          {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
          }
        ).addTo(mapRef.current);

        // Fit bounds to show both markers
        const bounds = L.latLngBounds([
          [startPoint.lat, startPoint.lng],
          [endPoint.lat, endPoint.lng],
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [startPoint, endPoint, showRoute]);

  return (
    <div className="rounded-lg overflow-hidden border shadow-card">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};

export default MapView;
