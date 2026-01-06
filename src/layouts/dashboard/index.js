import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { SelectConversation, showSnackbar } from "../../redux/Slices/app";
import { AddDirectConversation, UpdateDirectConversation } from "../../redux/Slices/conversation";

const DashboardLayout = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const { conversations } = useSelector((state) => state.conversation.direct_chat)

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

      // new friend request
      socket.on("new_friend_request", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("request_accepted", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });

      socket.on("start_chat", (data) => {
        console.log(data)
        const existing_conversation = conversations.find((el) => el.id === data._id)

        if (existing_conversation) {
          // after evaluating to true, get the convo
          dispatch(UpdateDirectConversation({ conversattion: data }))
        }
        else {
          dispatch(AddDirectConversation({ conversation: data }))
        }
        dispatch(SelectConversation({ room_id: data._id}))
      })
    }

    return () => {
      socket?.off("new_friend_request")
      socket?.off("request_accepted")
      socket?.off("request_sent")
      socket?.off("start_chat")
    }
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Stack direction="row">
      {/* sidebar */}
      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
