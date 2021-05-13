import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import sites from './sites.json';
import data from './data-small.json';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';
import measurementPoint from './leaflet-component/measurement-point';

const DEFAULT_POSITION: [number, number] = [47.44846, -122.29217];

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${
  devicePixelRatio > 1 ? '@2x' : ''
}.png`;

function createColorScale(data: Measurement[], mapType: MapType) {
  return d3
    .scaleSequentialLog(d3.interpolateInferno)
    .domain([
      d3.max(data, d => d[mapType]) ?? 1,
      d3.min(data, d => d[mapType]) ?? 0,
    ]);
}

interface MapProps {
  mapType: MapType;
  selectedSites: string[];
}

const Map = (props: MapProps) => {
  const [map, setMap] = useState<L.Map>();

  useEffect(() => {
    const map = L.map('map-id').setView(DEFAULT_POSITION, 10);
    setMap(map);

    L.tileLayer(URL, {
      attribution: ATTRIBUTION,
      maxZoom: 15,
      minZoom: 10,
      opacity: 0.5,
    }).addTo(map);
  }, []);

  useEffect(() => {
    if (!isSiteArray(sites)) {
      throw new Error('data has incorrect type');
    }

    if (!map) return;

    sites
      .filter(site => props.selectedSites.includes(site.name))
      .forEach(site => siteMarker(map, site));
  }, [map, props.selectedSites]);

  useEffect(() => {
    if (!map) return;

    const scale = createColorScale(data, props.mapType);
    data
      .filter(data => props.selectedSites.includes(data.site))
      .forEach(datum =>
        measurementPoint(map, datum, scale(datum[props.mapType])),
      );
  }, [map, props.selectedSites, props.mapType]);

  return <div id='map-id' style={{ height: 600, width: 1000 }}></div>;
};

export default Map;
