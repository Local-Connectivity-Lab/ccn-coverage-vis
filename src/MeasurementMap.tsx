import React, { useEffect, useRef, useState } from 'react';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import * as d3 from 'd3';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';
import setBounds from './utils/set-bounds';
import MapLegend from './MapLegend';

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${devicePixelRatio > 1 ? '@2x' : ''
  }.png`;

const API = 'http://localhost:8000/';

const BIN_SIZE_SHIFT = 1;
const DEFAULT_ZOOM = 10;
const LEGEND_WIDTH = 25;

interface MapProps {
  mapType: MapType;
  selectedSites: SidebarOption[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  width: number;
  height: number;
}

const MeasurementMap = ({
  mapType,
  selectedSites,
  setLoading,
  width,
  height,
}: MapProps) => {
  const [cDomain, setCDomain] = useState<number[]>();
  const map = useRef<L.Map>();
  const bounds = useRef<{ left: number, top: number, width: number, height: number }>();

  useEffect(() => {
    (async () => {
      const response = await fetch(API + 'dataRange');
      const dataRange = await response.json();
      const _map = L.map('map-id').setView(dataRange.center, DEFAULT_ZOOM);
      const _bounds = setBounds({ ...dataRange, map: _map, width, height });

      L.tileLayer(URL, {
        attribution: ATTRIBUTION,
        maxZoom: 15,
        minZoom: 10,
        opacity: 0.5,
      }).addTo(_map);

      map.current = _map;
      bounds.current = _bounds;

      setLoading(false);
    })();
  }, [setLoading, width, height]);

  const markers = useRef(new Map<string, L.Marker>());
  useEffect(() => {
    (async () => {
      const response = await fetch(API + 'sites');
      const sites = await response.json();
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
    })();
  }, [selectedSites]);

  const layer = useRef<L.LayerGroup>();
  useEffect(() => {
    const _map = map.current;
    const _bounds = bounds.current
    if (!_map || !_bounds) return;

    (async () => {
      const response = await fetch(API + 'data?' + new URLSearchParams([
        ['width', _bounds.width + ''],
        ['height', _bounds.height + ''],
        ['left', _bounds.left + ''],
        ['top', _bounds.top + ''],
        ['binSizeShift', BIN_SIZE_SHIFT + ''],
        ['zoom', DEFAULT_ZOOM + ''],
        ['selectedSites', selectedSites.map(ss => ss.label).join(',')],
        ['mapType', mapType]
      ]));
      const bins: number[] = await response.json();

      if (!layer.current) {
        layer.current = L.layerGroup().addTo(_map);
      } else {
        layer.current.clearLayers();
      }

      const colorDomain = [
        d3.max(bins, d => d) ?? 1,
        d3.min(bins, d => d) ?? 0,
      ];

      const colorScale = d3.scaleSequential(colorDomain, d3.interpolateViridis);
      setCDomain(colorDomain);

      bins.forEach((bin, idx) => {
        if (bin && layer.current) {
          const x = ((idx / _bounds.height) << BIN_SIZE_SHIFT) + _bounds.left;
          const y = (idx % _bounds.height << BIN_SIZE_SHIFT) + _bounds.top;

          const sw = _map.unproject([x, y], DEFAULT_ZOOM);
          const ne = _map.unproject(
            [x + (1 << BIN_SIZE_SHIFT), y + (1 << BIN_SIZE_SHIFT)],
            DEFAULT_ZOOM,
          );

          L.rectangle(L.latLngBounds(sw, ne), {
            fillColor: colorScale(bin),
            fillOpacity: 0.75,
            stroke: false,
          }).addTo(layer.current);
        }
      });
    })();
  }, [selectedSites, mapType]);

  return (
    <div style={{ position: 'relative' }}>
      <div id='map-id' style={{ height, width, position: 'absolute' }}></div>
      <div style={{ position: 'absolute', left: width - LEGEND_WIDTH }}>
        <MapLegend
          colorDomain={cDomain}
          title={mapType}
          width={LEGEND_WIDTH}
        ></MapLegend>
      </div>
    </div>
  );
};

export default MeasurementMap;
