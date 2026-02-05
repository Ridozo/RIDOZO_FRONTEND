"use client";
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const RiderMap = () => {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    // ब्राउज़र लोड होने के बाद ही Leaflet के कंपोनेंट्स को इम्पोर्ट करें
    const loadMap = async () => {
      const Leaflet = await import('react-leaflet');
      const L = (await import('leaflet')).default;

      // मार्कर आइकॉन फिक्स
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      setMapComponents(Leaflet);
    };

    loadMap();
  }, []);

  // जब तक कंपोनेंट्स लोड न हों, एक साफ़ लोडर दिखाएं
  if (!MapComponents) {
    return <div style={{ height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading HD Map...</div>;
  }

  const { MapContainer, TileLayer, Marker } = MapComponents;

  return (
    <div style={{ height: '100%', width: '100%', filter: 'grayscale(100%)' }}>
      <MapContainer 
        center={[23.2599, 77.4126]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[23.2599, 77.4126]} />
      </MapContainer>
    </div>
  );
};

export default RiderMap;