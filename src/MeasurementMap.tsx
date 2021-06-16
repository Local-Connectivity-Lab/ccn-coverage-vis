import React, { useEffect, useState } from 'react';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import * as d3 from 'd3';
import siteMarker, { isSiteArray } from './leaflet-component/site-marker';
import getBounds from './utils/get-bounds';
import MapLegend from './MapLegend';
import fetchToJson from './utils/fetch-to-json';
import Loading from './Loading';

const ATTRIBUTION =
  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
  'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
  'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
  'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';

const URL = `https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}${
  devicePixelRatio > 1 ? '@2x' : ''
}.png`;

export const API = 'https://support.seattlecommunitynetwork.org/ccn-server/';

const BIN_SIZE_SHIFT = 1;
const DEFAULT_ZOOM = 10;
const LEGEND_WIDTH = 25;

export const UNITS = {
  ping: 'ms',
  download_speed: 'Mbps',
  upload_speed: 'Mbps',
} as const;

export const MULTIPLIERS = {
  ping: 1,
  download_speed: 1 / 1000000,
  upload_speed: 1 / 1000000,
} as const;

const MAP_TYPE_CONVERT = {
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
}

const MeasurementMap = ({
  mapType,
  selectedSites,
  setLoading,
  width,
  height,
  loading,
}: MapProps) => {
  const [cDomain, setCDomain] = useState<number[]>();
  const [map, setMap] = useState<L.Map>();
  const [bounds, setBounds] =
    useState<{ left: number; top: number; width: number; height: number }>();
  const [markers, setMarkers] = useState(new Map<string, L.Marker>());
  const [layer, setLayer] = useState<L.LayerGroup>();

  useEffect(() => {
    (async () => {
      const dataRange = await fetchToJson(API + 'dataRange');
      const _sites = await fetchToJson(API + 'sites');
      const _siteSummary = await fetchToJson(API + 'sitesSummary');
      const _map = L.map('map-id').setView(dataRange.center, DEFAULT_ZOOM);
      const _bounds = getBounds({ ...dataRange, map: _map, width, height });
      const _markers = new Map<string, L.Marker>();

      if (!isSiteArray(_sites)) {
        throw new Error('data has incorrect type');
      }
      _sites.forEach(site =>
        _markers.set(
          site.name,
          siteMarker(site, _siteSummary[site.name]).addTo(_map),
        ),
      );

      L.tileLayer(URL, {
        attribution: ATTRIBUTION,
        maxZoom: 15,
        minZoom: 10,
        opacity: 0.5,
      }).addTo(_map);

      setMarkers(_markers);
      setBounds(_bounds);
      setMap(_map);
      setLayer(L.layerGroup().addTo(_map));
      setLoading(false);
    })();
  }, [setLoading, width, height]);

  useEffect(() => {
    if (!map || !markers) return;

    markers.forEach((marker, site) => {
      if (selectedSites.some(s => s.label === site)) {
        marker.setOpacity(1);
      } else {
        marker.setOpacity(0.5);
      }
    });
  }, [selectedSites, map, markers]);

  useEffect(() => {
    if (!map || !bounds || !layer) return;

    setLoading(true);
    (async () => {
      const bins: number[] = await fetchToJson(
        API +
          'data?' +
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
      );

      const colorDomain = [
        d3.max(bins, d => d * MULTIPLIERS[mapType]) ?? 1,
        d3.min(bins, d => d * MULTIPLIERS[mapType]) ?? 0,
      ];

      const colorScale = d3.scaleSequential(colorDomain, d3.interpolateViridis);
      setCDomain(colorDomain);

      layer.clearLayers();
      bins.forEach((bin, idx) => {
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
          }).addTo(layer);
        }
      });
      setLoading(false);
    })();
  }, [selectedSites, mapType, setLoading, map, layer, bounds]);

  return (
    <div style={{ position: 'relative' }}>
      <div id='map-id' style={{ height, width, position: 'absolute' }}></div>
      <div style={{ position: 'absolute', left: width - LEGEND_WIDTH }}>
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
