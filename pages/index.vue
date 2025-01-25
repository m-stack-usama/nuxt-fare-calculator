<script setup>
import { ref } from "vue";
import { useGoogleMaps } from "~/composables/useGoogleMaps";
import { useFareCalculator } from "~/composables/useFareCalculator";

const { getPlacePredictions, getPlaceDetails } = useGoogleMaps();
const { calculateDistance, calculateFare } = useFareCalculator();

const pickup = ref("");
const dropOff = ref("");
const pickupSuggestions = ref([]);
const dropOffSuggestions = ref([]);
const fareResult = ref(null);

const searchPickup = async (event) => {
  pickupSuggestions.value = await getPlacePredictions(event.target.value);
};

const searchDropOff = async (event) => {
  dropOffSuggestions.value = await getPlacePredictions(event.target.value);
};

const selectSuggestion = (value, type) => {
  if (type === "pickup") pickup.value = value;
  if (type === "dropOff") dropOff.value = value;
  pickupSuggestions.value = [];
  dropOffSuggestions.value = [];
};

const getFare = async () => {
  const pickupDetails = await getPlaceDetails(pickup.value.place_id);
  const dropOffDetails = await getPlaceDetails(dropOff.value.place_id);

  const distance = calculateDistance(pickupDetails, dropOffDetails);
  const fare = calculateFare(distance);

  fareResult.value = {
    distance: distance.toFixed(2),
    fare: fare.toFixed(2),
  };
};
</script>

<template>
  <div class="container">
    <h1>Fare Calculator</h1>
    <div class="form-group">
      <label for="pickup">Pickup Location</label>
      <input
        id="pickup"
        type="text"
        v-model="pickup"
        @input="searchPickup"
        placeholder="Enter pickup location"
        autocomplete="off"
      />
      <ul v-if="pickupSuggestions.length" class="suggestions">
        <li
          v-for="suggestion in pickupSuggestions"
          :key="suggestion.place_id"
          @click="selectSuggestion(suggestion, 'pickup')"
        >
          {{ suggestion.description }}
        </li>
      </ul>
    </div>

    <div class="form-group">
      <label for="dropOff">Drop-off Location</label>
      <input
        id="dropOff"
        type="text"
        v-model="dropOff"
        @input="searchDropOff"
        placeholder="Enter drop-off location"
        autocomplete="off"
      />
      <ul v-if="dropOffSuggestions.length" class="suggestions">
        <li
          v-for="suggestion in dropOffSuggestions"
          :key="suggestion.place_id"
          @click="selectSuggestion(suggestion, 'dropOff')"
        >
          {{ suggestion.description }}
        </li>
      </ul>
    </div>

    <button @click="getFare">Get Fare</button>

    <div v-if="fareResult" class="fare-result">
      <p><strong>Distance:</strong> {{ fareResult.distance }} km</p>
      <p><strong>Fare:</strong> ${{ fareResult.fare }}</p>
    </div>
  </div>
</template>
<style scoped>
/* General container styling */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Heading */
h1 {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Form group styling */
.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

/* Suggestions dropdown styling */
.suggestions {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: background-color 0.2s ease;
}

.suggestions li:hover {
  background-color: #f1f1f1;
}

/* Button styling */
button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Fare result styling */
.fare-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
  color: #333;
}

.fare-result p {
  margin: 5px 0;
  font-size: 1rem;
}
</style>
