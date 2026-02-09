import React, { useState, useRef } from "react";
import {
  Box,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Fab,
  Tooltip,
  Typography,
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
  X,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getSocket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageToActiveConversation,
  clearReplyTo,
} from "../../redux/Slices/app";

/* ------------------------------ */
/* Styled Input */
/* ------------------------------ */
const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-Input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

/* ------------------------------ */
/* Attachment Actions */
/* ------------------------------ */
const Actions = [
  { color: "#4da5fe", icon: <Image size={24} />, y: 102, title: "Photo/Video" },
  { color: "#1b8cfe", icon: <Sticker size={24} />, y: 172, title: "Stickers" },
  { color: "#0172e4", icon: <Camera size={24} />, y: 242, title: "Image" },
  { color: "#0159b2", icon: <File size={24} />, y: 312, title: "Document" },
  { color: "#013f7f", icon: <User size={24} />, y: 382, title: "Contact" },
];

const ChatInput = ({
  inputRef,
  message,
  setMessage,
  setOpenPicker,
  onSend,
  onTyping,
}) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      inputRef={inputRef}
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

const Footer = ({ conversation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const socket = getSocket();

  const { replyTo } = useSelector((state) => state.app);

  // 1. Create a ref for the input
  const inputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const typingTimeout = useRef(null);
  const userId = localStorage.getItem("user_id");

  // Add this Effect: Whenever replyTo changes (and is not null), focus the input
  React.useEffect(() => {
    if (replyTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTo]);

  /* ---------- Typing Indicator ---------- */
  const handleTyping = () => {
    if (!socket || !conversation?._id) return;

    socket.emit("typing_start", { conversation_id: conversation._id });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", { conversation_id: conversation._id });
    }, 1000);
  };

  /* ---------- Send Message ---------- */
  const handleSendMessage = () => {
    if (!message.trim() || !conversation?._id) return;

    const to = conversation.participants.find(
      (p) => String(p._id) !== String(userId),
    )?._id;
    if (!to) return;

    const clientId = crypto.randomUUID();

    // Helper to get display name of reply
    let replyToPayload = null;
    if (replyTo) {
      const participant = conversation.participants.find(
        (p) => String(p._id) === String(replyTo.from),
      );
      const displayName =
        replyTo.from === userId
          ? "You"
          : replyTo.fromName ||
            `${participant?.firstName || ""} ${participant?.lastName || ""}`.trim() ||
            "Them";

      replyToPayload = {
        _id: replyTo._id,
        text: replyTo.text,
        from: replyTo.from,
        fromName: displayName,
      };
    }

    const optimisticMessage = {
      _id: clientId,
      client_id: clientId,
      from: userId,
      to,
      text: message,
      subtype: replyTo ? "Reply" : "Text",
      createdAt: new Date().toISOString(),
      status: "sent",
      replyTo: replyToPayload,
    };

    // Optimistically add message
    dispatch(
      addMessageToActiveConversation({
        conversation_id: conversation._id,
        message: optimisticMessage,
      }),
    );

    // Emit to server
    socket?.emit("text_message", {
      from: userId,
      to,
      conversation_id: conversation._id,
      message,
      type: "Text",
      client_id: clientId,
      createdAt: optimisticMessage.createdAt,
      replyTo: replyToPayload,
    });

    // Stop typing
    socket?.emit("typing_stop", { conversation_id: conversation._id });

    dispatch(clearReplyTo());
    setMessage("");
  };

  const renderReplyHighlight = () => {
    if (!replyTo) return null;

    // 1️⃣ Find the participant in the conversation
    const participant = conversation?.participants?.find(
      (p) => String(p._id) === String(replyTo.from),
    );

    // 2️⃣ Determine display name
    const displayName =
      replyTo.from === userId
        ? "You"
        : replyTo.fromName ||
          (participant
            ? `${participant.firstName || ""} ${participant.lastName || ""}`.trim()
            : "Them");

    return (
      <Box
        mb={1}
        px={2}
        py={1}
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.action.hover,
          borderRadius: 1,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.3} sx={{ maxWidth: "90%" }}>
            {/* Label */}
            <Typography variant="caption" color="text.secondary">
              Replying to
            </Typography>

            {/* Sender Name */}
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              {replyTo.fromName}
            </Typography>

            {/* Quoted text */}
            <Typography
              variant="body2"
              sx={{ mt: 0.2 }}
              color="text.secondary"
              noWrap
            >
              {replyTo.text}
            </Typography>

            {/* Timestamp */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "right", mt: 0.2 }}
            >
              {replyTo.createdAt
                ? new Date(replyTo.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Typography>
          </Stack>

          <IconButton size="small" onClick={() => dispatch(clearReplyTo())}>
            <X size={14} />
          </IconButton>
        </Stack>
      </Box>
    );
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
      {renderReplyHighlight()}

      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack sx={{ width: "100%" }}>
          {openPicker && (
            <Box sx={{ position: "fixed", bottom: 90, right: 120, zIndex: 10 }}>
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(e) => setMessage((prev) => prev + e.native)}
              />
            </Box>
          )}

          <ChatInput
            inputRef={inputRef}
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
