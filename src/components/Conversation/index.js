import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";

const formatDayLabel = (date) => {
  const msgDate = new Date(date);
  const today = new Date();

  const isToday = msgDate.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = msgDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Conversation = () => {
  const { activeConversation, typing } = useSelector((state) => state.app);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("user_id");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?._id, activeConversation?.messages?.length, typing?.[activeConversation?._id]]);

  if (!activeConversation) {
    return (
      <Stack flex={1} minHeight={0} alignItems="center" justifyContent="center" sx={{ backgroundColor: "#f0f0f0" }}>
        <Typography variant="h6" color="text.secondary">
          Select a chat to start messaging
        </Typography>
      </Stack>
    );
  }

  const allMessages = Array.isArray(activeConversation.messages) ? activeConversation.messages : [];

  // 🔹 Filtered messages based on search
  const messages = searchText
    ? allMessages.filter((msg) => msg.text?.toLowerCase().includes(searchText.toLowerCase()))
    : allMessages;

  const isTyping = typing?.[activeConversation._id] && String(typing[activeConversation._id]) !== String(userId);

  return (
    <Stack direction="column" flex={1} minHeight={0}>
      {/* Header */}
      <Header conversation={activeConversation} onSearch={setSearchText} />

      {/* Messages */}
      <Box flex={1} minHeight={0} px={3} py={2} sx={{ overflowY: "auto", overflowX: "hidden" }}>
        {messages.length === 0 && !isTyping ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
            No messages found.
          </Typography>
        ) : (
          <>
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const showDivider =
                !prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

              return (
                <React.Fragment key={msg._id || msg.client_id}>
                  {showDivider && <Message message={{ type: "divider", text: formatDayLabel(msg.createdAt) }} conversation={activeConversation} />}
                  <Message message={{ ...msg, incoming: String(msg.from) !== String(userId) }} menu conversation={activeConversation} />
                </React.Fragment>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 1 }}>
                Typing…
              </Typography>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Footer */}
      <Footer conversation={activeConversation} />
    </Stack>
  );
};


export default Conversation;
