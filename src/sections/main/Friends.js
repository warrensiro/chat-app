import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
} from "../../redux/Slices/app";
import {
  FriendComponent,
  FriendRequestComponent,
  UserComponent,
} from "../../components/Friends";

const UsersList = ({ onConversationStart }) => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchUsers());
  }, [dispatch]);

  return (
    <>
      {users.map((user) => (
        <UserComponent
          key={user._id}
          {...user}
          onConversationStart={onConversationStart} // pass callback
        />
      ))}
    </>
  );
};

const FriendsList = ({ onConversationStart }) => {
  const dispatch = useDispatch();
  const { friends = [] } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriends());
  }, [dispatch]);

  return (
    <>
      {friends.map((friend) => (
        <FriendComponent
          key={friend._id}
          {...friend}
          onConversationStart={onConversationStart} // pass callback
        />
      ))}
    </>
  );
};

const FriendRequestList = () => {
  const dispatch = useDispatch();
  const { friendRequests = [] } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, [dispatch]);

  return (
    <>
      {friendRequests.map((request) => (
        <FriendRequestComponent
          key={request._id}
          {...request.sender}
          id={request._id}
        />
      ))}
    </>
  );
};

const Friends = ({ open, handleClose, onConversationStart }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();

  // Fetch all relevant data when dialog opens
  useEffect(() => {
    if (!open) return;

    dispatch(FetchUsers());
    dispatch(FetchFriends());
    dispatch(FetchFriendRequests());
  }, [open, dispatch]);

  const handleChange = (event, newValue) => setTabIndex(newValue);

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <UsersList onConversationStart={onConversationStart} />;
      case 1:
        return <FriendsList onConversationStart={onConversationStart} />;
      case 2:
        return <FriendRequestList />;
      default:
        return null;
    }
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
      <Stack p={2}>
        <Tabs value={tabIndex} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>

      <DialogContent>
        <Stack spacing={2.5}>{renderTabContent()}</Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
