import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Footer from './Footer';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { API_URL } from './utils/config'
const theme = createTheme();

export default function Login() {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    axios.post(API_URL + '/secure/login', {
      username: data.get('username'),
      password: data.get('password'),
    }).then(res => {
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('exp', res.data.exp);
      if (res.data === "success") {
        window.open('/admin/users', '_self');
      } else {
        setOpen(true);
      }
    }).catch(err => {
      console.log(err);
      setOpen(true);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                Incorrect username or password
              </Alert>
            </Snackbar>
          </Box>
        </Box>
        <Footer />
      </Container>
    </ThemeProvider >
  );
}
