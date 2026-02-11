import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Divider,
  InputBase,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CaretDown,
  MagnifyingGlass,
  Phone,
  VideoCamera,
  X,
} from "phosphor-react";
import StyledBadge from "../StyledBadge";
import { toggleSidebar } from "../../redux/Slices/app";
import { useDispatch } from "react-redux";

const Header = ({ conversation, onSearch }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  if (!conversation) return null;

  const userId = localStorage.getItem("user_id");
  const otherUser = conversation.participants.find((p) => p._id !== userId);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleToggleSideBar = () => {
    dispatch(toggleSidebar());
  }

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F5F5F5"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          onClick={() => dispatch(toggleSidebar())}
          sx={{ cursor: "pointer" }}
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              online={otherUser?.status === "Online"}
            >
              <Avatar alt={`${otherUser.firstName}`} src={otherUser.img} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle">
              {otherUser.firstName} {otherUser.lastName}
            </Typography>
            <Typography variant="caption">
              {otherUser.status || "Offline"}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          {searchOpen ? (
            <>
              <InputBase
                autoFocus
                placeholder="Search messages…"
                value={searchText}
                onChange={handleSearchChange}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "#E0E0E0" : "#333",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  width: 200,
                }}
              />
              <IconButton
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                  onSearch("");
                }}
              >
                <X />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <IconButton>
                <Phone />
              </IconButton>
              <IconButton onClick={() => setSearchOpen(true)}>
                <MagnifyingGlass />
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton onClick={handleToggleSideBar}>
                <CaretDown />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
