import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from 'react-select';
import { DEVICE_OPTIONS } from '../utils/config';
import '@fontsource/roboto';

interface SidebarProps {
  selectedDevices: DeviceOption[];
  setSelectedDevices: React.Dispatch<React.SetStateAction<DeviceOption[]>>;
  loading: boolean;
}

const DeviceSelect = (props: SidebarProps) => {
  const deviceOptions = DEVICE_OPTIONS.map(({ label, value }) => ({
    label: value,
    value: value,
  }));
  
  return (
    <Box mb={2} sx={{ zIndex: 1450 }}>
      <Typography variant='overline'>Display markers</Typography>
      <Select
        isMulti
        options={deviceOptions}
        value={props.selectedDevices}
        onChange={(selected) => props.setSelectedDevices(selected as DeviceOption[])}
        isDisabled={props.loading}
        placeholder="Select..."
      />
    </Box>
  );
};

export default DeviceSelect;