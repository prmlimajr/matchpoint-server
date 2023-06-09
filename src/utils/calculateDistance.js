const calculateDistance = (origin, destination) => {
  const R = 6371.0710 // Radius of the Earth in Km
  const rlat1 = Number(origin.lat) * (Math.PI/180); // Convert degrees to radians
  const rlat2 = Number(destination.lat) * (Math.PI/180); // Convert degrees to radians
  const difflat = rlat2-rlat1; // Radian difference (latitudes)
  const difflon = (Number(destination.lng) - Number(origin.lng)) * (Math.PI/180); // Radian difference (longitudes)

  const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));

  return d;
}

module.exports = calculateDistance;