import io from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  // always disconnect existing socket
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // create new socket
  socket = io("http://localhost:8000", {
    query: { user_id: userId },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id, "User:", userId);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
