import React from 'react';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import 'fontsource-roboto';

const MAP_TYPE_INDEX = {
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
    <div className='App'>
      <Container>
        <FormControl component='fieldset'>
          <Typography variant='overline'>Map Type</Typography>
          <RadioGroup
            row
            aria-label='gender'
            name='gender1'
            value={props.mapType}
            onChange={handleChange}
          >
            {/* remove signal for now because we don't have "signal" in our mock data */}
            {/* <FormControlLabel value="signal" control={<Radio />} label="Signal" /> */}
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
      </Container>
    </div>
  );
}
