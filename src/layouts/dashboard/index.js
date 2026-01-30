import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, getSocket } from "../../socket";
import { showSnackbar } from "../../redux/Slices/app";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (!isLoggedIn || !user_id) return;

    // Get existing socket or create a new one
    const socket = getSocket() || connectSocket(user_id);

    // Define event handlers
    const handleNewFriendRequest = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };
    const handleRequestAccepted = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };
    const handleRequestSent = (data) => {
      dispatch(showSnackbar({ severity: "success", message: data.message }));
    };

    // Register socket events
    socket.on("new_friend_request", handleNewFriendRequest);
    socket.on("request_accepted", handleRequestAccepted);
    socket.on("request_sent", handleRequestSent);

    // Cleanup on unmount
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
    <Stack direction="row">
      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
