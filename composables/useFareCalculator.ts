export const useFareCalculator = () => {
    const calculateDistance = (origin: any, destination: any) => {
      const R = 6371; // Radius of the Earth in km
      const lat1 = origin.geometry.location.lat();
      const lon1 = origin.geometry.location.lng();
      const lat2 = destination.geometry.location.lat();
      const lon2 = destination.geometry.location.lng();
  
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
  
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
  
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };
  
    const calculateFare = (distance: number) => {
      const baseFare = 2.5; // Base fare in dollars
      const ratePerKm = 1.5; // Rate per km
      return baseFare + distance * ratePerKm;
    };
  
    return {
      calculateDistance,
      calculateFare,
    };
  };