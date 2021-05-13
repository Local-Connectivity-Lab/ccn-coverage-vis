import * as L from 'leaflet';

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

export default function siteMarker(site: Site) {
  return L.marker([site.latitude, site.longitude]).bindPopup(
    `${site.name} <span stype="background-color: ${statusColor.get(
      site.status,
    )}">[${site.status}]</span><br />${site.address}`,
  );
}
