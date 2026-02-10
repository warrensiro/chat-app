import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MessageDeleteDialog = ({ open, handleClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this message?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDeleteDialog;
