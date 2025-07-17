import React, { useRef, useEffect, useState } from 'react';
import { LatLng } from '../types';

interface MapViewProps {
  center: LatLng;
  zoom: number;
  onMapClick?: (coords: LatLng) => void;
  guessLocation?: LatLng | null;
  player2GuessLocation?: LatLng | null; // For 2-player mode results
  actualLocation?: LatLng | null;
  showResult?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  center,
  zoom,
  onMapClick,
  guessLocation,
  player2GuessLocation,
  actualLocation,
  showResult = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const guessMarker = useRef<google.maps.Marker | null>(null);
  const player2GuessMarker = useRef<google.maps.Marker | null>(null);
  const actualMarker = useRef<google.maps.Marker | null>(null);
  const polyline = useRef<google.maps.Polyline | null>(null);
  const player2Polyline = useRef<google.maps.Polyline | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (ref.current && !mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
            { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
            { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
        ],
      });

      if (onMapClick) {
        mapInstance.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng && !showResult) { // Disable clicking when results are shown
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }
        });
      }
    }
  }, [onMapClick, center, zoom, showResult]);

  // Update guess marker
  useEffect(() => {
    if (!mapInstance.current) return;

    if (guessLocation && !guessMarker.current) {
      guessMarker.current = new window.google.maps.Marker({
        position: guessLocation,
        map: mapInstance.current,
        title: 'Your Guess',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4", // Blue for P1
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff"
        }
      });
    } else if (guessLocation && guessMarker.current) {
      guessMarker.current.setPosition(guessLocation);
      guessMarker.current.setMap(mapInstance.current);
    } else if (!guessLocation && guessMarker.current) {
      guessMarker.current.setMap(null);
    }
  }, [guessLocation]);

  // Handle result view and cleanup
  useEffect(() => {
    // Always clean up previous result elements when this effect runs
    if (actualMarker.current) {
      actualMarker.current.setMap(null);
      actualMarker.current = null;
    }
    if (polyline.current) {
      polyline.current.setMap(null);
      polyline.current = null;
    }
    if (player2GuessMarker.current) {
        player2GuessMarker.current.setMap(null);
        player2GuessMarker.current = null;
    }
    if (player2Polyline.current) {
        player2Polyline.current.setMap(null);
        player2Polyline.current = null;
    }

    if (showResult && mapInstance.current && actualLocation) {
        // Create actual location marker
        actualMarker.current = new window.google.maps.Marker({
            position: actualLocation,
            map: mapInstance.current,
            title: 'Actual Location',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#34A853", // Green for actual
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }
        });
        
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(actualLocation);

        // P1 line and marker
        if (guessLocation) {
            polyline.current = new window.google.maps.Polyline({
                path: [guessLocation, actualLocation],
                geodesic: true,
                strokeColor: '#4285F4', // Blue
                strokeOpacity: 0.8,
                strokeWeight: 2,
                map: mapInstance.current,
            });
            bounds.extend(guessLocation);
        }

        // P2 line and marker for multiplayer results
        if (player2GuessLocation) {
            player2GuessMarker.current = new window.google.maps.Marker({
                position: player2GuessLocation,
                map: mapInstance.current,
                title: 'Player 2 Guess',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#EA4335", // Red for P2
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff"
                }
            });

            player2Polyline.current = new window.google.maps.Polyline({
                path: [player2GuessLocation, actualLocation],
                geodesic: true,
                strokeColor: '#EA4335', // Red
                strokeOpacity: 0.8,
                strokeWeight: 2,
                map: mapInstance.current,
            });
            bounds.extend(player2GuessLocation);
        }

        // Fit map to bounds
        mapInstance.current.fitBounds(bounds, 100); // 100px padding
    }
  }, [showResult, actualLocation, guessLocation, player2GuessLocation]);


  return <div ref={ref} className="w-full h-full rounded-lg shadow-xl" />;
};

export default MapView;