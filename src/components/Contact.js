import {
  Box,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from "phosphor-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, updateSidebarType } from "../redux/Slices/app";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Block this contact?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this contact
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Block</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this contact?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this contact
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const activeConversation = useSelector(
    (state) => state.app.activeConversation,
  );
  const userId = useSelector((state) => state.auth.userId);

  if (!activeConversation) return null;

  // Get the other user in the conversation
  const user = activeConversation.participants.find(
    (p) => String(p._id) !== String(userId),
  );

  if (!user) return null;

  const handleCloseBlock = () => setOpenBlock(false);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* header */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F5F5F5"
                : theme.palette.background.default,
          }}
        >
          <Stack
            direction="row"
            sx={{ height: "100%", p: 2 }}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(toggleSidebar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/* body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems={"center"} direction="row" spacing={2}>
            <Avatar
              src={user.img}
              alt={`${user.firstName}`}
              sx={{ height: 64, width: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="vertical" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="vertical" fontWeight={500}>
                {user.phone || "N/A"}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-evenly"
          >
            <Stack spacing={1} alignItems={"center"}>
              <IconButton>
                <Phone />
              </IconButton>
              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack spacing={1} alignItems={"center"}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={0.5}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2">
              {user.about || "Hey there I am using Siro..."}
            </Typography>
          </Stack>
          <Divider />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Typography>Media, Links & Documents</Typography>
            <Button
              onClick={() => {
                dispatch(updateSidebarType("SHARED"));
              }}
              endIcon={<CaretRight />}
            >
              400
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems={"center"}>
            {[1, 2, 3].map((el) => {
              return (
                <Box key={el}>
                  <img src={faker.image.food()} alt={faker.name.fullName()} />
                </Box>
              );
            })}
          </Stack>
          <Divider />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems={"center"} spacing={2}>
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>
            <IconButton
              onClick={() => {
                dispatch(updateSidebarType("STARRED"));
              }}
            >
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems={"center"} spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />
          <Typography>1 group in common</Typography>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Avatar src={faker.internet.avatar()} alt={faker.name.fullName()} />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Investment Group</Typography>
              <Typography variant="caption">
                Owl, Hen, Rabbit, You...
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              startIcon={<Prohibit />}
              fullWidth
              variant="outlined"
            >
              Block
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);
              }}
              startIcon={<Trash />}
              fullWidth
              variant="outlined"
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />
      )}
    </Box>
  );
};

export default Contact;
