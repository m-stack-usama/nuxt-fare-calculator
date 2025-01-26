import { ref } from 'vue';

export const useFareSettings = () => {
  const currency = ref('USD'); // Default currency
  const costPerKm = ref(1.5); // Default cost per km
  const currencies = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
    { label: 'INR (₹)', value: 'INR' },
  ];

  return {
    currency,
    costPerKm,
    currencies,
  };
};