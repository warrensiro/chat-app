import { getSocket } from "./socket";
import {
  showSnackbar,
  FetchFriendRequests,
  FetchFriends,
  FetchUsers,
  setActiveConversation,
  addConversation,
  addMessageToActiveConversation,
  incrementUnread,
  setTyping,
  clearTyping,
} from "./redux/Slices/app";
import { store } from "./redux/store";

export const initSocketListeners = (dispatch) => {
  const socket = getSocket();
  if (!socket) return;

  // const userId = localStorage.getItem("user_id");

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
      dispatch(addConversation(data.conversation));
      dispatch(setActiveConversation(data.conversation));
    }
  });

  socket.on("conversation_started", ({ conversation }) => {
    if (!conversation || !conversation._id) return;

    dispatch(addConversation(conversation));
    dispatch(setActiveConversation(conversation));
  });

  socket.on("new_message", ({ conversation_id, message, participants }) => {
    if (!conversation_id || !message) return;

    const userId = localStorage.getItem("user_id");

    const normalizedMessage = {
      ...message,
      isMine: String(message.from) === String(userId),
    };

    const state = store.getState();
    const { conversations, activeConversation } = state.app;

    const existingConversation = conversations.find(
      (c) => c._id === conversation_id,
    );

    // Conversation does NOT exist → create it immediately
    if (!existingConversation) {
      dispatch(
        addConversation({
          _id: conversation_id,
          participants,
          messages: [normalizedMessage],
          unread: normalizedMessage.isMine ? 0 : 1,
        }),
      );
      return;
    }

    // Conversation exists → add message
    dispatch(
      addMessageToActiveConversation({
        conversation_id,
        message: normalizedMessage,
      }),
    );

    // Increment unread if NOT active & message is not mine
    if (
      !normalizedMessage.isMine &&
      activeConversation?._id !== conversation_id
    ) {
      dispatch(incrementUnread(conversation_id));
    }
  });
  socket.on("typing_start", ({ conversation_id, from }) => {
    dispatch(setTyping({ conversation_id, userId: from }));
  });

  socket.on("typing_stop", ({ conversation_id }) => {
    dispatch(clearTyping(conversation_id));
  });
};
