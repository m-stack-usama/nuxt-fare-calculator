<script setup>
import { ref } from "vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import { useGoogleMaps } from "~/composables/useGoogleMaps";
import { useFareCalculator } from "~/composables/useFareCalculator";

const { getPlacePredictions, getPlaceDetails } = useGoogleMaps(); // Use Google Maps composable
const { calculateDistance, calculateFare } = useFareCalculator(); // Use fare calculator composable

const pickup = ref(""); // Store pickup location
const dropOff = ref(""); // Store drop-off location
const pickupSuggestions = ref([]); // Store pickup suggestions
const dropOffSuggestions = ref([]); // Store drop-off suggestions
const fareResult = ref(null); // Store fare calculation result

// Fetch pickup location suggestions
const searchPickup = async (event) => {
  const predictions = await getPlacePredictions(event.query); // Fetch predictions
  pickupSuggestions.value = predictions.map((prediction) => prediction.description); // Map to descriptions
};

const searchDropOff = async (event) => {
  const predictions = await getPlacePredictions(event.query); // Fetch predictions
  dropOffSuggestions.value = predictions.map((prediction) => prediction.description); // Map to descriptions
};
const getFare = async () => {
  // Fetch full place details for pickup and drop-off
  const pickupPredictions = await getPlacePredictions(pickup.value);
  const dropOffPredictions = await getPlacePredictions(dropOff.value);

  // Get the first matching prediction (you can add error handling here)
  const pickupDetails = await getPlaceDetails(pickupPredictions[0].place_id);
  const dropOffDetails = await getPlaceDetails(dropOffPredictions[0].place_id);

  // Calculate distance and fare
  const distance = calculateDistance(pickupDetails, dropOffDetails);
  const fare = calculateFare(distance);

  // Display the result
  fareResult.value = {
    distance: distance.toFixed(2),
    fare: fare.toFixed(2),
  };
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center space-y-5 h-screen mx-auto max-w-5xl p-10"
  >
    <h1 class="text-2xl">Calculate Fare</h1>
    <div class="flex flex-col">
      <label>Pickup Location</label>
      <AutoComplete
        v-model="pickup"
        :suggestions="pickupSuggestions"
        @complete="searchPickup"
        size="larger"
        placeholder="Enter pickup location"
      />
    </div>
    <div class="flex flex-col">
      <label>Drop-off Location</label>
      <AutoComplete
        v-model="dropOff"
        :suggestions="dropOffSuggestions"
        @complete="searchDropOff"
        size="larger"
        placeholder="Enter drop-off location"
      />
    </div>
    <Button label="Get Fare" @click="getFare" />
    <div v-if="fareResult">
      <p>Distance: {{ fareResult.distance }} km</p>
      <p>Fare: ${{ fareResult.fare }}</p>
    </div>
  </div>
</template>
