import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import Loading from '../Loading';
import axios from 'axios';
import { API_URL } from '../utils/config'
import '../utils/fonts.css';
var newSites = "";
export default function EditSite() {
  const [loadingSites, setLoadingSites] = useState(true);
  const [sites, setSites] = useState<string>("");
  // const [newSites, setNewSites] = useState<string>("");
  const [openJsonError, setOpenJsonError] = React.useState(false);
  const [openApiError, setOpenApiError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const handleCloseJsonError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenJsonError(false);
  };
  const handleCloseApiError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenApiError(false);
  };
  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    newSites = e.target.value;
  };
  const handleSubmit = () => {
    var sitesJson = "";
    try {
      const siteObj = JSON.parse(newSites);
      sitesJson = JSON.stringify(siteObj);
    } catch {
      setOpenSuccess(false);
      setOpenApiError(false);
      setOpenJsonError(true);
      return;
    }
    axios.post(API_URL + '/secure/edit_sites', {
      username: localStorage.getItem('username') || "",
      token: localStorage.getItem('token') || "",
      sites: sitesJson
    }).then(res => {
      setOpenApiError(false);
      setOpenJsonError(false);
      setOpenSuccess(true);
      reloadSites();
    }).catch(err => {
      setOpenApiError(false);
      setOpenSuccess(false);
      setOpenApiError(true);
      console.log(err);
    });
  }
  const reloadSites = () => {
    axios.get(API_URL + '/api/sites').then(res => {
      const sites = res.data;
      setLoadingSites(false);
      setSites(JSON.stringify(sites, null, 2));
      newSites = JSON.stringify(sites, null, 2);
    }).catch(err => {
      setLoadingSites(false);
      return (<div></div>);
    });
  }
  useEffect(() => {
    reloadSites();
  })
  return (
    <Box className='UserPage' >
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="end">
        <Button size="large" variant="contained" endIcon={<EditLocationAltIcon />} onClick={handleSubmit}>
          Edit Site
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Current Site Information
            </Typography>
            <TextField InputProps={{
              style: { fontFamily: 'Roboto Mono, monospace' }
            }} disabled multiline fullWidth id="current-site" value={sites} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              New Site Information
            </Typography>
            <TextField InputProps={{
              style: { fontFamily: 'Roboto Mono, monospace' }
            }} multiline fullWidth id="new-site" defaultValue={sites} onChange={onChange} />
          </Paper>
        </Grid>
      </Grid>
      <Stack sx={{ mt: 2 }} direction="row" justifyContent="end">
        <Button size="large" variant="contained" endIcon={<EditLocationAltIcon />} onClick={handleSubmit}>
          Edit Site
        </Button>
      </Stack>
      <Loading left={360} top={360} size={70} loading={loadingSites} />
      <Snackbar open={openJsonError} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} onClose={handleCloseJsonError}>
        <Alert onClose={handleCloseJsonError} severity="warning" sx={{ width: '100%' }}>
          Cannot parse JSON
        </Alert>
      </Snackbar>
      <Snackbar open={openApiError} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} onClose={handleCloseApiError}>
        <Alert onClose={handleCloseApiError} severity="error" sx={{ width: '100%' }}>
          Internal Server Error
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
    </Box >
  );
}
