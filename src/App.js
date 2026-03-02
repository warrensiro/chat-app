import Router from "./routes";
import ThemeProvider from "./theme";
import ThemeSettings from "./components/settings";
import { Snackbar } from "@mui/material";
import React, { useEffect, useRef } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSnackbar,
  setConversations,
  setActiveConversation,
} from "./redux/Slices/app";
import { connectSocket, getSocket } from "./socket";
import { initSocketListeners } from "./socketListeners";
import { useNavigate } from "react-router-dom";

const vertical = "bottom";
const horizontal = "center";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state) => state.app.snackbar,
  );
  const user_id = window.localStorage.getItem("user_id");
  const socketInitialized = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !user_id) return;

    const socketInstance = connectSocket(user_id);

    if (!socketInstance) return;

    // attach listeners once
    initSocketListeners(dispatch, user_id, navigate);

    const handleConnect = () => {
      console.log("Socket connected:", socketInstance.id);

      socketInstance.emit("get_direct_conversations", null, (conversations) => {
        const normalized = conversations.map((c) => ({
          ...c,
          messages: c.messages || [],
          unread: 0,
        }));

        dispatch(
          setConversations({ conversations: normalized, userId: user_id }),
        );

        if (normalized.length > 0) {
          dispatch(
            setActiveConversation({
              conversationId: normalized[0]._id,
              userId: user_id,
            }),
          );
        }
      });
    };

    socketInstance.on("connect", handleConnect);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.disconnect();
    };
  }, [isLoggedIn, user_id]);

  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          <Router />
        </ThemeSettings>
      </ThemeProvider>

      {message && open && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => dispatch(closeSnackbar())}
        >
          <Alert severity={severity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default App;
