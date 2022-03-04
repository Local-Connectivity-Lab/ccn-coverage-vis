import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import { API_URL } from '../utils/config'
import '../utils/fonts.css';

// var newSites = "";
const Input = styled('input')({
  display: 'none',
});

// TODO: Remove async and add loading element
// TODO: Return different response, don't rely on alert()
export default function EditData() {
  const [fileName, setFileName] = useState('');
  const [csv, setCsv] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const text = (e.target.result || '')
      setCsv(text);
    };
    if (e.target && e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0])
    }
  }

  const handleClick = () => {
    axios.post(API_URL + '/secure/upload_data', {
      csv
    }).then(res => {
      alert('Successful');
    }).catch(err => {
      alert('Database error');
      console.log(err);
    });
  }

  return (
    <Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography variant="h4" gutterBottom>
          Update measurement data from file
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body1">
            {fileName === '' ? 'Please select a CSV' : fileName}
          </Typography>
          <label htmlFor="contained-button-file">
            <Input accept=".csv" id="contained-button-file" type="file" onChange={handleChange} />
            <Button variant="contained" component="span">
              Select a file
            </Button>
          </label>
          <Button onClick={handleClick} color="secondary" endIcon={<SendIcon />} variant="contained" component="span" disabled={csv === '' ? true : false}>
            Upload
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}