import React from 'react';
import { Circle } from 'react-leaflet';
import { ScaleSequential } from 'd3';

interface MeasurementPointProps {
  latitude: number;
  longitude: number;
  timestamp: string;
  upload_speed: number;
  download_speed: number;
  data_since_last_report: number;
  ping: number;
  site: string;
  device_id: number;
  color: ScaleSequential<string, never>
}

const MeasurementPoint = (props: MeasurementPointProps) => {
  return <Circle
    key={`${props.device_id}-${props.timestamp}`}
    center={[props.latitude, props.longitude]}
    color={props.color(props.ping)}
  ></Circle>;
};

export default MeasurementPoint;
