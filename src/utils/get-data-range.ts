import * as d3 from 'd3';

type Datum = {
  latitude: number;
  longitude: number;
};

export default function dataRange(data: Datum[]) {
  const [minLat, maxLat] = d3
    .extent(data, d => d.latitude)
    .map(d => d ?? NaN) as [number, number];
  const [minLon, maxLon] = d3
    .extent(data, d => d.longitude)
    .map(d => d ?? NaN) as [number, number];

  const center: [number, number] = [
    Number.isNaN(minLat) || Number.isNaN(maxLat) ? 0 : (minLat + maxLat) / 2,
    Number.isNaN(minLon) || Number.isNaN(maxLon) ? 0 : (minLon + maxLon) / 2,
  ];

  return { center, minLat, minLon, maxLat, maxLon };
}
