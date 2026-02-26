import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../socket";
import { clearOutgoingCall } from "../redux/Slices/app";

const OutgoingCallDialog = () => {
  const dispatch = useDispatch();
  const outgoingCall = useSelector((state) => state.app.call?.outgoing);

  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!outgoingCall) return;

    const socket = getSocket(); // ✅ inside effect

    // 🔔 Play ringtone
    audioRef.current = new Audio("/sounds/ringing.mp3");
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});

    // ⏳ 30 sec timeout
    timeoutRef.current = setTimeout(() => {
      socket.emit("call_reject", {
        call_id: outgoingCall.call_id,
      });

      stopRingtone();
      dispatch(clearOutgoingCall());
    }, 30000);

    return () => {
      stopRingtone();
      clearTimeout(timeoutRef.current);
    };
  }, [outgoingCall, dispatch]); // ✅ correct deps

  if (!outgoingCall) return null;

  const handleCancel = () => {
    const socket = getSocket();

    socket.emit("call_reject", {
      call_id: outgoingCall.call_id,
    });

    stopRingtone();
    dispatch(clearOutgoingCall());
  };

  return (
    <Dialog open>
      <DialogTitle>
        Calling {outgoingCall.to?.firstName || "User"}...
      </DialogTitle>
      <Typography sx={{ px: 3 }}>Ringing...</Typography>
      <DialogActions>
        <Button color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OutgoingCallDialog;