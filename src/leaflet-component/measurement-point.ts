import * as L from 'leaflet';

export default function measurementPoint(
  map: L.Map,
  measurement: Measurement,
  color: string,
) {
  L.circle([measurement.latitude, measurement.longitude], {
    color,
    fillColor: color,
  }).addTo(map);
}
