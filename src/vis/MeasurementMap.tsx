import React, { useEffect, useState } from 'react';
import { MapType } from './MapSelectionRadio';
import { API_URL } from '../utils/config';
import * as L from 'leaflet';
import * as d3 from 'd3';
import siteMarker, { isSiteArray } from '../leaflet-component/site-marker';
import getBounds from '../utils/get-bounds';
import MapLegend from './MapLegend';
import fetchToJson from '../utils/fetch-to-json';
import Loading from '../Loading';

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${devicePixelRatio > 1 ? '@2x' : ''
  }.png`;

const BIN_SIZE_SHIFT = 0;
const DEFAULT_ZOOM = 10;
const LEGEND_WIDTH = 25;

function cts(p: Cell): string {
  return p.x + ',' + p.y;
}

export const UNITS = {
  dbm: 'dBm',
  ping: 'ms',
  download_speed: 'Mbps',
  upload_speed: 'Mbps',
} as const;

export const MULTIPLIERS = {
  dbm: 1,
  ping: 1,
  download_speed: 1,
  upload_speed: 1,
} as const;

export const MAP_TYPE_CONVERT = {
  dbm: 'Signal Strength',
  ping: 'Ping',
  download_speed: 'Download Speed',
  upload_speed: 'Upload Speed',
} as const;

interface MapProps {
  mapType: MapType;
  selectedSites: SidebarOption[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  width: number;
  height: number;
  loading: boolean;
  top: number;
  allSites: Site[];
  cells: Set<string>;
  setCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  overlayData: number;
  setOverlayData: React.Dispatch<React.SetStateAction<number>>;
}

const MeasurementMap = ({
  mapType,
  selectedSites,
  setLoading,
  width,
  height,
  loading,
  top,
  allSites,
  cells,
  setCells,
  overlayData,
  setOverlayData
}: MapProps) => {
  const [cDomain, setCDomain] = useState<number[]>();
  const [map, setMap] = useState<L.Map>();
  const [bins, setBins] = useState<number[][]>([]);
  const [bounds, setBounds] =
    useState<{ left: number; top: number; width: number; height: number }>();
  const [markers, setMarkers] = useState(new Map<string, L.Marker>());
  const [layer, setLayer] = useState<L.LayerGroup>();
  const [mlayer, setMLayer] = useState<L.LayerGroup>();

  useEffect(() => {
    (async () => {
      const dataRange = await fetchToJson(API_URL + '/api/dataRange');
      const _map = L.map('map-id').setView(dataRange.center, DEFAULT_ZOOM);
      const _bounds = getBounds({ ...dataRange, map: _map, width, height });

      L.tileLayer(URL, {
        attribution: ATTRIBUTION,
        maxZoom: 15,
        minZoom: 10,
        opacity: 0.7,
        zIndex: 1,
      }).addTo(_map);

      setBounds(_bounds);
      setMap(_map);
      setLayer(L.layerGroup().addTo(_map));
      setMLayer(L.layerGroup().addTo(_map));
      setLoading(false);
    })();
  }, [setLoading, width, height]);

  useEffect(() => {
    (async () => {
      const _sites = allSites || [];
      const _siteSummary = await fetchToJson(API_URL + '/api/sitesSummary');
      if (!map || markers.size > 0) {
        return;
      }
      const _markers = new Map<string, L.Marker>();
      if (!isSiteArray(_sites)) {
        throw new Error('data has incorrect type');
      }

      _sites.forEach(site =>
        _markers.set(
          site.name,
          siteMarker(site, _siteSummary[site.name]).addTo(map),
        ),
      );
      setMarkers(_markers);
    })();
  }, [allSites, map, markers]);
  useEffect(() => {
    if (!map || !markers) return;
    // TODO: MOVE TO UTILS;
    const greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    const goldIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    markers.forEach((marker, site) => {
      if (selectedSites.some(s => s.label === site)) {
        marker.setOpacity(1);
      } else {
        marker.setOpacity(0.5);
      }
      if (allSites.some(s => s.name === site && s.status === 'active')) {
        marker.setIcon(greenIcon)
      }
      else if (allSites.some(s => s.name === site && s.status === 'confirmed')) {
        marker.setIcon(goldIcon)
      }
      else if (allSites.some(s => s.name === site && s.status === 'in-conversation')) {
        marker.setIcon(redIcon)
      }
    });
  }, [selectedSites, map, markers, allSites]);

  useEffect(() => {
    if (!map || !bounds || !layer) return;

    setLoading(true);
    (async () => {
      if (!map) {
        return;
      }
      setBins(await fetchToJson(
        API_URL +
        '/api/data?' +
        new URLSearchParams([
          ['width', bounds.width + ''],
          ['height', bounds.height + ''],
          ['left', bounds.left + ''],
          ['top', bounds.top + ''],
          ['binSizeShift', BIN_SIZE_SHIFT + ''],
          ['zoom', DEFAULT_ZOOM + ''],
          ['selectedSites', selectedSites.map(ss => ss.label).join(',')],
          ['mapType', mapType],
        ]),
      ));
      setLoading(false);
    })();
  }, [selectedSites, mapType, setLoading, map, layer, bounds]);

  useEffect(() => {
    if (!map || !bounds || !layer) return;

    setLoading(true);
    (async () => {
      const colorDomain = [
        d3.max(bins, d => d[1] * MULTIPLIERS[mapType]) ?? 1,
        d3.min(bins, d => d[1] * MULTIPLIERS[mapType]) ?? 0,
      ];

      const colorScale = d3.scaleSequential(colorDomain, d3.interpolateViridis);
      setCDomain(colorDomain);

      layer.clearLayers();
      bins.forEach((p) => {
        const idx = p[0];
        const bin = p[1];
        if (bin) {
          const x = ((idx / bounds.height) << BIN_SIZE_SHIFT) + bounds.left;
          const y = (idx % bounds.height << BIN_SIZE_SHIFT) + bounds.top;

          const sw = map.unproject([x, y], DEFAULT_ZOOM);
          const ne = map.unproject(
            [x + (1 << BIN_SIZE_SHIFT), y + (1 << BIN_SIZE_SHIFT)],
            DEFAULT_ZOOM,
          );

          L.rectangle(L.latLngBounds(sw, ne), {
            fillColor: colorScale(bin * MULTIPLIERS[mapType]),
            fillOpacity: 0.75,
            stroke: false,
          }).bindTooltip(
            `${bin.toFixed(2)} ${UNITS[mapType]}`,
            { direction: 'top' }
          ).addTo(layer).on('click', (e) => {
            const cs = cells;
            const c = cts({ x: x, y: y });
            if (cs.has(c)) {
              cs.delete(c);
            } else {
              cs.add(c);
            }
            setCells(new Set(cs));
            // console.log(cs);
          });
        }
      });
      setLoading(false);
    })();
  }, [bins, setCells, cells, selectedSites, mapType, setLoading, map, layer, bounds]);

  useEffect(() => {
    if (!map || !bounds || !layer || !mlayer || !bins) return;
    (async () => {
      mlayer.clearLayers();
      var binSum: number = 0;
      var binNum: number = 0;
      bins.forEach((p) => {
        const idx = p[0];
        const bin = p[1];
        if (bin) {
          const x = ((idx / bounds.height) << BIN_SIZE_SHIFT) + bounds.left;
          const y = (idx % bounds.height << BIN_SIZE_SHIFT) + bounds.top;
          const c = cts({ x: x, y: y });
          if (cells.has(c)) {
            const ct = map.unproject(
              [x + (1 << BIN_SIZE_SHIFT) / 2, y + (1 << BIN_SIZE_SHIFT) / 2],
              DEFAULT_ZOOM,
            );
            binSum += bin;
            binNum += 1;
            L.circle(L.latLng(ct), {
              fillColor: '#FF0000',
              fillOpacity: 0.75,
              radius: 24,
              stroke: false,
            }).bindTooltip(
              `${bin.toFixed(2)}`,
              { direction: 'top' }
            ).addTo(mlayer).on('click', (e) => {
              const cs = cells;
              if (cs.has(c)) {
                cs.delete(c);
              } else {
                cs.add(c);
              }
              // console.log(cs);
              setCells(new Set(cs));
            });;
          }
        }
      });
      setOverlayData(binSum / binNum);
    })();
  }, [cells, setCells, setOverlayData, bins, selectedSites, mapType, setLoading, map, mlayer, bounds, layer])

  return (
    <div style={{ position: 'relative', top: top }}>
      <div
        id='map-id'
        style={{ height, width, position: 'absolute', zIndex: '1' }}
      ></div>
      <div style={{ position: 'fixed', right: 0, zIndex: '1' }}>
        <MapLegend
          colorDomain={cDomain}
          title={`${MAP_TYPE_CONVERT[mapType]} (${UNITS[mapType]})`}
          width={LEGEND_WIDTH}
        ></MapLegend>
      </div>
      <Loading left={width / 2} top={height / 2} size={70} loading={loading} />
    </div>
  );
};

export default MeasurementMap;
