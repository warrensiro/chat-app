import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },
  snackbar: {
    open: false,
    message: "",
    severity: null,
  },
  users: [],
  friends: [],
  friendRequests: [],
  conversations: [],
  activeConversation: null,
  typing: {},
  replyTo: null,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /* ───────── UI ───────── */
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open;
    },

    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },

    openSnackbar(state, action) {
      state.snackbar = {
        open: true,
        severity: action.payload.severity,
        message: action.payload.message,
      };
    },

    closeSnackbar(state) {
      state.snackbar = {
        open: false,
        message: "",
        severity: null,
      };
    },

    /* ───────── USERS ───────── */
    updateUsers(state, action) {
      state.users = action.payload.users;
    },

    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },

    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },

    /* ───────── CONVERSATIONS ───────── */
    setConversations(state, action) {
      const { conversations, userId } = action.payload;

      state.conversations = (conversations || []).map((c) => ({
        ...c,
        messages: (c.messages || []).map((m) => ({
          ...m,
          isMine: String(m.from) === String(userId),
        })),
        unread: c.unread ?? 0,
      }));

      if (!state.activeConversation && state.conversations.length > 0) {
        state.activeConversation = state.conversations[0];
      }
    },

    addConversation(state, action) {
      const { conversation, userId } = action.payload;
      if (!conversation?._id) return;

      const exists = state.conversations.find(
        (c) => c._id === conversation._id,
      );
      if (exists) return;

      state.conversations.unshift({
        ...conversation,
        messages: (conversation.messages || []).map((m) => ({
          ...m,
          isMine: String(m.from) === String(userId),
        })),
        unread: conversation.unread ?? 0,
      });
    },

    setActiveConversation(state, action) {
      const { conversationId, userId } = action.payload;
      const convo = state.conversations.find((c) => c._id === conversationId);
      if (!convo) return;

      convo.messages = convo.messages.map((m) => ({
        ...m,
        isMine: String(m.from) === String(userId),
      }));

      convo.unread = 0;
      state.activeConversation = convo;
    },

    /* ───────── MESSAGES ───────── */
    addMessageToActiveConversation(state, action) {
      const { conversation_id, message, userId } = action.payload;
      if (!conversation_id || !message) return;

      const normalizedMessage = {
        ...message,
        isMine: String(message.from) === String(userId),
        replyTo: message.replyTo ? { ...message.replyTo } : null,
      };

      const updateMessages = (messages = []) => {
        const index = messages.findIndex(
          (m) =>
            (normalizedMessage.client_id &&
              m.client_id === normalizedMessage.client_id) ||
            m._id === normalizedMessage._id,
        );

        if (index === -1) {
          messages.push(normalizedMessage);
        } else {
          messages[index] = {
            ...messages[index],
            ...normalizedMessage,
          };
        }

        return messages;
      };

      // update conversation list
      const convo = state.conversations.find((c) => c._id === conversation_id);
      if (convo) {
        convo.messages = updateMessages(convo.messages);
      }

      // update active conversation
      if (state.activeConversation?._id === conversation_id) {
        state.activeConversation.messages = updateMessages(
          state.activeConversation.messages,
        );
      }

      // move conversation to top
      const index = state.conversations.findIndex(
        (c) => c._id === conversation_id,
      );
      if (index > 0) {
        const [c] = state.conversations.splice(index, 1);
        state.conversations.unshift(c);
      }
    },

    updateMessageStatus(state, action) {
      const { conversation_id, status, messageId, onlyMine } = action.payload;
      const convo = state.conversations.find((c) => c._id === conversation_id);
      if (!convo) return;

      const applyStatus = (messages = []) =>
        messages.map((m) => {
          // If updating a specific message
          if (messageId) {
            if (m._id !== messageId && m.client_id !== messageId) return m;
          }

          // If only updating my messages (read receipts)
          if (onlyMine && !m.isMine) return m;

          return { ...m, status };
        });

      convo.messages = applyStatus(convo.messages);

      if (state.activeConversation?._id === conversation_id) {
        state.activeConversation.messages = applyStatus(
          state.activeConversation.messages,
        );
      }
    },

    updateMessageReactions(state, action) {
      const { conversation_id, message_id, reactions } = action.payload;
      const update = (messages) => {
        const msg = messages.find(
          (m) => m._id === message_id || m.client_id === message_id,
        );
        if (msg) msg.reactions = reactions;
      };

      if (state.activeConversation?._id === conversation_id) {
        update(state.activeConversation.messages);
      }
    },

    setReplyTo(state, action) {
      const message = action.payload;
      const userId = localStorage.getItem("user_id");

      state.replyTo = {
        ...message,
        fromName: message.fromName
          ? message.fromName
          : message.from === userId
            ? "You"
            : "Them",
      };
    },

    clearReplyTo(state) {
      state.replyTo = null;
    },

    /* ───────── UNREAD ───────── */
    incrementUnread(state, action) {
      const convo = state.conversations.find((c) => c._id === action.payload);
      if (convo) {
        convo.unread = (convo.unread || 0) + 1;
      }
    },

    /* ───────── TYPING ───────── */
    setTyping(state, action) {
      const { conversation_id, userId } = action.payload;
      state.typing[conversation_id] = userId;
    },

    clearTyping(state, action) {
      delete state.typing[action.payload];
    },

    /* ───────── RESET ───────── */
    resetAppState() {
      return initialState;
    },
  },
});

/* ───────── THUNKS ───────── */
export const showSnackbar =
  ({ severity, message }) =>
  (dispatch) => {
    dispatch(slice.actions.openSnackbar({ severity, message }));
    setTimeout(() => dispatch(slice.actions.closeSnackbar()), 4000);
  };

export const FetchUsers = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const { data } = await axiosInstance.get("/user/get-users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch(slice.actions.updateUsers({ users: data.data }));
};

export const FetchFriends = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const { data } = await axiosInstance.get("/user/get-friends", {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch(slice.actions.updateFriends({ friends: data.data }));
};

export const FetchFriendRequests = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const { data } = await axiosInstance.get("/user/get-friend-requests", {
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch(slice.actions.updateFriendRequests({ requests: data.data }));
};

export const FetchConversations = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const userId = getState().auth.userId;

  const { data } = await axiosInstance.get("/conversation/get-conversations", {
    headers: { Authorization: `Bearer ${token}` },
  });

  dispatch(
    slice.actions.setConversations({
      conversations: data.data,
      userId,
    }),
  );
};

export default slice.reducer;

export const {
  toggleSidebar,
  updateSidebarType,
  closeSnackbar,
  setConversations,
  addConversation,
  setActiveConversation,
  addMessageToActiveConversation,
  incrementUnread,
  setTyping,
  clearTyping,
  updateMessageStatus,
  updateMessageReactions,
  resetAppState,
  setReplyTo,
  clearReplyTo,
} = slice.actions;
