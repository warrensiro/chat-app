import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/Slices/app";

const UsersList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchUsers());
  }, [dispatch]);

  const { users = [] } = useSelector((state) => state.app);

  return (
    <>
      {Array.isArray(users) &&
        users.map(
          (el, idx) => <div key={idx} /> // render user component
        )}
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriends());
  }, [dispatch]);

  const { friends = [] } = useSelector((state) => state.app);

  return (
    <>
      {Array.isArray(friends) &&
        friends.map(
          (el, idx) => <div key={idx} /> // render friends component
        )}
    </>
  );
};

const FriendRequestList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, [dispatch]);

  const { friendRequests = [] } = useSelector((state) => state.app);

  return (
    <>
      {Array.isArray(friendRequests) &&
        friendRequests.map(
          (el, idx) => <div key={idx} /> // render friendRequests component
        )}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      keepMounted
      onClose={handleClose}
      sx={{ p: 4 }}
    >
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      {/* dialog content */}
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.5}>
            {(() => {
              switch (value) {
                case 0:
                  // display all users
                  return <UsersList />;

                case 1:
                  // display all friends
                  return <FriendsList />;

                case 2:
                  // display all friend requests
                  return <FriendRequestList />;

                default:
                  return null;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
