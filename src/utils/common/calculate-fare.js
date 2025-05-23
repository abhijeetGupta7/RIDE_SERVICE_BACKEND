const BASIC_FARE=100;
const RATE_PER_KM=15;  // rupees


function calculateFare(lat1, lon1, lat2, lon2) {

    // distance between src and destination
    const distance=haversineDistance(lat1, lon1, lat2, lon2);    
    const totalFare=BASIC_FARE+RATE_PER_KM*distance;
    return totalFare;
}

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
  

module.exports={
    calculateFare
}