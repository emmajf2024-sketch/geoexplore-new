
let isApiLoaded = false;
let loadingPromise: Promise<void> | null = null;
const CALLBACK_NAME = '__googleMapsApiOnLoadCallback';

export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  if (isApiLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    if (typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined') {
        isApiLoaded = true;
        resolve();
        return;
    }

    // Set up the callback function on the window object
    (window as any)[CALLBACK_NAME] = () => {
      isApiLoaded = true;
      loadingPromise = null;
      // Clean up the callback function from the window object
      delete (window as any)[CALLBACK_NAME];
      resolve();
    };

    const script = document.createElement('script');
    // Using loading=async and a callback is the recommended way for dynamic loading
    // to avoid performance warnings.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=${CALLBACK_NAME}`;
    
    script.onerror = (error) => {
      loadingPromise = null;
      // Clean up the callback function in case of an error
      if ((window as any)[CALLBACK_NAME]) {
          delete (window as any)[CALLBACK_NAME];
      }
      console.error("Error loading Google Maps script:", error);
      reject(new Error("Failed to load Google Maps script."));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
};
