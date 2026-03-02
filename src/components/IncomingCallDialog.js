import React, { useEffect, useRef } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../socket";
import { clearIncomingCall } from "../redux/Slices/app";

const IncomingCallDialog = () => {
  const incomingCall = useSelector((state) => state.app.call?.incoming);

  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!incomingCall) return;

    const socket = getSocket();

    // Play ringtone
    audioRef.current = new Audio("/sounds/ringing.mp3");
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});

    // Auto timeout after 30s
    timeoutRef.current = setTimeout(() => {
      stopRingtone();
      dispatch(clearIncomingCall());
    }, 30000);


    return () => {
      stopRingtone();
      clearTimeout(timeoutRef.current);
      // socket.off("call_rejected");
    };
  }, [incomingCall, dispatch]);

  if (!incomingCall) return null;

  const socket = getSocket();

  const handleAccept = () => {
    socket.emit("call_accept", {
      call_id: incomingCall.call_id,
    });
    stopRingtone();

    dispatch(clearIncomingCall()); // CLOSE DIALOG
  };

  const handleReject = () => {
    socket.emit("call_reject", {
      call_id: incomingCall.call_id,
    });
    stopRingtone();
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
