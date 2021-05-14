import React, { useEffect, useRef } from 'react';
import sites from './sites.json';
import data from './data-small.json';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import * as d3 from 'd3';
import {} from 'leaflet.heat';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';
import getDataRange from './utils/get-data-range';
import setBounds from './utils/set-bounds';

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${
  devicePixelRatio > 1 ? '@2x' : ''
}.png`;

const BIN_SIZE_SHIFT = 1;
const DEFAULT_ZOOM = 10;

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
  const map = useRef<L.Map>();
  const bins = useRef<(Measurement[] | null)[]>();
  const binW = useRef<number>();
  const binH = useRef<number>();
  const top = useRef<number>();
  const left = useRef<number>();

  useEffect(() => {
    const dataRange = getDataRange([...data, ...sites]);

    const _map = L.map('map-id').setView(dataRange.center, DEFAULT_ZOOM);

    const bounds = setBounds({ ...dataRange, map: _map, width, height });

    const _bin = new Array<Measurement[] | null>(
      (bounds.width * bounds.height) >> BIN_SIZE_SHIFT,
    );
    data.forEach(d => {
      const { x, y } = _map.project([d.latitude, d.longitude], DEFAULT_ZOOM);
      const index =
        ((x - bounds.left) >> BIN_SIZE_SHIFT) * bounds.height +
        ((y - bounds.top) >> BIN_SIZE_SHIFT);
      (_bin[index] = _bin[index] ?? []).push(d);
    });

    L.tileLayer(URL, {
      attribution: ATTRIBUTION,
      maxZoom: 15,
      minZoom: 10,
      opacity: 0.5,
    }).addTo(_map);

    map.current = _map;
    bins.current = _bin;
    binW.current = bounds.width;
    binH.current = bounds.height;
    top.current = bounds.top;
    left.current = bounds.left;

    setLoading(false);
  }, [setLoading, width, height]);

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

  const layer = useRef<L.LayerGroup>();
  useEffect(() => {
    const _map = map.current;
    const _binH = binH.current;
    const _top = top.current;
    const _left = left.current;
    if (!_map || !_binH || !_top || !_left) return;

    const _bins = (bins.current ?? []).map(b =>
      d3.mean(
        (b ?? []).filter(d => selectedSites.some(s => s.label === d.site)),
        d => d[mapType],
      ),
    );

    if (!layer.current) {
      layer.current = L.layerGroup().addTo(_map);
    } else {
      layer.current.clearLayers();
    }

    const scale = d3
      .scaleSequentialLog(d3.interpolateInferno)
      .domain([d3.max(_bins, d => d) ?? 1, d3.min(_bins, d => d) ?? 0]);

    _bins.forEach((bin, idx) => {
      if (bin && layer.current) {
        const x = ((idx / _binH) << BIN_SIZE_SHIFT) + _left;
        const y = (idx % _binH << BIN_SIZE_SHIFT) + _top;

        const sw = _map.unproject([x, y], DEFAULT_ZOOM);
        const ne = _map.unproject(
          [x + (1 << BIN_SIZE_SHIFT), y + (1 << BIN_SIZE_SHIFT)],
          DEFAULT_ZOOM,
        );

        L.rectangle(L.latLngBounds(sw, ne), {
          fillColor: scale(bin),
          fillOpacity: 0.75,
          stroke: false,
        }).addTo(layer.current);
      }
    });
  }, [selectedSites, mapType]);

  return <div id='map-id' style={{ height, width }}></div>;
};

export default MeasurementMap;
