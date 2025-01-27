<script setup>
import { ref } from "vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import { useGoogleMaps } from "~/composables/useGoogleMaps";
import { useFareCalculator } from "~/composables/useFareCalculator";
import { useFareSettings } from "~/composables/useFareSettings";

const { getPlacePredictions, getPlaceDetails } = useGoogleMaps();
const { calculateDistance, calculateFare } = useFareCalculator();
const { currency, costPerKm, currencies } = useFareSettings();

const pickup = ref("");
const dropOff = ref("");
const pickupSuggestions = ref([]);
const dropOffSuggestions = ref([]);
const fareResult = ref(null);

const searchPickup = async (event) => {
  const predictions = await getPlacePredictions(event.query);
  pickupSuggestions.value = predictions.map((prediction) => prediction.description);
};

const searchDropOff = async (event) => {
  const predictions = await getPlacePredictions(event.query);
  dropOffSuggestions.value = predictions.map((prediction) => prediction.description);
};

const getFare = async () => {
  const pickupPredictions = await getPlacePredictions(pickup.value);
  const dropOffPredictions = await getPlacePredictions(dropOff.value);

  const pickupDetails = await getPlaceDetails(pickupPredictions[0].place_id);
  const dropOffDetails = await getPlaceDetails(dropOffPredictions[0].place_id);

  const distance = calculateDistance(pickupDetails, dropOffDetails);
  fareResult.value = calculateFare(distance, costPerKm.value, currency.value);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-6 mx-auto max-w-5xl p-4">
    <h1 class="text-3xl font-bold">Calculate Fare</h1>
    <div class="flex flex-col">
      <label>Pickup Location</label>
      <AutoComplete
        v-model="pickup"
        :suggestions="pickupSuggestions"
        @complete="searchPickup"
        size="large"
        placeholder="Enter pickup location"
      />
    </div>
    <div class="flex flex-col">
      <label>Drop-off Location</label>
      <AutoComplete
        v-model="dropOff"
        :suggestions="dropOffSuggestions"
        @complete="searchDropOff"
        size="large"
        placeholder="Enter drop-off location"
      />
    </div>
    <div class="flex flex-col">
      <label>Currency</label>
      <Select
        v-model="currency"
        :options="currencies"
        optionLabel="label"
        optionValue="value"
        size="large"
        class="w-[15rem]"
        placeholder="Select Currency"
      />
    </div>
    <div class="flex flex-col">
      <label>Cost Per Km</label>
      <InputNumber
        v-model="costPerKm"
        mode="decimal"
        :min="0.1"
        :max="10"
        :step="0.1"
        size="large"
        placeholder="Enter cost per km"
      />
    </div>
    <Button label="Get Fare" @click="getFare" />
    <div v-if="fareResult"  class="rounded-md bg-gray-200 p-5">
      <p class="text-gray">
        Distance: <span class="font-bold">{{ fareResult.distance }} km </span>
      </p>
      <p>
        Fare:
        <span class="font-bold">{{ fareResult.currency }} {{ fareResult.fare }} </span>
      </p>
    </div>
  </div>
</template>