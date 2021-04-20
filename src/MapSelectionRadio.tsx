import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import 'fontsource-roboto';

export default function MapSelectionRadio() {
    
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  const [mapType, setMapType] = React.useState('signal');

  const handleChange = (event: InputEvent) => {
    setMapType(event.target.value);
    alert(event.target.value);
  };
  // TODO: Modulize it
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(3),
    },
  }));
  const classes = useStyles();

  return (
    <div className='App'>
      <Container>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Map Type</FormLabel>
          <RadioGroup row aria-label="gender" name="gender1" value={mapType} onChange={handleChange}>
            <FormControlLabel value="signal" control={<Radio />} label="Signal" />
            <FormControlLabel value="uploadSpeed" control={<Radio />} label="Upload Speed" />
            <FormControlLabel value="downloadSpeed" control={<Radio />} label="Download Speed" />
            <FormControlLabel value="traffic" control={<Radio />} label="Traffic" />
          </RadioGroup>
        </FormControl>
        <img src="https://via.placeholder.com/350x150" />
      </Container>
    </div>
  );
}