import Router from "./routes";
import ThemeProvider from "./theme";
import ThemeSettings from "./components/settings";
import { Snackbar } from "@mui/material";
import React, { useEffect, useRef } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar, setConversations, setActiveConversation } from "./redux/Slices/app";
import { connectSocket, getSocket } from "./socket";
import { initSocketListeners } from "./socketListeners";

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

  useEffect(() => {
    if (!isLoggedIn || !user_id || socketInitialized.current) return;

    const socketInstance = connectSocket(user_id);

    initSocketListeners(dispatch);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);

      // Fetch conversations only after socket is connected
      socketInstance.emit("get_direct_conversations", null, (conversations) => {
        const normalized = conversations.map((c) => ({
          ...c,
          messages: c.messages || [],
          unread: 0,
        }));
        console.log("Loaded conversations:", conversations);
        dispatch(setConversations(normalized));

        // AUTO-FETCH MESSAGES FOR FIRST CONVERSATION
        if (normalized.length > 0) {
          socketInstance.emit(
            "get_messages",
            { conversation_id: normalized[0]._id },
            (messages) => {
              dispatch(
                setActiveConversation({
                  ...normalized[0],
                  messages,
                }),
              );
            },
          );
        }
      });
    });

    

    socketInitialized.current = true;

    return () => {
      // cleanup all socket listeners on unmount
      const socket = getSocket();
      if (!socket) return;
      socket.removeAllListeners();
    };
  }, [isLoggedIn, user_id, dispatch]);

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
