import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { QRCodeCanvas } from 'qrcode.react';

interface ViewQRCodeProp {
  identity: string;
  qrCode: string;
}

export default function ViewQRCode(props: ViewQRCodeProp) {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState(512);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: Event, newSize: number | number[]) => {
    setSize(newSize as number);
  };

  return (
    <div>
      <Button
        size='small'
        variant='contained'
        endIcon={<QrCodeIcon />}
        onClick={handleClickOpen}
      >
        Show
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registration code</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            The code will be valid for 30 minuites
          </DialogContentText>
          <QRCodeCanvas
            size={size}
            value={props.qrCode.length > 1500 ? '' : props.qrCode}
          ></QRCodeCanvas>
          <Slider
            defaultValue={512}
            min={64}
            max={512}
            aria-label='Volume'
            value={size}
            onChange={handleChange}
          />
          <TextField
            id='outlined-read-only-input'
            defaultValue={props.qrCode}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              display: 'block',
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
