// This file provides the necessary type declarations for the Google Maps JavaScript API.
// It prevents TypeScript errors when accessing the `google.maps` API loaded via a script tag.

// Augment the global Window interface to include the `google` object.
declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.maps {

      // Core
      class LatLng {
          constructor(lat: number, lng: number);
          constructor(literal: LatLngLiteral);
          lat(): number;
          lng(): number;
          equals(other: LatLng): boolean;
          toJSON(): LatLngLiteral;
          toString(): string;
      }

      interface LatLngLiteral {
          lat: number;
          lng: number;
      }

      class LatLngBounds {
          constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
          extend(point: LatLng | LatLngLiteral): void;
          getCenter(): LatLng;
          getNorthEast(): LatLng;
          getSouthWest(): LatLng;
          union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
      }
      
      interface LatLngBoundsLiteral {
          east: number;
          north: number;
          south: number;
          west: number;
      }

      // Map
      class Map {
          constructor(mapDiv: Element, opts?: MapOptions);
          addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
          fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
          getBounds(): LatLngBounds | undefined;
          getCenter(): LatLng;
          setCenter(latlng: LatLng | LatLngLiteral): void;
          setZoom(zoom: number): void;
      }

      interface MapOptions {
          center?: LatLng | LatLngLiteral;
          zoom?: number;
          disableDefaultUI?: boolean;
          zoomControl?: boolean;
          mapTypeControl?: boolean;
          streetViewControl?: boolean;
          fullscreenControl?: boolean;
          gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
          styles?: MapTypeStyle[];
      }

      interface MapTypeStyle {
          elementType?: string;
          featureType?: string;
          stylers?: object[];
      }

      interface MapMouseEvent {
          latLng: LatLng;
      }

      interface MapsEventListener {
          remove(): void;
      }

      type Padding = {
        bottom: number;
        left: number;
        right: number;
        top: number;
      };
      
      // StreetView
      class StreetViewPanorama {
          constructor(container: HTMLElement, opts?: StreetViewPanoramaOptions);
          setPosition(latLng: LatLng | LatLngLiteral): void;
          setOptions(options: StreetViewPanoramaOptions): void;
      }

      interface StreetViewPanoramaOptions {
          position: LatLng | LatLngLiteral;
          pov?: StreetViewPov;
          zoom?: number;
          addressControl?: boolean;
          showRoadLabels?: boolean;
          fullscreenControl?: boolean;
          zoomControl?: boolean;
          panControl?: boolean;
          enableCloseButton?: boolean;
          linksControl?: boolean;
          scrollwheel?: boolean;
          clickToGo?: boolean;
      }

      interface StreetViewPov {
          heading: number;
          pitch: number;
      }

      // StreetViewService and related types
      enum StreetViewStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
      }

      interface StreetViewLocation {
        description?: string;
        latLng: LatLng;
        pano: string;
      }

      interface StreetViewPanoramaData {
        location?: StreetViewLocation;
      }
      
      interface StreetViewRequest {
        location?: LatLng | LatLngLiteral;
        radius?: number;
        source?: 'outdoor' | 'default';
        preference?: 'best' | 'nearest';
      }

      class StreetViewService {
        getPanorama(
            request: StreetViewRequest,
            callback: (data: StreetViewPanoramaData | null, status: StreetViewStatus) => void
        ): void;
      }


      // Marker
      class Marker {
          constructor(opts?: MarkerOptions);
          setPosition(latLng: LatLng | LatLngLiteral | null | undefined): void;
          setMap(map: Map | null): void;
      }

      interface MarkerOptions {
          position?: LatLng | LatLngLiteral;
          map?: Map | StreetViewPanorama;
          title?: string;
          icon?: string | Icon | Symbol;
      }
      
      // Polyline
      class Polyline {
          constructor(opts?: PolylineOptions);
          setMap(map: Map | null): void;
      }

      interface PolylineOptions {
          path: (LatLng | LatLngLiteral)[];
          geodesic?: boolean;
          strokeColor?: string;
          strokeOpacity?: number;
          strokeWeight?: number;
          map?: Map;
      }
      
      // Symbols
      interface Icon {
          path: string | SymbolPath;
          scale: number;
          fillColor?: string;
          fillOpacity?: number;
          strokeWeight?: number;
          strokeColor?: string;
      }

      interface Symbol {
        path: SymbolPath | string;
        scale?: number;
        fillColor?: string;
        fillOpacity?: number;
        strokeWeight?: number;
        strokeColor?: string;
      }

      enum SymbolPath {
          CIRCLE = 0,
          FORWARD_CLOSED_ARROW = 1,
          FORWARD_OPEN_ARROW = 2,
          BACKWARD_CLOSED_ARROW = 3,
          BACKWARD_OPEN_ARROW = 4
      }
  }
}


export {}; // Treat this file as a module.