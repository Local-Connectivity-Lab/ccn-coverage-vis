import React, { useEffect, useRef } from 'react';
import sites from './sites.json';
import data from './data-small.json';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import {} from 'leaflet.heat';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';

const DEFAULT_POSITION: [number, number] = [47.44846, -122.29217];

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${
  devicePixelRatio > 1 ? '@2x' : ''
}.png`;

interface MapProps {
  mapType: MapType;
  selectedSites: SidebarOption[];
}

const MeasurementMap = ({ mapType, selectedSites }: MapProps) => {
  const map = useRef<L.Map>();

  useEffect(() => {
    map.current = L.map('map-id').setView(DEFAULT_POSITION, 10);

    L.tileLayer(URL, {
      attribution: ATTRIBUTION,
      maxZoom: 15,
      minZoom: 10,
      opacity: 0.5,
    }).addTo(map.current);
  }, []);

  const markers = useRef(new Map<string, L.Marker>());
  useEffect(() => {
    if (!isSiteArray(sites)) {
      throw new Error('data has incorrect type');
    }

    const _map = map.current;
    if (!_map) return;

    if (markers.current.size === 0) {
      sites.forEach(site => markers.current.set(site.name, siteMarker(site)));
    }

    markers.current.forEach((marker, site) => {
      if (selectedSites.some(s => s.label === site)) {
        marker.addTo(_map);
      } else {
        marker.removeFrom(_map);
      }
    });
  }, [selectedSites]);

  const heatLayer = useRef<L.HeatLayer>();
  useEffect(() => {
    if (!map.current) return;

    const _data: [number, number, number][] = data
      .filter(d => selectedSites.some(s => s.label === d.site))
      .map(d => [d.latitude, d.longitude, d[mapType]]);
    if (!heatLayer.current) {
      heatLayer.current = L.heatLayer(_data, { radius: 10 }).addTo(map.current);
    } else {
      heatLayer.current.setLatLngs(_data);
    }
  }, [selectedSites, mapType]);

  return <div id='map-id' style={{ height: 600, width: 1000 }}></div>;
};

export default MeasurementMap;
