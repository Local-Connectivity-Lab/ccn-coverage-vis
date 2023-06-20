import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SyncIcon from "@mui/icons-material/Sync";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const mainListItems = (
  <div>
    <ListSubheader inset>Admin Panel</ListSubheader>
    <ListItem button onClick={() => window.open("/admin/users", "_self")}>
      <ListItemIcon>
        <ManageAccountsIcon />
      </ListItemIcon>
      <ListItemText primary="Manage users" />
    </ListItem>
    <ListItem button onClick={() => window.open("/admin/edit-site", "_self")}>
      <ListItemIcon>
        <EditLocationAltIcon />
      </ListItemIcon>
      <ListItemText primary="Edit Site Information" />
    </ListItem>
    <ListItem button onClick={() => window.open("/admin/edit-data", "_self")}>
      <ListItemIcon>
        <SyncIcon />
      </ListItemIcon>
      <ListItemText primary="Update Data" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>User Panel</ListSubheader>
    <ListItem button onClick={() => window.open("/")}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Visualization" />
    </ListItem>
  </div>
);

export const homeListItems = (
  <div>
    <ListItem button onClick={() => window.open("login")}>
      <ListItemIcon>
        <AdminPanelSettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Admin Panel" />
    </ListItem>
  </div>
);
