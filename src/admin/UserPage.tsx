import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NewUserDialog from './NewUserDialog';
import EditIcon from '@mui/icons-material/Edit';
import ViewQRCode from './ViewQRCode';
import ViewIdentity from './ViewIdentity';
import Loading from '../Loading';
import { apiClient } from '@/utils/fetch';

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
      apiClient
        .POST('/secure/get-users')
        .then(resp => {
          const { data, error } = resp;
          if (!data || error) {
            console.log(`Unable to get user: ${error}`);
            return;
          }
          const pending: UserRow[] = data.pending.map(p => ({
            ...p,
            issueDate: new Date(p.issueDate),
          }));
          setPendingUsersRows(pending);
          const registered: UserRow[] = data.registered.map(r => ({
            ...r,
            issueDate: new Date(r.issueDate),
          }));
          setActiveUsersRows(registered);
          setLoadingUser(false);
          setCalled(true);
        })
        .catch(err => {
          alert(err);
          window.open('/login', '_self');
          setLoadingUser(false);
          console.error(`Error occurred while querying user: ${err}`);
          return <div></div>;
        });
    }
  });
  return (
    <Box className='UserPage'>
      <NewUserDialog setCalled={setCalled} />
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography component='h2' variant='h6' color='primary' gutterBottom>
          Pending Registration
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Issue Date</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUsersRows.map(row => (
              <TableRow key={row.identity}>
                <TableCell>{new Date(row.issueDate).toString()}</TableCell>
                <TableCell>
                  <ViewIdentity identity={row.identity}></ViewIdentity>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                <TableCell align='right'>
                  <ViewQRCode identity={row.identity} qrCode={row.qrCode} />
                </TableCell>
                <TableCell align='right'>
                  <Button
                    size='small'
                    color='error'
                    variant='contained'
                    endIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', my: 2 }}>
        <Typography component='h2' variant='h6' color='primary' gutterBottom>
          Active Users
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Issue Date</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeUsersRows.map(row => (
              <TableRow key={row.identity}>
                <TableCell>{new Date(row.issueDate).toString()}</TableCell>
                <TableCell>
                  <ViewIdentity identity={row.identity}></ViewIdentity>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                <TableCell>
                  <Switch
                    checked={row.isEnabled}
                    name={row.identity}
                    onChange={handleEnabledChange}
                  />
                </TableCell>
                <TableCell align='right'>
                  <Button
                    size='small'
                    color='error'
                    variant='contained'
                    endIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Loading left={360} top={360} size={70} loading={loadingUser} />
    </Box>
  );
}
