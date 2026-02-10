import { getSocket } from "./socket";
import {
  showSnackbar,
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
  addConversation,
  setActiveConversation,
  addMessageToActiveConversation,
  incrementUnread,
  setTyping,
  clearTyping,
  updateMessageStatus,
  updateMessageReactions,
  deleteMessageFromConversation,
} from "./redux/Slices/app";
import { store } from "./redux/store";

export const initSocketListeners = (dispatch, userId) => {
  const socket = getSocket();
  if (!socket) return;

  // prevent duplicate listeners
  socket.removeAllListeners();

  socket.on("request_sent", (data) => {
    dispatch(
      showSnackbar({
        severity: "success",
        message: data.message,
      }),
    );
    dispatch(FetchUsers());
  });

  socket.on("new_friend_request", () => {
    dispatch(
      showSnackbar({
        severity: "info",
        message: "New friend request received",
      }),
    );
    dispatch(FetchFriendRequests());
    dispatch(FetchUsers());
  });

  socket.on("request_accepted", (data) => {
    dispatch(
      showSnackbar({
        severity: "success",
        message: data.message,
      }),
    );

    dispatch(FetchFriends());
    dispatch(FetchFriendRequests());
    dispatch(FetchUsers());

    if (data.conversation) {
      dispatch(addConversation({ conversation: data.conversation, userId }));
      dispatch(
        setActiveConversation({
          conversationId: data.conversation._id,
          userId,
        }),
      );
    }
  });

  socket.on("conversation_started", ({ conversation }) => {
    if (!conversation?._id) return;

    dispatch(addConversation({ conversation, userId }));
    dispatch(
      setActiveConversation({
        conversationId: conversation._id,
        userId,
      }),
    );
  });

  socket.on("new_message", ({ conversation_id, message, participants }) => {
    if (!conversation_id || !message) return;

    const isMine = String(message.from) === String(userId);

    const state = store.getState();
    const { conversations, activeConversation } = state.app;

    const existingConversation = conversations.find(
      (c) => c._id === conversation_id,
    );

    // conversation does not exist yet
    if (!existingConversation) {
      dispatch(
        addConversation({
          conversation: {
            _id: conversation_id,
            participants,
            messages: [
              {
                ...message,
                isMine,
              },
            ],
            unread: isMine ? 0 : 1,
          },
          userId,
        }),
      );
      return;
    }

    // add / update message
    dispatch(
      addMessageToActiveConversation({
        conversation_id,
        message,
        userId,
      }),
    );

    // increment unread if needed
    if (!isMine && activeConversation?._id !== conversation_id) {
      dispatch(incrementUnread(conversation_id));
    }

    // mark delivered for incoming messages
    if (!isMine) {
      socket.emit("message_delivered", {
        conversation_id,
        message_id: message._id,
      });
    }
  });

  socket.on("message_delivered", ({ conversation_id, message_id }) => {
    if (!conversation_id || !message_id) return;

    dispatch(
      updateMessageStatus({
        conversation_id,
        messageId: message_id,
        status: "delivered",
      }),
    );
  });

  socket.on("messages_read", ({ conversation_id }) => {
    if (!conversation_id) return;

    dispatch(
      updateMessageStatus({
        conversation_id,
        status: "read",
        onlyMine: true,
      }),
    );
  });

  socket.on("new_reaction", ({ conversation_id, message_id, reactions }) => {
    if (!conversation_id || !message_id) return;

    dispatch(
      updateMessageReactions({
        conversation_id,
        message_id,
        reactions,
      }),
    );
  });

  socket.on("message_deleted", ({ conversation_id, message_id }) => {
    if (!conversation_id || !message_id) return;

    dispatch(deleteMessageFromConversation({ conversation_id, message_id }));
  });

  socket.on("typing_start", ({ conversation_id, from }) => {
    dispatch(setTyping({ conversation_id, userId: from }));
  });

  socket.on("typing_stop", ({ conversation_id }) => {
    dispatch(clearTyping(conversation_id));
  });
};
