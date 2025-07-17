import React, { useRef, useEffect } from 'react';
import { LatLng, Difficulty } from '../types';

interface StreetViewProps {
  location: LatLng;
  difficulty: Difficulty;
}

const StreetView: React.FC<StreetViewProps> = ({ location, difficulty }) => {
  const ref = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    const options: google.maps.StreetViewPanoramaOptions = {
        position: location,
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        fullscreenControl: false,
        enableCloseButton: false,
        // Dynamically set controls based on difficulty
        panControl: difficulty !== 'elite',
        zoomControl: difficulty !== 'elite',
        scrollwheel: difficulty !== 'elite',
        linksControl: difficulty === 'beginner',
        clickToGo: difficulty === 'beginner',
    };

    if (ref.current && !panoramaRef.current) {
      panoramaRef.current = new window.google.maps.StreetViewPanorama(ref.current, options);
    } else if (panoramaRef.current) {
      panoramaRef.current.setOptions(options);
      panoramaRef.current.setPosition(location);
    }
  }, [location, difficulty]);

  return <div ref={ref} className="absolute inset-0 w-full h-full" />;
};

export default StreetView;
