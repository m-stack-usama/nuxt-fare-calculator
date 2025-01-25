import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { Loader } from '@googlemaps/js-api-loader';

export const useGoogleMaps = () => {
  const config = useRuntimeConfig();
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    libraries: ['places'],
  });

  const autocompleteService = ref<any>(null);
  const placesService = ref<any>(null);

  const initGoogleMaps = async () => {
    await loader.load();
    autocompleteService.value = new google.maps.places.AutocompleteService();
    placesService.value = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  };

  const getPlacePredictions = async (input: string) => {
    if (!autocompleteService.value) await initGoogleMaps();
    return new Promise((resolve, reject) => {
      autocompleteService.value.getPlacePredictions(
        { input },
        (predictions: any[], status: string) => {
          if (status === 'OK') {
            resolve(predictions);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const getPlaceDetails = async (placeId: string) => {
    if (!placesService.value) await initGoogleMaps();
    return new Promise((resolve, reject) => {
      placesService.value.getDetails(
        { placeId },
        (place: any, status: string) => {
          if (status === 'OK') {
            resolve(place);
          } else {
            reject(status);
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