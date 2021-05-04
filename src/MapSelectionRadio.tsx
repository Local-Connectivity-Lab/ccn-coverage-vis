import React from 'react';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import 'fontsource-roboto';

export default function MapSelectionRadio() {

  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  const [mapType, setMapType] = React.useState('signal');

  const handleChange = (event: InputEvent) => {
    setMapType(event.target.value);
    alert(event.target.value);
  };

  return (
    <div className='App'>
      <Container>
        <FormControl component="fieldset">
          <Typography variant="overline">
            Map Type
          </Typography>
          <RadioGroup row aria-label="gender" name="gender1" value={mapType} onChange={handleChange}>
            <FormControlLabel value="signal" control={<Radio />} label="Signal" />
            <FormControlLabel value="uploadSpeed" control={<Radio />} label="Upload Speed" />
            <FormControlLabel value="downloadSpeed" control={<Radio />} label="Download Speed" />
            <FormControlLabel value="traffic" control={<Radio />} label="Traffic" />
          </RadioGroup>
        </FormControl>
      </Container>
    </div>
  );
}