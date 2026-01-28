/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
import { Intersection } from '@/types/traffic';
import { Loader2 } from 'lucide-react';

interface GoogleMapViewProps {
  intersections: Intersection[];
  selectedId: string | null;
  onSelectIntersection: (id: string) => void;
  apiKey: string;
}

declare global {
  interface Window {
    initGoogleMaps?: () => void;
  }
}

export function GoogleMapView({
  intersections,
  selectedId,
  onSelectIntersection,
  apiKey
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('ไม่สามารถโหลด Google Maps ได้');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (isLoading || error || !mapRef.current || !window.google?.maps) return;

    // Bangkok center
    const center = { lat: 13.7400, lng: 100.5400 };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: getMapStyles(),
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Enable traffic layer
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(mapInstanceRef.current);
  }, [isLoading, error]);

  // Update markers when intersections change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    intersections.forEach(intersection => {
      const markerColor = getMarkerColor(intersection.estimatedWaitMinutes);

      const marker = new google.maps.Marker({
        position: intersection.location,
        map: mapInstanceRef.current,
        title: intersection.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: selectedId === intersection.id ? 14 : 10,
        },
        animation: selectedId === intersection.id ? google.maps.Animation.BOUNCE : undefined,
      });

      // Info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">${intersection.name}</h3>
            <p style="margin: 4px 0; color: #666;">
              🚗 รถทั้งหมด: <strong>${intersection.totalVehicles}</strong> คัน
            </p>
            <p style="margin: 4px 0; color: #666;">
              ⏱️ รอโดยเฉลี่ย: <strong>${intersection.estimatedWaitMinutes}</strong> นาที
            </p>
            <p style="margin: 4px 0; color: #666;">
              📶 สถานะ: <strong>${intersection.status === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}</strong>
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        onSelectIntersection(intersection.id);
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [intersections, selectedId, onSelectIntersection]);

  // Pan to selected intersection
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedId) return;

    const selected = intersections.find(i => i.id === selectedId);
    if (selected) {
      mapInstanceRef.current.panTo(selected.location);
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedId, intersections]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
}

function getMarkerColor(waitMinutes: number): string {
  if (waitMinutes <= 2) return '#22c55e'; // green
  if (waitMinutes <= 5) return '#facc15'; // yellow
  return '#ef4444'; // red
}

function getMapStyles(): google.maps.MapTypeStyle[] {
  return [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }],
    },
  ];
}
