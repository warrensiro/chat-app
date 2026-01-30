import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";

const Conversation = () => {
  const { activeConversation, typing } = useSelector((state) => state.app);

  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("user_id");

  /* ---------------- Auto-scroll ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    activeConversation?._id,
    activeConversation?.messages?.length,
    typing?.[activeConversation?._id],
  ]);

  /* ---------------- Empty state ---------------- */
  if (!activeConversation) {
    return (
      <Stack
        flex={1}
        minHeight={0}
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#f0f0f0" }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a chat to start messaging
        </Typography>
      </Stack>
    );
  }

  const messages = Array.isArray(activeConversation.messages)
    ? activeConversation.messages
    : [];

  /* ---------------- Typing logic ---------------- */
  const isTyping =
    typing?.[activeConversation._id] &&
    String(typing[activeConversation._id]) !== String(userId);

  return (
    <Stack
      direction="column"
      flex={1}
      minHeight={0} // critical for scroll containment
    >
      {/* Header (fixed) */}
      <Header conversation={activeConversation} />

      {/* Messages (scrollable only area) */}
      <Box
        flex={1}
        minHeight={0}
        px={3}
        py={2}
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {messages.length === 0 && !isTyping ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={2}
          >
            No messages yet. Say hi!
          </Typography>
        ) : (
          <>
            {messages.map((msg) => (
              <Message
                key={msg._id || msg.client_id}
                message={{
                  ...msg,
                  incoming: String(msg.from) !== String(userId),
                }}
                menu
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, mt: 1 }}
              >
                Typing…
              </Typography>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Footer (fixed) */}
      <Footer conversation={activeConversation} />
    </Stack>
  );
};

export default Conversation;
