import * as d3 from 'd3';

type Datum = {
  latitude: number;
  longitude: number;
};

export default function dataRange(data: Datum[]) {
  const [minLat, maxLat] = d3
    .extent(data, d => d.latitude)
    .map((d: number | undefined) => d ?? NaN);
  const [minLon, maxLon] = d3
    .extent(data, d => d.longitude)
    .map((d: number | undefined) => d ?? NaN);

  const center: [number, number] = [
    (minLat + maxLat) / 2,
    (minLon + maxLon) / 2,
  ];

  return { center, minLat, minLon, maxLat, maxLon };
}
