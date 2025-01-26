<script setup>
import { ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import { useGoogleMaps } from '~/composables/useGoogleMaps';
import { useFareCalculator } from '~/composables/useFareCalculator';
import { useFareSettings } from '~/composables/useFareSettings';

const { getPlacePredictions, getPlaceDetails } = useGoogleMaps();
const { calculateDistance, calculateFare } = useFareCalculator();
const { currency, costPerKm, currencies } = useFareSettings();

const pickup = ref('');
const dropOff = ref('');
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
  <div>
    <h1>Calculate Fare</h1>
    <div>
      <label>Pickup Location</label>
      <AutoComplete
        v-model="pickup"
        :suggestions="pickupSuggestions"
        @complete="searchPickup"
        placeholder="Enter pickup location"
      />
    </div>
    <div>
      <label>Drop-off Location</label>
      <AutoComplete
        v-model="dropOff"
        :suggestions="dropOffSuggestions"
        @complete="searchDropOff"
        placeholder="Enter drop-off location"
      />
    </div>
    <div>
      <label>Currency</label>
      <Dropdown
        v-model="currency"
        :options="currencies"
        optionLabel="label"
        optionValue="value"
        placeholder="Select Currency"
      />
    </div>
    <div>
      <label>Cost Per Km</label>
      <InputNumber
        v-model="costPerKm"
        mode="decimal"
        :min="0.1"
        :max="10"
        :step="0.1"
        placeholder="Enter cost per km"
      />
    </div>
    <Button label="Get Fare" @click="getFare" />
    <div v-if="fareResult">
      <p>Distance: {{ fareResult.distance }} km</p>
      <p>Fare: {{ fareResult.currency }} {{ fareResult.fare }}</p>
    </div>
  </div>
</template>