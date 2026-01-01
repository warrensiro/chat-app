import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Archive, CircleDashed, MagnifyingGlass, Users } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";

const Chats = () => {
  const [ openDialog, setOpenDialog ] = useState(false);
  const theme = useTheme();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
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
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton
              onClick={() => {
                handleOpenDialog();
              }}
            >
              <Users />
            </IconButton>
            <IconButton>
              <CircleDashed />
            </IconButton>
          </Stack>
        </Stack>
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
        <Stack spacing={1}>
          <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
            <Archive size={24} />
            <Button>Archive</Button>
          </Stack>
          <Divider />
        </Stack>
        <Stack
          direction={"column"}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
          spacing={2}
        >
          <SimpleBarStyle
            autoHide={true}
            timeout={800}
            clickOnTrack={false}
            style={{ maxHeight: "100%" }}
          >
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#565645" }}>
                Pinned
              </Typography>
              {ChatList.filter((chat) => chat.pinned).map((chat) => {
                return <ChatElement key={chat.id} {...chat} />;
              })}
            </Stack>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#565645" }}>
                All Chats
              </Typography>
              {ChatList.filter((chat) => !chat.pinned).map((chat) => {
                return <ChatElement key={chat.id} {...chat} />;
              })}
            </Stack>
          </SimpleBarStyle>
        </Stack>
      </Stack>
    </Box>
    { openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default Chats;
