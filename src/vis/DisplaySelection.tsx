import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import 'fontsource-roboto';

interface DisplayOptionsProps {
  displayOptions: DisplayOption[];
  setDisplayOptions: React.Dispatch<React.SetStateAction<DisplayOption[]>>;
  loading: boolean;
}

export const solveDisplayOptions = (displayOptions: DisplayOption[], name: string, value: boolean) => {
  const newOptions: DisplayOption[] = [];
  for (let option of displayOptions) {
    if (option.name === name) {
      option.checked = value;
    }
    newOptions.push(option);
  }
  return newOptions;
}

export default function DisplaySelection(props: DisplayOptionsProps) {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  const handleChange = (event: InputEvent) => {
    const checked = event.target.checked;
    const name = event.target.name;
    const _displayOptions = [...props.displayOptions];
    for (let i = 0; i < _displayOptions.length; i++) {
      if (_displayOptions[i].name === name) {
        _displayOptions[i].checked = checked;
      }
    }
    props.setDisplayOptions(_displayOptions);
  };

  return (
    <Box sx={{ mb: 2 }} className='DisplaySelection'>
      <FormControl component='fieldset' disabled={props.loading}>
        <Typography variant='overline'>Display Options</Typography>
        <FormGroup aria-label='Display Options'>
          {props.displayOptions.map((option: DisplayOption) => (
            <FormControlLabel
              key={option.name}
              control={
                <Checkbox
                  checked={option.checked}
                  name={option.name}
                  onChange={handleChange}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
