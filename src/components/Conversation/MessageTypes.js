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
import React from "react";
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
const TextMsg = ({ el, menu }) => {
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
      {menu && <MessageOptions message={el} />}
    </Stack>
  );
};

/* Media Message */
const MediaMsg = ({ el, menu }) => {
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
      {menu && <MessageOptions message={el} />}
    </Stack>
  );
};

/* Document Message */
const DocMsg = ({ el, menu }) => {
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
      {menu && <MessageOptions message={el} />}
    </Stack>
  );
};

const ReplyMsg = ({ el, menu, conversation }) => {
  const theme = useTheme();
  const userId = localStorage.getItem("user_id");
  const incoming = String(el.from) !== String(userId);

  const participant = conversation?.participants?.find(
    (p) => String(p._id) === String(el.replyTo.from),
  );
  const repliedLabel =
    el.replyTo.from === userId
      ? "You"
      : el.replyTo.fromName || participant?.name || "Them";

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
          {/* 🔹 Quoted message */}
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
                {repliedLabel}
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

          {/* 🔹 Actual message */}
          <Typography
            variant="body2"
            color={incoming ? "text.primary" : "#fff"}
          >
            {el.text}
          </Typography>

          {/* 🔹 Timestamp and ticks */}
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {new Date(el.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            {el.isMine && <StatusIcon status={el.status} theme={theme} />}
          </Stack>
        </Stack>
      </Box>

      {menu && <MessageOptions message={el} />}
    </Stack>
  );
};

/* -------------------- */
/* Link Message */
const LinkMsg = ({ el, menu }) => {
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
      {menu && <MessageOptions message={el} />}
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

const MessageOptions = ({ message }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleAction = (title) => {
    setAnchorEl(null);

    if (title === "Reply") {
      dispatch(
        setReplyTo({
          ...message,
          fromName:
            message.from === localStorage.getItem("user_id")
              ? "You"
              : message.fromName || message.from,
        }),
      );
    }
    setAnchorEl(null);

    // future actions go here
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <DotsThreeVertical size={18} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {Message_options.map((el) => (
          <MenuItem key={el.title} onClick={() => handleAction(el.title)}>
            {el.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
