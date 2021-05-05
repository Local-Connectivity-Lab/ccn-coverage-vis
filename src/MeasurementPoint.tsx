import React from 'react';
import { Circle } from 'react-leaflet';

export interface MeasurementDatum {
  latitude: number;
  longitude: number;
  timestamp: string;
  upload_speed: number;
  download_speed: number;
  data_since_last_report: number;
  ping: number;
  site: string;
  device_id: number;
}

interface MeasurementPointProps extends MeasurementDatum {
  color: string;
}

const MeasurementPoint = (props: MeasurementPointProps) => {
  return (
    <Circle
      center={[props.latitude, props.longitude]}
      pathOptions={{ color: props.color, fillColor: props.color }}
    ></Circle>
  );
};

export default MeasurementPoint;
