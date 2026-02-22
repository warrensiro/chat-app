import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../socket";
import { clearIncomingCall } from "../redux/Slices/app";

const IncomingCallDialog = () => {
  const incomingCall = useSelector((state) => state.app.call?.incoming);

  const dispatch = useDispatch();

  if (!incomingCall) return null;

  const socket = getSocket();

  const handleAccept = () => {
    socket.emit("audio_call_accept", {
      call_id: incomingCall.call_id,
    });

    dispatch(clearIncomingCall()); // CLOSE DIALOG
  };

  const handleReject = () => {
    socket.emit("audio_call_reject", {
      call_id: incomingCall.call_id,
    });
    dispatch(clearIncomingCall()); // CLOSE DIALOG
  };

  return (
    <Dialog open>
      <DialogTitle>Incoming Audio Call</DialogTitle>
      <DialogActions>
        <Button color="error" onClick={handleReject}>
          Reject
        </Button>
        <Button color="success" onClick={handleAccept}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCallDialog;
