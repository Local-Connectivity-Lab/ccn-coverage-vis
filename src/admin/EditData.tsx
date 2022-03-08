import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
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
  const [group, setGroup] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value);
  };

  const handleNewGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroup(event.target.value);
  };

  const handleClick = () => {
    axios.post(API_URL + '/secure/upload_data', {
      csv: csv,
      group: group == '' ? newGroup : group
    }).then(res => {
      setLoading(true);
      alert('Successfully replaced');
    }).catch(err => {
      setLoading(true);
      alert(err.response.data.message);
      console.log(err.response.data.message);
    });
  }

  const handleDeleteClick = () => {
    axios.post(API_URL + '/secure/delete_group', {
      group: group
    }).then(res => {
      setLoading(true);
      alert('Successfully deleted');
    }).catch(err => {
      setLoading(true);
      alert(err.response.data.message);
      console.log(err.response.data.message);
    });
  }

  useEffect(() => {
    axios.post(API_URL + '/secure/get_groups').then(res => {
      setGroups(res.data);
      setLoading(false);
    }).catch(err => {
      if (!err) {
        console.log('Unauthorized, please login');
        window.open('/admin/login', '_self');
      }
      console.log(err.response.data.message);
      alert(err.response.data.message);
      setLoading(false);
    });
  }, [loading]);

  return (
    <Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Update measurement data from file
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            {/* <InputLabel id="select-label">Collection</InputLabel> */}
            <Select
              id="select"
              value={group}
              onChange={handleSelectChange}
              disabled={loading}
              displayEmpty
            >
              <MenuItem value="">
                <em>New Collection</em>
              </MenuItem>
              {groups.map((group: string) => (
                <MenuItem value={group}>{group}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField onChange={handleNewGroupChange} id="outlined-basic" label="Collection Name" variant="outlined" sx={{ display: (group !== '' ? 'none' : 'inline') }} />
          <ArrowForwardIosIcon />
          <label htmlFor="contained-button-file">
            <Input accept=".csv" id="contained-button-file" type="file" onChange={handleFileChange} />
            <Button variant="contained" component="span" disabled={loading}>
              Select a CSV
            </Button>
          </label>
          <Button onClick={handleClick} color="secondary" endIcon={<SendIcon />} variant="contained" component="span" disabled={csv === '' ? true : false}>
            Update
          </Button>
          <Button onClick={handleDeleteClick} color="error" endIcon={<DeleteForeverIcon />} variant="contained" component="span" disabled={group === '' ? true : false}>
            Remove
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}