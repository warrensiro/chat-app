import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { getSocket } from "../socket";
import React, { useState } from "react";
import { Chat } from "phosphor-react";

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

// ----------------------
// UserComponent
// ----------------------
const UserComponent = ({ firstName, lastName, _id, online, img }) => {
  const [sent, setSent] = useState(false);
  const name = `${firstName} ${lastName}`;
  const theme = useTheme();
  const socket = getSocket();

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={"center"} justifyContent="space-between">
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle">{name}</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            disabled={sent}
            onClick={() => {
              if (!socket) return console.error("Socket not connected");
              socket.emit("friend_request", { to: _id }, () => setSent(true));
            }}
          >
            {sent ? "Request Sent" : "Send Request"}
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

// ----------------------
// FriendRequestComponent
// ----------------------
const FriendRequestComponent = ({ firstName, lastName, _id, online, img, id }) => {
  const name = `${firstName} ${lastName}`;
  const theme = useTheme();
  const socket = getSocket();

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={"center"} justifyContent="space-between">
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle">{name}</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              if (!socket) return console.error("Socket not connected");
              socket.emit("accept_request", { request_id: id });
            }}
          >
            Accept Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};


const FriendComponent = ({
  firstName,
  lastName,
  _id,
  online,
  img,
  onConversationStart, // callback to close modal
}) => {
  const name = `${firstName} ${lastName}`;
  const theme = useTheme();
  const socket = getSocket();

  const handleStartConversation = () => {
    if (!socket) return console.error("Socket not connected");

    // Listen for server confirmation of conversation
    const handleConversationStarted = ({ conversation }) => {
      if (!conversation) return;

      // Only trigger if this friend is part of the conversation
      if (conversation.participants.some((p) => String(p._id) === String(_id))) {
        console.log("Conversation started:", conversation._id);

        // Close parent dialog
        if (onConversationStart) onConversationStart();

        // Cleanup listener
        socket.off("conversation_started", handleConversationStarted);
      }
    };

    socket.on("conversation_started", handleConversationStarted);

    // Emit event to server
    socket.emit("start_conversation", { to: _id });
  };

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={"center"} justifyContent="space-between">
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle">{name}</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton onClick={handleStartConversation}>
            <Chat />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { UserComponent, FriendRequestComponent, FriendComponent };
