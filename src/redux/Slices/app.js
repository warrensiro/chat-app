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
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    incrementUnread: (state, action) => {
      const conversation = state.conversations.find(
        (c) => c._id === action.payload,
      );
      if (conversation) {
        conversation.unread = (conversation.unread || 0) + 1;
      }
    },
    setConversations(state, action) {
      const userId = localStorage.getItem("user_id");

      const conversations = (action.payload || []).map((c) => ({
        ...c,
        messages: Array.isArray(c.messages)
          ? c.messages.map((m) => ({
              ...m,
              isMine: String(m.from) === String(userId),
            }))
          : [],
      }));

      state.conversations = conversations.map((c) => ({
        ...c,
        unread: c.unread ?? 0,
      }));

      // ✅ auto-select first conversation on login
      if (!state.activeConversation && conversations.length > 0) {
        state.activeConversation = conversations[0];
      }
    },
    addConversation(state, action) {
      const conv = action.payload;

      // Ensure participants exist
      if (!conv || !Array.isArray(conv.participants)) return;

      // if (!Array.isArray(state.conversations)) state.conversations = [];

      const exists = state.conversations.find((c) => c._id === conv._id);

      if (!exists) {
        state.conversations.unshift({ ...conv, unread: conv.unread ?? 0 });
      }
    },
    setActiveConversation(state, action) {
      const userId = localStorage.getItem("user_id");
      const conv = action.payload;

      if (!conv) {
        state.activeConversation = null;
        return;
      }

      state.activeConversation = {
        ...conv,
        messages: Array.isArray(conv.messages)
          ? conv.messages.map((m) => ({
              ...m,
              isMine: String(m.from) === String(userId),
            }))
          : [],
      };
      // Reset unread count in conversations list
      const target = state.conversations.find((c) => c._id === conv._id);
      if (target) {
        target.unread = 0;
      }
    },

    addMessageToActiveConversation(state, action) {
      const { conversation_id, message } = action.payload;
      if (!conversation_id || !message) return;

      const userId = localStorage.getItem("user_id");

      const normalizedMessage = {
        ...message,
        isMine: String(message.from) === String(userId),
      };

      const target =
        state.activeConversation?._id === conversation_id
          ? state.activeConversation
          : state.conversations.find((c) => c._id === conversation_id);

      if (!target) return;

      if (!Array.isArray(target.messages)) {
        target.messages = [];
      }

      const exists = target.messages.some(
        (m) =>
          (m.client_id && m.client_id === normalizedMessage.client_id) ||
          m._id === normalizedMessage._id,
      );

      if (!exists) {
        target.messages.push(normalizedMessage);
      }
      const index = state.conversations.findIndex(
        (c) => c._id === conversation_id,
      );
      if (index > 0) {
        const [conv] = state.conversations.splice(index, 1);
        state.conversations.unshift(conv);
      }
    },
    setTyping(state, action) {
      const { conversation_id, userId } = action.payload;
      state.typing[conversation_id] = userId;
    },

    clearTyping(state, action) {
      const conversation_id = action.payload;
      delete state.typing[conversation_id];
    },

    resetAppState: () => initialState,
  },
});

// Reducer
export default slice.reducer;

export const ToggleSidebar = () => (dispatch) => {
  dispatch(slice.actions.toggleSidebar());
};

export const UpdateSidebarType = (type) => (dispatch) => {
  dispatch(slice.actions.updateSidebarType({ type }));
};

export const closeSnackbar = () => (dispatch) => {
  dispatch(slice.actions.closeSnackbar());
};

export const showSnackbar =
  ({ severity, message }) =>
  (dispatch) => {
    dispatch(slice.actions.openSnackbar({ severity, message }));
    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };

export const FetchUsers = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const { data } = await axiosInstance.get("/user/get-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(slice.actions.updateUsers({ users: data.data }));
  } catch (err) {
    console.error("FetchUsers error:", err.message);
  }
};

export const FetchFriends = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const { data } = await axiosInstance.get("/user/get-friends", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(slice.actions.updateFriends({ friends: data.data }));
  } catch (err) {
    console.error("FetchFriends error:", err.message);
  }
};

export const FetchFriendRequests = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const { data } = await axiosInstance.get("/user/get-friend-requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(slice.actions.updateFriendRequests({ requests: data.data }));
  } catch (err) {
    console.error("FetchFriendRequests error:", err.message);
  }
};

export const FetchConversations = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const { data } = await axiosInstance.get(
      "/conversation/get-conversations",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    dispatch(slice.actions.setConversations(data.data));
  } catch (error) {
    console.error("FetchConversations error:", error.message);
  }
};

export const {
  setActiveConversation,
  addConversation,
  addMessageToActiveConversation,
  resetAppState,
  incrementUnread,
  setTyping,
  clearTyping,
  setConversations,
} = slice.actions;
