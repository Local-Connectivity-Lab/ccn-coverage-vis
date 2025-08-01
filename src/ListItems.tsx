import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SyncIcon from '@mui/icons-material/Sync';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import { ListItemButton } from '@mui/material';

export const mainListItems = (
  <div>
    <ListSubheader inset>Admin Panel</ListSubheader>
    <ListItemButton onClick={() => window.open('/admin/users', '_self')}>
      <ListItemIcon>
        <ManageAccountsIcon />
      </ListItemIcon>
      <ListItemText primary='Manage users' />
    </ListItemButton>
    <ListItemButton onClick={() => window.open('/admin/edit-site', '_self')}>
      <ListItemIcon>
        <EditLocationAltIcon />
      </ListItemIcon>
      <ListItemText primary='Edit Site Information' />
    </ListItemButton>
    <ListItemButton onClick={() => window.open('/admin/edit-data', '_self')}>
      <ListItemIcon>
        <SyncIcon />
      </ListItemIcon>
      <ListItemText primary='Update Data' />
    </ListItemButton>
    <ListItemButton
      onClick={() => window.open('/admin/list-sites', '_self')}
    >
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText primary='New Edit Site' />
    </ListItemButton>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>User Panel</ListSubheader>
    <ListItemButton onClick={() => window.open('/')}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary='Visualization' />
    </ListItemButton>
  </div>
);

export const homeListItems = (
  <div>
    <ListItemButton onClick={() => window.open('login')}>
      <ListItemIcon>
        <AdminPanelSettingsIcon />
      </ListItemIcon>
      <ListItemText primary='Admin Panel' />
    </ListItemButton>
  </div>
);
