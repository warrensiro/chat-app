import io from "socket.io-client";

let socket = null;

export const connectSocket = (user_id) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      query: { user_id },
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;
