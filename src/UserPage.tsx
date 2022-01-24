import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import NewUserDialog from './NewUserDialog';
import EditIcon from '@mui/icons-material/Edit';
import ViewQRCode from './ViewQRCode';
import ViewIdentity from './ViewIdentity';
import Loading from './Loading';
import axios from 'axios'
import { API_URL } from './utils/config'

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//       marginBottom: '20px',
//     },
//     menuButton: {
//       marginRight: theme.spacing(2),
//     },
//     title: {
//       flexGrow: 1,
//     },
//   }),
// );

function handleEnabledChange() {
  return;
}

export default function UserPage() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [called, setCalled] = useState(false);
  const [pendingUsersRows, setPendingUsersRows] = useState<UserRow[]>([]);
  const [activeUsersRows, setActiveUsersRows] = useState<UserRow[]>([]);
  useEffect(() => {
    if (!called) {
      axios.post(API_URL + '/secure/get-users', {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
      }).then(res => {
        const data: UserRow[] = res.data.pending;
        setPendingUsersRows(data);
        const dataReg: UserRow[] = res.data.registered;
        setActiveUsersRows(dataReg);
        setLoadingUser(false);
        setCalled(true);
      }).catch(err => {
        window.open('/login', '_self');
        setLoadingUser(false);
        return (<div></div>);
      });
    }
  })
  return (
    <Container className='UserPage'>
      <NewUserDialog setCalled={setCalled} />
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
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsersRows.map((row) => (
              <TableRow key={row.identity}>
                <TableCell>{new Date(row.issueDate).toString()}</TableCell>
                <TableCell><ViewIdentity identity={row.identity}></ViewIdentity></TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                <TableCell align="right"><ViewQRCode identity={row.identity} qrCode={row.qrCode} /></TableCell>
                <TableCell align="right"><Button size="small" color="error" variant="contained" endIcon={<EditIcon />}>Edit</Button></TableCell>

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
                <TableCell>{new Date(row.issueDate).toString()}</TableCell>
                <TableCell><ViewIdentity identity={row.identity}></ViewIdentity></TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + " " + row.lastName}</TableCell>
                <TableCell><Switch
                  checked={row.isEnabled}
                  name={row.identity}
                  onChange={handleEnabledChange}
                /></TableCell>
                <TableCell align="right"><Button size="small" color="error" variant="contained" endIcon={<EditIcon />}>Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Loading left={360} top={360} size={70} loading={loadingUser} />
    </Container >
  );
}
