import React from 'react';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import 'fontsource-roboto';

const INITIAL_DISPLAY_OPTIONS = [
  {
    label: 'Graph',
    name: 'displayGraph',
    checked: true,
  },
];

interface DisplayOptionsProps {
  displayOptions: DisplayOption[];
  setDisplayOptions: React.Dispatch<React.SetStateAction<DisplayOption[]>>;
  loading: boolean;
}

export default function DisplaySelection(props: DisplayOptionsProps) {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  const handleChange = (event: InputEvent) => {
    const checked = event.target.checked;
    const name = event.target.name;
    const _displayOptions = props.displayOptions;
    console.log(_displayOptions);
    for (let i = 0; i < _displayOptions.length; i++) {
      if (_displayOptions[i].name === name) {
        _displayOptions[i].checked = checked;
      }
    }
    props.setDisplayOptions(_displayOptions);
  };

  props.setDisplayOptions(INITIAL_DISPLAY_OPTIONS);

  return (
    <Box className='DisplaySelection'>
      <FormControl component='fieldset' disabled={props.loading}>
        <Typography variant='overline'>Display Options</Typography>
        <FormGroup aria-label='Display Options'>
          <FormControlLabel
            control={
              <Checkbox checked name='displayGraph' onChange={handleChange} />
            }
            label='Graph'
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
}
