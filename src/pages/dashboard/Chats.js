import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import { Archive, CircleDashed, MagnifyingGlass, Users } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";

import { SimpleBarStyle } from "../../components/Scrollbar";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";

import { setActiveConversation } from "../../redux/Slices/app";
import { getSocket } from "../../socket";
import { initSocketListeners } from "../../socketListeners";

const Chats = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux state
  const { conversations, activeConversation, friendRequests } = useSelector(
    (state) => state.app,
  );
  const userId = useSelector((state) => state.auth.userId);

  // Local UI state
  const [openDialog, setOpenDialog] = useState(false);
  const [pinnedChats, setPinnedChats] = useState([]);

  // 🔁 Reset pinned chats when user changes
  useEffect(() => {
    setPinnedChats([]);
  }, [userId]);

  // 🔌 Initialize socket listeners per user
  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    if (!socket) return;

    initSocketListeners(dispatch, userId);

    return () => {
      socket.removeAllListeners();
    };
  }, [userId, dispatch]);

  const togglePin = (conversationId) => {
    setPinnedChats((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [conversationId, ...prev],
    );
  };

  const [search, setSearch] = useState("");

  const hasNoChats = !conversations || conversations.length === 0;
  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = conversation.participants?.find(
      (p) => String(p._id) !== String(userId),
    );

    if (!otherUser) return false;

    const fullName =
      `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();

    return fullName.includes(search.toLowerCase());
  });

  return (
    <>
      <Box
        sx={{
          width: 320,
          height: "100vh",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F5F5F5"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: "100%" }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setOpenDialog(true)}>
                <Badge
                  color="error"
                  badgeContent={
                    friendRequests.length > 9 ? "9+" : friendRequests.length
                  }
                  invisible={!friendRequests?.length}
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
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#789CE5" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>

          {/* Archive */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Archive size={22} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>

          {/* Chat list */}
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <SimpleBarStyle
              autoHide
              timeout={800}
              style={{ maxHeight: "100%" }}
            >
              {/* Pinned */}
              <Stack spacing={2}>
                <Typography variant="subtitle2">Pinned</Typography>

                {pinnedChats.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No pinned chats
                  </Typography>
                )}

                {filteredConversations
                  .filter((c) => pinnedChats.includes(c._id))
                  .map((conversation) => {
                    const otherUser = conversation.participants?.find(
                      (p) => String(p._id) !== String(userId),
                    );
                    if (!otherUser) return null;

                    const lastMessage = conversation.messages?.at(-1);

                    const lastMsg = lastMessage?.text || "No messages yet";
                    const lastTime = lastMessage?.createdAt;

                    return (
                      <ChatElement
                        key={conversation._id}
                        name={`${otherUser.firstName} ${otherUser.lastName}`}
                        msg={lastMsg}
                        time={lastTime}
                        online={otherUser.status === "Online"}
                        selected={activeConversation?._id === conversation._id}
                        onClick={() =>
                          dispatch(
                            setActiveConversation({
                              conversationId: conversation._id,
                              userId,
                            }),
                          )
                        }
                        togglePin={() => togglePin(conversation)}
                        unread={conversation.unread}
                        pinned={true}
                      />
                    );
                  })}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* All chats */}
              <Stack spacing={2}>
                <Typography variant="subtitle2">All Chats</Typography>

                {hasNoChats ? (
                  <Typography variant="caption" color="text.secondary">
                    No conversations yet
                  </Typography>
                ) : (
                  filteredConversations
                    .filter((c) => !pinnedChats.includes(c._id))
                    .map((conversation) => {
                      const otherUser = conversation.participants?.find(
                        (p) => String(p._id) !== String(userId),
                      );
                      if (!otherUser) return null;

                      const lastMessage = conversation.messages?.at(-1);

                      const lastMsg = lastMessage?.text || "No messages yet";
                      const lastTime = lastMessage?.createdAt;

                      const isPinned = pinnedChats.includes(conversation._id);

                      return (
                        <ChatElement
                          key={conversation._id}
                          name={`${otherUser.firstName} ${otherUser.lastName}`}
                          msg={lastMsg}
                          time={lastTime}
                          online={otherUser.status === "Online"}
                          selected={
                            activeConversation?._id === conversation._id
                          }
                          onClick={() =>
                            dispatch(
                              setActiveConversation({
                                conversationId: conversation._id,
                                userId,
                              }),
                            )
                          }
                          togglePin={() => togglePin(conversation)}
                          unread={conversation.unread}
                          pinned={isPinned}
                        />
                      );
                    })
                )}
              </Stack>
            </SimpleBarStyle>
          </Box>
        </Stack>
      </Box>

      {openDialog && (
        <Friends open={openDialog} handleClose={() => setOpenDialog(false)} />
      )}
    </>
  );
};

export default Chats;
