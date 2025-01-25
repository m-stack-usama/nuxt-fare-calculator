import { ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export const useGoogleMaps = () => {
  const config = useRuntimeConfig(); // Access runtime config
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey, // Use Google Maps API key
    libraries: ['places'], // Load the Places library
  });

  const autocompleteService = ref(null); // Store AutocompleteService instance
  const placesService = ref(null); // Store PlacesService instance

  // Initialize Google Maps
  const initGoogleMaps = async () => {
    await loader.load(); // Load the Google Maps script
    autocompleteService.value = new google.maps.places.AutocompleteService(); // Initialize AutocompleteService
    placesService.value = new google.maps.places.PlacesService(
      document.createElement('div') // Create a dummy div for PlacesService
    );
  };

  // Fetch place predictions based on user input
  const getPlacePredictions = async (input) => {
    if (!autocompleteService.value) await initGoogleMaps(); // Initialize if not already done
    return new Promise((resolve, reject) => {
      autocompleteService.value.getPlacePredictions(
        { input }, // Pass user input
        (predictions, status) => {
          if (status === 'OK') {
            resolve(predictions); // Return predictions if successful
          } else {
            reject(status); // Reject with status if failed
          }
        }
      );
    });
  };

  // Fetch detailed place information using place ID
  const getPlaceDetails = async (placeId) => {
    if (!placesService.value) await initGoogleMaps(); // Initialize if not already done
    return new Promise((resolve, reject) => {
      placesService.value.getDetails(
        { placeId }, // Pass place ID
        (place, status) => {
          if (status === 'OK') {
            resolve(place); // Return place details if successful
          } else {
            reject(status); // Reject with status if failed
          }
        }
      );
    });
  };

  return {
    getPlacePredictions,
    getPlaceDetails,
  };
};