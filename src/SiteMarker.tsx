import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import * as d3 from 'd3';

type SiteStatus = 'active' | 'confirmed' | 'in-conversation';
const colorDomain: SiteStatus[] = ['active', 'confirmed', 'in-conversation'];
const colorRange = ['green', 'yellow', 'red'] as const;
const statusColor = d3
  .scaleOrdinal<string>()
  .domain(colorDomain)
  .range(colorRange);

export interface SiteMarkerProps {
  name: string;
  latitude: number;
  longitude: number;
  status: SiteStatus;
  address: string;
}

export function isSiteMarkerProps(prop: any): prop is SiteMarkerProps {
  return (
    typeof prop?.name === 'string' ||
    typeof prop?.latitude === 'number' ||
    typeof prop?.longitude === 'number' ||
    typeof prop?.address === 'string' ||
    colorDomain.includes(prop?.status)
  );
}

const SiteMarker = (props: SiteMarkerProps) => {
  return (
    <Marker key={props.name} position={[props.latitude, props.longitude]}>
      <Popup>
        {props.name}
        <span style={{ backgroundColor: statusColor(props.status) }}>
          [{props.status}]
        </span>
        <br />
        {props.address}
      </Popup>
    </Marker>
  );
};

export default SiteMarker;
