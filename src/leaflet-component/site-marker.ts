import * as L from 'leaflet';
import { UNITS, MULTIPLIERS } from '../vis/MeasurementMap';
import round2 from '../utils/round-2';

const statusColor: Map<SiteStatus, string> = new Map([
  ['active', 'green'],
  ['confirmed', 'yellow'],
  ['in-conversation', 'red'],
]);

export function isSiteArray(sites: any[]): sites is Site[] {
  return sites.every(isSite);
}

export function isMarkerArray(marker: any[]): marker is Marker[] {
  return marker.every(isMarker);
}

export function isSite(prop: any): prop is Site {
  return (
    typeof prop?.name === 'string' ||
    typeof prop?.latitude === 'number' ||
    typeof prop?.longitude === 'number' ||
    typeof prop?.address === 'string' ||
    prop?.status in statusColor
  );
}

export function isMarker(prop: any): prop is Marker {
  return (
    typeof prop?.latitude === 'number' ||
    typeof prop?.longitude === 'number' ||
    typeof prop?.device_id === 'string' ||
    typeof prop?.cell_id === 'string' ||
    typeof prop?.dbm === 'number' ||
    typeof prop?.upload_speed === 'number' ||
    typeof prop?.download_speed === 'number' ||
    typeof prop?.ping === 'number' ||
    typeof prop?.mid === 'string'
  );
}

export function siteMarker(
  site: Site,
  summary: {
    dbm: number;
    ping: number;
    upload_speed: number;
    download_speed: number;
  },
  map: L.Map
) {
  return L.marker([site.latitude, site.longitude]).bindTooltip(
    `${site.name} <span style="background-color: ${statusColor.get(
      site.status,
    )}">[${site.status}]</span><br />${site.address}<br/>
    signal strength: ${round2(summary?.dbm * MULTIPLIERS.dbm)} ${UNITS.dbm}<br/>
    ping: ${round2(summary?.ping * MULTIPLIERS.ping)} ${UNITS.ping}<br/>
    upload speed: ${round2(summary?.upload_speed * MULTIPLIERS.upload_speed)} ${UNITS.upload_speed
    }<br/>
    download speed: ${round2(
      summary?.download_speed * MULTIPLIERS.download_speed,
    )} ${UNITS.download_speed}`,
  ).on('click', function <LeafletMouseEvent>(e: any) {
    map.setView(e.latlng, 13);
  });
}

export function siteSmallMarker(
  m: Marker
) {
  return L.marker([m.latitude, m.longitude]).bindTooltip(
    `${m.site}
    <br />
    ${m.device_id}
    <br />${m.latitude}, ${m.longitude}<br/>
    signal strength: ${round2(m.dbm * MULTIPLIERS.dbm)} ${UNITS.dbm}<br/>
    ping: ${round2(m.ping * MULTIPLIERS.ping)} ${UNITS.ping}<br/>
    upload speed: ${round2(m.upload_speed * MULTIPLIERS.upload_speed)} ${UNITS.upload_speed
    }<br/>
    download speed: ${round2(
      m.download_speed * MULTIPLIERS.download_speed,
    )} ${UNITS.download_speed}`,
  );
}
