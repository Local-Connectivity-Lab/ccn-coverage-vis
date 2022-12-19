import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import 'fontsource-roboto';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


interface SidebarProps {

}

const SearchBox = (props: SidebarProps) => {

    return (
        <Box sx={{ width: 240, p: 3 }}>
            <Typography>Search Box</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack mt={1} spacing={3}>
                </Stack>
            </LocalizationProvider>
        </Box>
    );
};

export default SearchBox;
