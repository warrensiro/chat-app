import React from "react";
import {
  Timeline,
  TextMsg,
  MediaMsg,
  ReplyMsg,
  LinkMsg,
  DocMsg,
} from "./MessageTypes";

const Message = ({ message, menu, conversation }) => {
  if (!message) return null;

  const userId = localStorage.getItem("user_id");

  // 1️⃣ Divider / timeline
  if (message.type === "divider") {
    return <Timeline el={message} />;
  }

  // Enrich message with incoming flag
  const enrichedMessage = {
    ...message,
    incoming: String(message.from) !== String(userId),
  };

  // 2️⃣ Replies ALWAYS win
  if (enrichedMessage.replyTo) {
    return (
      <ReplyMsg el={enrichedMessage} menu={menu} conversation={conversation} />
    );
  }

  // 3️⃣ Route by subtype / type
  switch (enrichedMessage.subtype || enrichedMessage.type) {
    case "Media":
      return (
        <MediaMsg
          el={enrichedMessage}
          menu={menu}
          conversation={conversation}
        />
      );

    case "Document":
      return (
        <DocMsg el={enrichedMessage} menu={menu} conversation={conversation} />
      );

    case "Link":
      return (
        <LinkMsg el={enrichedMessage} menu={menu} conversation={conversation} />
      );

    case "Text":
    default:
      return (
        <TextMsg el={enrichedMessage} menu={menu} conversation={conversation} />
      );
  }
};

export default Message;
