import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QRCode from "react-qr-code";

interface ViewQRCodeProp {
  identity: string,
  qrCode: string
}

export default function ViewQRCode(props: ViewQRCodeProp) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" variant="contained" endIcon={<QrCodeIcon />} onClick={handleClickOpen}>Show</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registration code</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            The code will be valid for 30 minuites
          </DialogContentText>
          <QRCode value="placeholder"></QRCode>
          <TextField
            id="outlined-read-only-input"
            defaultValue={props.qrCode}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              display: 'block'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}