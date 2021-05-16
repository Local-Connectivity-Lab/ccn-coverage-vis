import React, { useEffect, useRef } from 'react';
import sites from './sites.json';
import data from './data-small.json';
import { MapType } from './MapSelectionRadio';
import * as L from 'leaflet';
import * as d3 from 'd3';

interface MapProps {
  colorScale: any,
  mapType: any,
  width: number
}

const MapLegend = ({
  colorScale,
  mapType,
  width
}: MapProps) => {

  return (
    <svg
      id='map-legend'
      className={"leaflet-control"}
    ></svg>
  );
};

export default MapLegend;
