import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import * as d3 from 'd3';
import sites from './sites.json';
import data from './data-small.json';
import SiteMarker, { isSiteMarkerProps, SiteMarkerProps } from './SiteMarker';
import MeasurementPoint from './MeasurementPoint';

function isSiteMarkerPropsArray(sites: any[]): sites is SiteMarkerProps[] {
  return sites.every(isSiteMarkerProps);
}

const Map = () => {
  const position: [number, number] = [47.4484600, -122.2921700];
  const pointColor = d3
    .scaleSequentialLog(d3.interpolateInferno)
    .domain([
      d3.max(data, d => d.ping) ?? 1,
      d3.min(data, d => d.ping) ?? 0
    ]);

  if (!isSiteMarkerPropsArray(sites)) {
    throw new Error('data has incorrect type');
  }

  return (
    <MapContainer
      style={{ height: 600, width: 1000 }}
      center={position}
      zoom={10}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {sites.map(site => <SiteMarker {...site} />)}
      {data.map(datum => <MeasurementPoint {...datum} color={pointColor} />)}
    </MapContainer>
  );
};

export default Map;
