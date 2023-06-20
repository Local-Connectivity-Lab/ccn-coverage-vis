import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { API_URL } from "../utils/config";

interface NewUserDialogProp {
  setCalled: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function NewUserDialog(props: NewUserDialogProp) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    axios
      .post(API_URL + "/secure/new-user", {
        firstName: firstName,
        lastName: lastName,
        email: email,
      })
      .then((res) => {
        props.setCalled(false);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };

  return (
    <div>
      <Stack direction="row" justifyContent="end">
        <Button
          size="large"
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          New user
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Generate registration code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The code will be valid for 30 minuites
          </DialogContentText>
          <form id="new-user-form">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label="First Name"
              type="firstName"
              fullWidth
              variant="standard"
              onChange={(e: any) => setFirstName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="name"
              label="Last Name"
              type="lastName"
              fullWidth
              variant="standard"
              onChange={(e: any) => setLastName(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="my-form-id" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
