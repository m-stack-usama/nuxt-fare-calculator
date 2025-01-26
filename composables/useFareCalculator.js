export const useFareCalculator = () => {
  // Calculate distance between two points using the Haversine formula
  const calculateDistance = (origin, destination) => {
    const R = 6371; // Radius of the Earth in km
    const lat1 = origin.geometry.location.lat(); // Origin latitude
    const lon1 = origin.geometry.location.lng(); // Origin longitude
    const lat2 = destination.geometry.location.lat(); // Destination latitude
    const lon2 = destination.geometry.location.lng(); // Destination longitude

    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert latitude difference to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert longitude difference to radians

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2); // Haversine formula

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Calculate angular distance
    const distance = R * c; // Distance in km
    return distance;
  };

  // Calculate fare based on distance, cost per km, and currency
  const calculateFare = (distance, costPerKm, currency) => {
    const fare = distance * costPerKm; // Calculate fare
    return {
      distance: distance.toFixed(2),
      fare: fare.toFixed(2),
      currency,
    };
  };

  return {
    calculateDistance,
    calculateFare,
  };
};