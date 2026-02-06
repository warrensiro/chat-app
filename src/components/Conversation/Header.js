import React from "react";
import { Box, Stack, Avatar, Typography, IconButton, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";
import { toggleSidebar } from "../../redux/Slices/app";
import { useDispatch } from "react-redux";

const Header = ({ conversation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  if (!conversation) return null;

  const userId = localStorage.getItem("user_id");
  const otherUser = conversation.participants.find((p) => p._id !== userId);

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor: theme.palette.mode === "light" ? "#F5F5F5" : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", height: "100%" }}>
        <Stack direction={"row"} spacing={2} onClick={() => dispatch(toggleSidebar())}>
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={`${otherUser.firstName}`} src={otherUser.img} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle">
              {otherUser.firstName} {otherUser.lastName}
            </Typography>
            <Typography variant="caption">{otherUser.status || "Offline"}</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
