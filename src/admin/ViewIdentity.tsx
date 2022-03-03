import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';

interface NewUserDialogProp {
  identity: string;
}
export default function NewUserDialog(props: NewUserDialogProp) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link component="button" variant="body2" onClick={handleClickOpen}>{"..." + props.identity.substring(56)}</Link>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>View Identity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              id="outlined-read-only-input"
              defaultValue={props.identity}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                display: 'block'
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}