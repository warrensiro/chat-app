import React, { useState, useRef } from "react";
import {
  Box,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Fab,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Image,
  Camera,
  Sticker,
  File,
  User,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getSocket } from "../../socket";
import { useDispatch } from "react-redux";
import { addMessageToActiveConversation } from "../../redux/Slices/app";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-Input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
  { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
  { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
  { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
  { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

/* ---------------------------------- */
/* Chat Input Component */
/* ---------------------------------- */
const ChatInput = ({
  message,
  setMessage,
  setOpenPicker,
  onSend,
  onTyping,
}) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
        onTyping();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSend();
        }
      }}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((el) => (
                <Tooltip key={el.title} title={el.title} placement="right">
                  <Fab
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment position="start">
              <IconButton onClick={() => setOpenActions((p) => !p)}>
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setOpenPicker((p) => !p)}>
              <Smiley />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

/* ---------------------------------- */
/* Footer */
/* ---------------------------------- */
const Footer = ({ conversation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = useState(false);

  const socket = getSocket();
  const typingTimeout = useRef(null);

  /* ---------- typing indicator ---------- */
  const handleTyping = () => {
    if (!socket || !conversation?._id) return;

    socket.emit("typing_start", {
      conversation_id: conversation._id,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", {
        conversation_id: conversation._id,
      });
    }, 1000);
  };

  /* ---------- send message ---------- */
  const handleSendMessage = () => {
    if (!message.trim() || !conversation?._id) return;

    const userId = localStorage.getItem("user_id");
    const to = conversation.participants.find(
      (p) => String(p._id) !== String(userId),
    )?._id;

    if (!to) return;

    const clientId = crypto.randomUUID();

    const optimisticMessage = {
      _id: clientId,
      client_id: clientId,
      from: userId,
      to,
      text: message,
      type: "Text",
      created_at: Date.now(),
    };

    dispatch(
      addMessageToActiveConversation({
        conversation_id: conversation._id,
        message: optimisticMessage,
      }),
    );

    socket?.emit("text_message", {
      from: userId,
      to,
      conversation_id: conversation._id,
      message,
      type: "Text",
      client_id: clientId,
    });

    socket?.emit("typing_stop", {
      conversation_id: conversation._id,
    });

    setMessage("");
  };

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F5F5F5"
            : theme.palette.background.paper,
        boxShadow: "0px -1px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack sx={{ width: "100%" }}>
          {/* Emoji Picker */}
          {openPicker && (
            <Box
              sx={{
                position: "fixed",
                bottom: 90,
                right: 120,
                zIndex: 10,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(e) => setMessage((prev) => prev + e.native)}
              />
            </Box>
          )}

          <ChatInput
            message={message}
            setMessage={setMessage}
            setOpenPicker={setOpenPicker}
            onSend={handleSendMessage}
            onTyping={handleTyping}
          />
        </Stack>

        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{ height: "100%", width: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton onClick={handleSendMessage}>
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
