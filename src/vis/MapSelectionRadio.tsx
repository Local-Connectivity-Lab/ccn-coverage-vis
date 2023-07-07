import React from 'react';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import 'fontsource-roboto';

const MAP_TYPE_INDEX = {
  dbm: 1,
  ping: 1,
  upload_speed: 1,
  download_speed: 1,
} as const;
export type MapType = keyof typeof MAP_TYPE_INDEX;

function isMapType(m: any): m is MapType {
  return m in MAP_TYPE_INDEX;
}

interface MapSelectionRadioProps {
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
  loading: boolean;
}

export default function MapSelectionRadio(props: MapSelectionRadioProps) {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  const handleChange = (event: InputEvent) => {
    const _mapType = event.target.value;
    if (!isMapType(_mapType)) {
      throw new Error('Invalid map type selection: ' + _mapType);
    }
    props.setMapType(_mapType);
  };

  return (
    <Box className='MapSelectionRadio'>
      <FormControl component='fieldset' disabled={props.loading}>
        <Typography variant='overline'>Map Type</Typography>
        <RadioGroup
          aria-label='Map Type'
          name='maptype'
          value={props.mapType}
          onChange={handleChange}
        >
          <FormControlLabel
            value='dbm'
            control={<Radio />}
            label='Signal Strength'
          />
          <FormControlLabel
            value='upload_speed'
            control={<Radio />}
            label='Upload Speed'
          />
          <FormControlLabel
            value='download_speed'
            control={<Radio />}
            label='Download Speed'
          />
          <FormControlLabel value='ping' control={<Radio />} label='Ping' />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
