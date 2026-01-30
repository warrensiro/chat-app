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
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";

/* -------------------- */
/* Shared helpers */
/* -------------------- */

const getAlignment = (incoming) => (incoming ? "flex-start" : "flex-end");
const getBgColor = (incoming, theme) =>
  incoming ? theme.palette.background.default : theme.palette.primary.main;
const getTextColor = (incoming, theme) =>
  incoming ? theme.palette.text.primary : "#fff";

/* -------------------- */
/* Text Message */
/* -------------------- */
const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = Boolean(el.incoming);

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)}>
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
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

/* -------------------- */
/* Media Message */
const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = Boolean(el.incoming);

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)}>
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
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

/* -------------------- */
/* Document Message */
const DocMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = Boolean(el.incoming);

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)}>
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
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

/* -------------------- */
/* Reply Message */
const ReplyMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = Boolean(el.incoming);

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: getBgColor(incoming, theme),
          borderRadius: 1.5,
          maxWidth: "70%",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Reply
          </Typography>
          <Typography variant="body2" color={getTextColor(incoming, theme)}>
            {el.text}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

/* -------------------- */
/* Link Message */
const LinkMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = Boolean(el.incoming);

  return (
    <Stack direction="row" justifyContent={getAlignment(incoming)}>
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
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

/* -------------------- */
/* Timeline */
const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={2} my={2}>
      <Divider flexItem />
      <Typography variant="caption" color={theme.palette.text.secondary}>
        {el.text}
      </Typography>
      <Divider flexItem />
    </Stack>
  );
};

/* -------------------- */
/* Message Options */
const MessageOptions = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <DotsThreeVertical size={18} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {Message_options.map((el) => (
          <MenuItem key={el.title} onClick={() => setAnchorEl(null)}>
            {el.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
