import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
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

    // Play ringtone
    audioRef.current = new Audio("/sounds/ringing.mp3");
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {});

    // 30 sec timeout (no backend reject yet)
    timeoutRef.current = setTimeout(() => {
      stopRingtone();
      dispatch(clearOutgoingCall());
    }, 30000);

    return () => {
      stopRingtone();
      clearTimeout(timeoutRef.current);
    };
  }, [outgoingCall, dispatch]);

  if (!outgoingCall) return null;

  const socket = getSocket();

  const handleCancel = () => {
    socket.emit("call_reject", {
      conversation_id: outgoingCall.conversation_id,
    });

    stopRingtone();
    dispatch(clearOutgoingCall());
  };

  const isVideo = outgoingCall.type === "video";

  return (
    <Dialog open maxWidth="xs" fullWidth>
      <Box sx={{ textAlign: "center", p: 3 }}>
        <DialogTitle sx={{ mb: 1 }}>
          {isVideo ? "Starting Video Call" : "Starting Audio Call"}
        </DialogTitle>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Calling {outgoingCall.to?.firstName || "User"}
        </Typography>

        <Typography color="text.secondary">
          {isVideo ? "Connecting video..." : "Ringing..."}
        </Typography>
      </Box>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OutgoingCallDialog;