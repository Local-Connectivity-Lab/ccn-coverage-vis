import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import '@fontsource/roboto';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

interface SidebarProps {
  timeFrom: Date;
  timeTo: Date;
  setTimeFrom: React.Dispatch<React.SetStateAction<Date>>;
  setTimeTo: React.Dispatch<React.SetStateAction<Date>>;
  loading: boolean;
}

const DateSelect = (props: SidebarProps) => { 
  const handleChangeTimeFrom = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      props.setTimeFrom(newValue.toDate());
    }
  };

  const handleChangeTimeTo = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      props.setTimeTo(newValue.toDate());
    }
  };

  return (
    <Box mb={2}>
      <Typography variant='overline'>Filter Date Time</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack mt={1} spacing={3}>
          <DateTimePicker
            label='Start Date'
            value={dayjs(props.timeFrom)}
            onChange={handleChangeTimeFrom}
            disabled={!props.loading}
          />
          <DateTimePicker
            label='End Date'
            value={dayjs(props.timeTo)}
            onChange={handleChangeTimeTo}
            disabled={!props.loading}
          />
        </Stack>
      </LocalizationProvider>
    </Box>
  );
};

export default DateSelect;
