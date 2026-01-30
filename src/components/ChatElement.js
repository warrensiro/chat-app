import {
  Avatar,
  Badge,
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StyledBadge from "./StyledBadge";
import { PushPinSimple, PushPin } from "phosphor-react"; // Phosphor icons

const ChatElement = ({
  id,
  name,
  img,
  msg,
  time,
  unread = 0,
  online = false,
  selected = false,
  pinned = false, // new prop for pinned state
  onClick,
  togglePin, // callback to pin/unpin
}) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        width: "100%",
        borderRadius: 1,
        backgroundColor: selected
          ? theme.palette.action.selected
          : theme.palette.mode === "light"
            ? "#F5F5F5"
            : theme.palette.background.paper,
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "light" ? "#eaf0ff" : "#3a3a3a",
        },
      }}
      p={2}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Left: Avatar + name + last message */}
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={img || ""} alt={name} />
            </StyledBadge>
          ) : (
            <Avatar src={img || ""} alt={name} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {msg || "No messages yet"}
            </Typography>
          </Stack>
        </Stack>

        {/* Right: time + unread + pin */}
        <Stack spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {time || ""}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {unread > 0 && <Badge color="primary" badgeContent={unread} />}

            {/* Pin/unpin button */}
            {togglePin && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering onClick of chat
                  togglePin();
                }}
              >
                {pinned ? (
                  <PushPin
                    weight="fill"
                    size={18}
                    color={theme.palette.primary.main}
                  />
                ) : (
                  <PushPinSimple size={18} />
                )}
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
