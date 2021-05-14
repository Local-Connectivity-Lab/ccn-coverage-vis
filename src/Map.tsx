import React, { useEffect, useRef } from 'react';
import sites from './sites.json';
import data from './data-small.json';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import * as d3 from 'd3';
import { } from 'leaflet.heat';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${devicePixelRatio > 1 ? '@2x' : ''
  }.png`;

const [WIDTH, HEIGHT] = [1000, 600];
const BIN_SIZE_SHIFT = 1;
const DEFAULT_ZOOM = 10;

interface MapProps {
  mapType: MapType;
  selectedSites: SidebarOption[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MeasurementMap = ({ mapType, selectedSites, setLoading }: MapProps) => {
  const map = useRef<L.Map>();
  const bins = useRef<(Measurement[] | null)[]>();
  const width = useRef<number>();
  const height = useRef<number>();
  const top = useRef<number>();
  const left = useRef<number>();

  useEffect(() => {
    const all = [...data, ...sites];
    const [minLat, maxLat] = d3
      .extent(all, d => d.latitude)
      .map((d: number | undefined) => d ?? NaN);
    const [minLon, maxLon] = d3
      .extent(all, d => d.longitude)
      .map((d: number | undefined) => d ?? NaN);
    const center: [number, number] = [
      (minLat + maxLat) / 2,
      (minLon + maxLon) / 2,
    ];

    const _map = L.map('map-id').setView(center, DEFAULT_ZOOM);

    const { x, y } = _map.project(center, DEFAULT_ZOOM);
    const _bottomleft = _map.project([minLat, minLon], DEFAULT_ZOOM);
    const bottomleft: [number, number] = [
      Math.floor(Math.min(x - WIDTH / 2, _bottomleft.x - WIDTH / 10)),
      Math.ceil(Math.max(y + HEIGHT / 2, _bottomleft.y + HEIGHT / 10)),
    ];
    const _topright = _map.project([maxLat, maxLon], DEFAULT_ZOOM);
    const topright: [number, number] = [
      Math.ceil(Math.max(x + WIDTH / 2, _topright.x + WIDTH / 10)),
      Math.floor(Math.min(y - HEIGHT / 2, _topright.y - HEIGHT / 10)),
    ];
    const sw = _map.unproject(bottomleft, DEFAULT_ZOOM);
    const ne = _map.unproject(topright, DEFAULT_ZOOM);
    const bounds = L.latLngBounds(sw, ne);
    _map
      .setMaxBounds(bounds)
      .on('drag', () => _map.panInsideBounds(bounds, { animate: false }));

    const _width = topright[0] - bottomleft[0];
    const _height = bottomleft[1] - topright[1];

    const _bin = new Array<Measurement[] | null>((_width * _height) >> BIN_SIZE_SHIFT);
    const _left = bottomleft[0];
    const _top = topright[1];
    data.forEach(d => {
      const { x, y } = _map.project([d.latitude, d.longitude], DEFAULT_ZOOM);
      const index =
        ((x - _left) >> BIN_SIZE_SHIFT) * _height +
        ((y - _top) >> BIN_SIZE_SHIFT);
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
    width.current = _width;
    height.current = _height;
    top.current = topright[1];
    left.current = bottomleft[0];

    setLoading(false);
  }, [setLoading]);

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
    const _height = height.current;
    const _top = top.current;
    const _left = left.current;
    if (!_map || !_height || !_top || !_left) return;

    const _bins = (bins.current ?? []).map(
      b =>
        d3.mean(
          (b ?? []).filter(d => selectedSites.some(s => s.label === d.site)),
          d => d[mapType],
        ),
    );

    if (!layer.current) {
      layer.current = L.layerGroup().addTo(_map);
    } else {
      layer.current.clearLayers()
    }


    const scale = d3
      .scaleSequentialLog(d3.interpolateInferno)
      .domain([d3.max(_bins, d => d) ?? 1, d3.min(_bins, d => d) ?? 0]);

    _bins.forEach((bin, idx) => {
      if (bin && layer.current) {
        const x = ((idx / _height) << BIN_SIZE_SHIFT) + _left;
        const y = (idx % _height << BIN_SIZE_SHIFT) + _top;
        const sw = _map.unproject([x, y], DEFAULT_ZOOM);
        const ne = _map.unproject(
          [x + (1 << BIN_SIZE_SHIFT), y + (1 << BIN_SIZE_SHIFT)],
          DEFAULT_ZOOM,
        );
        L.rectangle(L.latLngBounds(sw, ne), {
          fillColor: scale(bin),
          fillOpacity: 0.8,
          stroke: false,
        }).addTo(layer.current);
      }
    });
  }, [selectedSites, mapType]);

  return <div id='map-id' style={{ height: HEIGHT, width: WIDTH }}></div>;
};

export default MeasurementMap;
