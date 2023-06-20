import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "fontsource-roboto";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface SidebarProps {
  timeFrom: Date;
  timeTo: Date;
  setTimeFrom: React.Dispatch<React.SetStateAction<Date>>;
  setTimeTo: React.Dispatch<React.SetStateAction<Date>>;
  loading: boolean;
}

const DateSelect = (props: SidebarProps) => {
  const handleChangeTimeFrom = (newValue: Date | null) => {
    if (newValue) {
      props.setTimeFrom(newValue);
    }
  };

  const handleChangeTimeTo = (newValue: Date | null) => {
    if (newValue) {
      props.setTimeTo(newValue);
    }
  };

  return (
    <Box mb={2}>
      <Typography variant="overline">Filter Date Time</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack mt={1} spacing={3}>
          <DateTimePicker
            label="Start Date"
            value={props.timeFrom}
            onChange={handleChangeTimeFrom}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            label="End Date"
            value={props.timeTo}
            onChange={handleChangeTimeTo}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </LocalizationProvider>
    </Box>
  );
};

export default DateSelect;
