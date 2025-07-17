import { GameLocation, LatLng } from '../types';

let streetViewService: google.maps.StreetViewService;
const getStreetViewService = () => {
    if (!streetViewService) {
        streetViewService = new window.google.maps.StreetViewService();
    }
    return streetViewService;
}

const getRandomLatLng = (): LatLng => {
  const lat = Math.random() * 170 - 85; // Latitude from -85 to +85
  const lng = Math.random() * 360 - 180; // Longitude from -180 to 180
  return { lat, lng };
};

/**
 * Finds a single random Street View location. Retries until a valid outdoor panorama is found.
 * This method ensures that locations are on land and have Street View coverage.
 */
export const findRandomLocation = (): Promise<GameLocation> => {
  return new Promise((resolve) => {
    const service = getStreetViewService();
    const find = () => {
      service.getPanorama(
        { 
            location: getRandomLatLng(), 
            radius: 100000, // Large radius to increase chance of finding a panorama
            source: 'outdoor', // Only look for outdoor panoramas
            preference: 'best', // Bias towards higher quality imagery
        },
        (data, status) => {
          // A status of 'OK' means a valid panorama was found.
          if (status === 'OK' && data?.location?.latLng) {
            const location: GameLocation = {
              id: data.location.pano,
              name: data.location.description || 'A mysterious place',
              coords: {
                lat: data.location.latLng.lat(),
                lng: data.location.latLng.lng(),
              },
            };
            resolve(location);
          } else {
            // If no panorama is found (e.g., in the middle of an ocean),
            // the status will be 'ZERO_RESULTS'. We retry after a short delay.
            setTimeout(find, 10);
          }
        }
      );
    };
    find();
  });
};

/**
 * Fetches a specified number of random locations concurrently.
 */
export const findRandomLocations = async (count: number): Promise<GameLocation[]> => {
    const promises: Promise<GameLocation>[] = [];
    for (let i = 0; i < count; i++) {
        promises.push(findRandomLocation());
    }
    return Promise.all(promises);
};