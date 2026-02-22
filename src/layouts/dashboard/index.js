import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, getSocket } from "../../socket";
import { showSnackbar } from "../../redux/Slices/app";
import { initSocketListeners } from "../../socketListeners";
import IncomingCallDialog from "../../components/IncomingCallDialog";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (!isLoggedIn || !user_id) return;

    // Connect socket if not connected
    const socket = getSocket() || connectSocket(user_id);

    // 🔥 Initialize ALL listeners (messages + calls)
    initSocketListeners(dispatch, user_id);

    // ---- Your existing friend handlers ----
    const handleNewFriendRequest = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };

    const handleRequestAccepted = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };

    const handleRequestSent = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };

    socket.on("new_friend_request", handleNewFriendRequest);
    socket.on("request_accepted", handleRequestAccepted);
    socket.on("request_sent", handleRequestSent);

    return () => {
      socket.off("new_friend_request", handleNewFriendRequest);
      socket.off("request_accepted", handleRequestAccepted);
      socket.off("request_sent", handleRequestSent);
    };
  }, [isLoggedIn, user_id, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      {/* 🔥 Global Call UI */}
      <IncomingCallDialog />

      <Stack direction="row">
        <Sidebar />
        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;