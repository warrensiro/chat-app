import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import {
  Archive,
  CircleDashed,
  MagnifyingGlass,
  Users,
  PushPin,
  PushPinSimple,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { useSelector, useDispatch } from "react-redux";
import { setActiveConversation, addConversation } from "../../redux/Slices/app";
import { getSocket } from "../../socket";

const Chats = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { conversations, activeConversation, friendRequests } = useSelector(
    (state) => state.app,
  );
  const userId = localStorage.getItem("user_id");

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = () => setOpenDialog(true);

  const [pinnedChats, setPinnedChats] = useState([]);

  const togglePin = (conversation) => {
    setPinnedChats((prev) => {
      if (prev.find((c) => c._id === conversation._id)) {
        // unpin
        return prev.filter((c) => c._id !== conversation._id);
      } else {
        // pin
        return [conversation, ...prev];
      }
    });
  };

  const hasNoChats = !conversations || conversations.length === 0;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 320,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F5F5F5"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton onClick={handleOpenDialog}>
                <Badge
                  color="error"
                  badgeContent={
                    friendRequests.length > 9 ? "9+" : friendRequests.length
                  }
                  invisible={!friendRequests || friendRequests.length === 0}
                >
                  <Users />
                </Badge>
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>

          {/* Search */}
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#789CE5" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>

          {/* Archive */}
          <Stack spacing={1}>
            <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
              <Archive size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>

          {/* Chats list */}
          <Stack
            direction={"column"}
            sx={{ flexGrow: 1, overflowY: "auto", height: "100%" }}
            spacing={2}
          >
            <SimpleBarStyle
              autoHide
              timeout={800}
              clickOnTrack={false}
              style={{ maxHeight: "100%" }}
            >
              {/* Pinned */}
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#565645" }}>
                  Pinned
                </Typography>
                {pinnedChats.length === 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    No pinned chats
                  </Typography>
                )}
                {pinnedChats.map((conversation) => {
                  const otherUser = conversation.participants?.find(
                    (p) => String(p._id) !== String(userId),
                  );
                  if (!otherUser) return null;

                  const lastMsg =
                    conversation.messages && conversation.messages.length > 0
                      ? conversation.messages[conversation.messages.length - 1]
                          .text
                      : "No messages yet";

                  return (
                    <ChatElement
                      key={conversation._id}
                      name={`${otherUser.firstName} ${otherUser.lastName}`}
                      msg={lastMsg}
                      online={otherUser.status === "Online"}
                      selected={activeConversation?._id === conversation._id}
                      onClick={() =>
                        dispatch(setActiveConversation(conversation))
                      }
                      pinned
                      togglePin={() => togglePin(conversation)}
                      unread={conversation.unread}
                    />
                  );
                })}
              </Stack>

              {/* Divider */}
              <Divider />

              {/* All Chats */}
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#565645" }}>
                  All Chats
                </Typography>

                {hasNoChats ? (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    No conversations yet
                  </Typography>
                ) : (
                  conversations
                    .filter((c) => !pinnedChats.find((p) => p._id === c._id))
                    .map((conversation) => {
                      const otherUser = conversation.participants?.find(
                        (p) => String(p._id) !== String(userId),
                      );
                      if (!otherUser) return null;

                      const lastMsg =
                        conversation.messages &&
                        conversation.messages.length > 0
                          ? conversation.messages[
                              conversation.messages.length - 1
                            ].text
                          : "No messages yet";

                      return (
                        <ChatElement
                          key={conversation._id}
                          name={`${otherUser.firstName} ${otherUser.lastName}`}
                          msg={lastMsg}
                          online={otherUser.status === "Online"}
                          selected={
                            activeConversation?._id === conversation._id
                          }
                          onClick={() =>
                            dispatch(setActiveConversation(conversation))
                          }
                          pinned={false}
                          togglePin={() => togglePin(conversation)}
                        />
                      );
                    })
                )}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>

      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
