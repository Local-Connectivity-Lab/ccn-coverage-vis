import * as L from 'leaflet';
import { UNITS, MULTIPLIERS } from '../MeasurementMap';
import round2 from '../utils/round-2';

const statusColor: Map<SiteStatus, string> = new Map([
  ['active', 'green'],
  ['confirmed', 'yellow'],
  ['in-conversation', 'red'],
]);

export function isSiteArray(sites: any[]): sites is Site[] {
  return sites.every(isSite);
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

export default function siteMarker(
  site: Site,
  summary: {
    dbm: number;
    ping: number;
    upload_speed: number;
    download_speed: number;
  },
) {
  return L.marker([site.latitude, site.longitude]).bindTooltip(
    `${site.name} <span style="background-color: ${statusColor.get(
      site.status,
    )}">[${site.status}]</span><br />${site.address}<br/>
    signal strength: ${round2(summary?.dbm * MULTIPLIERS.dbm)} ${UNITS.dbm}<br/>
    ping: ${round2(summary?.ping * MULTIPLIERS.ping)} ${UNITS.ping}<br/>
    upload speed: ${round2(summary?.upload_speed * MULTIPLIERS.upload_speed)} ${
      UNITS.upload_speed
    }<br/>
    download speed: ${round2(
      summary?.download_speed * MULTIPLIERS.download_speed,
    )} ${UNITS.download_speed}`,
  );
}
