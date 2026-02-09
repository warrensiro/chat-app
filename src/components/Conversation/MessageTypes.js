import { useTheme } from "@mui/material/styles";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import {
  DotsThreeVertical,
  DownloadSimple,
  Image,
  Check,
  Checks,
} from "phosphor-react";
import { Message_options } from "../../data";
import { useDispatch } from "react-redux";
import { setReplyTo } from "../../redux/Slices/app";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getSocket } from "../../socket";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const getAlignment = (incoming) => (incoming ? "flex-start" : "flex-end");
const getBgColor = (incoming, theme) =>
  incoming ? theme.palette.background.default : theme.palette.primary.main;
const getTextColor = (incoming, theme) =>
  incoming ? theme.palette.text.primary : "#fff";

// Simple time formatter
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const StatusIcon = ({ status, theme }) => {
  if (status === "sent") return <Check size={14} opacity={0.7} />;
  if (status === "delivered") return <Checks size={14} opacity={0.7} />;
  if (status === "read")
    return (
      <Checks size={14} weight="fill" color={theme.palette.primary.main} />
    );
  return null;
};

/* Text Message */
const TextMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const incoming = !el.isMine;

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)} mb={1}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: getBgColor(incoming, theme),
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Typography variant="body2" color={getTextColor(incoming, theme)}>
          {el.text}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="caption" color="text.secondary">
            {formatTime(el.createdAt)}
          </Typography>
          {el.isMine && <StatusIcon status={el.status} theme={theme} />}
        </Stack>
      </Box>
      {menu && <MessageOptions message={el} conversation={conversation} />}
    </Stack>
  );
};

/* Media Message */
const MediaMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const incoming = !el.isMine;

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)} mb={1}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: getBgColor(incoming, theme),
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Stack spacing={1}>
          {el.img && (
            <img
              src={el.img}
              alt={el.text}
              style={{ maxHeight: 210, borderRadius: 10 }}
            />
          )}
          <Typography variant="body2" color={getTextColor(incoming, theme)}>
            {el.text}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "right" }}
          >
            {formatTime(el.createdAt)}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions message={el} conversation={conversation} />}
    </Stack>
  );
};

/* Document Message */
const DocMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const incoming = !el.isMine;

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)} mb={1}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: getBgColor(incoming, theme),
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={40} />
            <Typography variant="caption">Document</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography variant="body2" color={getTextColor(incoming, theme)}>
            {el.text}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "right" }}
          >
            {formatTime(el.createdAt)}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions message={el} conversation={conversation} />}
    </Stack>
  );
};

const ReplyMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const incoming = !el.isMine;

  return (
    <Stack
      direction="row"
      justifyContent={incoming ? "flex-start" : "flex-end"}
      mb={1}
    >
      <Box
        p={1.5}
        sx={{
          backgroundColor: incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Stack spacing={0.8}>
          {/* Quoted message */}
          {el.replyTo && (
            <Box
              px={1}
              py={0.8}
              sx={{
                borderLeft: `3px solid ${
                  incoming ? theme.palette.primary.main : "#fff"
                }`,
                backgroundColor: incoming
                  ? theme.palette.action.hover
                  : "rgba(255,255,255,0.15)",
                borderRadius: 0.5,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color={incoming ? "text.secondary" : "#fff"}
              >
                {el.replyTo.fromName}
              </Typography>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.2 }}
                color={incoming ? "text.secondary" : "#fff"}
                noWrap
              >
                {el.replyTo.text}
              </Typography>
            </Box>
          )}

          {/* Message */}
          <Typography
            variant="body2"
            color={incoming ? "text.primary" : "#fff"}
          >
            {el.text}
          </Typography>

          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Typography variant="caption" color="text.secondary">
              {formatTime(el.createdAt)}
            </Typography>
            {el.isMine && <StatusIcon status={el.status} theme={theme} />}
          </Stack>
        </Stack>
      </Box>

      {menu && <MessageOptions message={el} conversation={conversation} />}
    </Stack>
  );
};

const LinkMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const incoming = !el.isMine;

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)} mb={1}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: getBgColor(incoming, theme),
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Stack spacing={1}>
          {el.preview && (
            <img
              src={el.preview}
              alt={el.text}
              style={{ maxHeight: 200, borderRadius: 10 }}
            />
          )}
          {el.url && (
            <Typography
              component={Link}
              href={el.url}
              target="_blank"
              rel="noopener"
              sx={{ color: theme.palette.primary.main }}
            >
              {el.url}
            </Typography>
          )}
          <Typography variant="body2" color={getTextColor(incoming, theme)}>
            {el.text}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "right" }}
          >
            {formatTime(el.createdAt)}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions message={el} conversation={conversation} />}
    </Stack>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      my={3}
      sx={{ width: "100%" }}
    >
      <Divider
        flexItem
        sx={{
          borderColor: theme.palette.divider,
          opacity: 0.35,
        }}
      />

      <Typography
        variant="caption"
        sx={{
          px: 1.5,
          py: 0.25,
          borderRadius: 1,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f5f5f5"
              : theme.palette.background.paper,
          color: theme.palette.text.secondary,
          whiteSpace: "nowrap",
          fontWeight: 500,
        }}
      >
        {el.text}
      </Typography>

      <Divider
        flexItem
        sx={{
          borderColor: theme.palette.divider,
          opacity: 0.35,
        }}
      />
    </Stack>
  );
};

const MessageOptions = ({ message, conversation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const socket = getSocket();
  const userId = localStorage.getItem("user_id");
  const PICKER_HEIGHT = 420;
  const PICKER_WIDTH = 360;
  const VIEWPORT_PADDING = 8;

  const [anchorEl, setAnchorEl] = useState(null);
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerPlacement, setPickerPlacement] = useState("bottom");

  const openMenu = Boolean(anchorEl);

  const resolveSenderName = () => {
    if (String(message.from) === String(userId)) return "You";

    const sender = conversation?.participants?.find(
      (p) => String(p._id) === String(message.from),
    );
    return sender
      ? `${sender.firstName} ${sender.lastName || ""}`.trim()
      : "Them";
  };
  const dotsRef = useRef(null);

  const calculatePlacement = () => {
    if (!dotsRef.current) return "bottom";

    const rect = dotsRef.current.getBoundingClientRect();

    const bottomTop = rect.bottom + 8;
    const topTop = rect.top - PICKER_HEIGHT - 8;

    const bottomOverflow =
      bottomTop + PICKER_HEIGHT - window.innerHeight + VIEWPORT_PADDING;

    const topOverflow = VIEWPORT_PADDING - topTop;

    return bottomOverflow > topOverflow ? "top" : "bottom";
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenPicker(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => setOpenPicker(false);
  }, []);

  const handleAction = (action) => {
    setAnchorEl(null);

    if (action === "reply") {
      dispatch(
        setReplyTo({
          _id: message._id,
          text: message.text,
          from: message.from,
          fromName: resolveSenderName(),
        }),
      );
    }

    if (action === "react") {
      const placement = calculatePlacement();
      setPickerPlacement(placement);
      setOpenPicker(true);
    }
  };

  return (
    <>
      {/* ⋮ menu button */}
      <IconButton
        size="small"
        ref={dotsRef}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <DotsThreeVertical size={18} />
      </IconButton>

      {/* Dots Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        {Message_options.map((el) => (
          <MenuItem key={el.action} onClick={() => handleAction(el.action)}>
            {el.title}
          </MenuItem>
        ))}
      </Menu>

      {/* Floating Emoji Picker */}
      {openPicker &&
        dotsRef.current &&
        (() => {
          const rect = dotsRef.current.getBoundingClientRect();

          let top =
            pickerPlacement === "bottom"
              ? rect.bottom + 8
              : rect.top - PICKER_HEIGHT - 8;

          // 🔒 Clamp vertically inside viewport
          top = Math.max(
            VIEWPORT_PADDING,
            Math.min(
              top,
              window.innerHeight - PICKER_HEIGHT - VIEWPORT_PADDING,
            ),
          );

          let left = rect.left;

          // 🔒 Clamp horizontally
          left = Math.max(
            VIEWPORT_PADDING,
            Math.min(left, window.innerWidth - PICKER_WIDTH - VIEWPORT_PADDING),
          );

          return (
            <ClickAwayListener onClickAway={() => setOpenPicker(false)}>
              <Box
                sx={{
                  position: "fixed", // 👈 important
                  top,
                  left,
                  zIndex: 2000,
                  willChange: "transform",
                }}
              >
                <Picker
                  data={data}
                  theme={theme.palette.mode}
                  onEmojiSelect={(e) => {
                    console.log("EMOJI SELECTED:", e.native);
                    setOpenPicker(false);
                  }}
                />
              </Box>
            </ClickAwayListener>
          );
        })()}
    </>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
