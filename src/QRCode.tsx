import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Loading from './Loading';
import axios from 'axios'
import { API_URL } from './utils/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginBottom: '20px',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function handleEnabledChange() {
  return;
}

export default function QRCode() {
  const classes = useStyles();
  const [loadingUser, setLoadingUser] = useState(true);
  const [pendingUsersRows, setPendingUsersRows] = useState<UserRow[]>([]);
  const [activeUsersRows, setActiveUsersRows] = useState<UserRow[]>([]);
  if (pendingUsersRows.length === 0) {
    axios.post(API_URL + '/secure/get-users', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
    }).then(res => {
      const data: UserRow[] = res.data.pending;
      setPendingUsersRows(data);
      const dataReg: UserRow[] = res.data.registered;
      setActiveUsersRows(dataReg);
      setLoadingUser(false);
    }).catch(err => {
      window.open('/login', '_self');
      setLoadingUser(false);
      return (<div></div>);
    });
  }
  return (
    <Container className={classes.root}>
      <Stack direction="row" justifyContent="end">
        <Button variant="contained" endIcon={<AddIcon />}>
          Add new user
        </Button>
      </Stack>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Pending Registration
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Issue Date</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsersRows.map((row) => (
              <TableRow key={row.identity}>
                <TableCell>{new Date(row.issueDate).toTimeString()}</TableCell>
                <TableCell><a href="#">{"..." + row.identity.substring(56)}</a></TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                <TableCell align="right"><Button>Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Active Users
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Issue Date</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeUsersRows.map((row) => (
              <TableRow key={row.identity}>
                <TableCell>{new Date(row.issueDate).toTimeString()}</TableCell>
                <TableCell><a href="#">{"..." + row.identity.substring(56)}</a></TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                <Switch
                  checked={row.isEnabled}
                  name={row.identity}
                  onChange={handleEnabledChange}
                />
                <TableCell align="right"><Button>Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Loading left={360} top={360} size={70} loading={loadingUser} />
    </Container >
  );
}
