import React from "react";
import {
  Timeline,
  TextMsg,
  MediaMsg,
  ReplyMsg,
  LinkMsg,
  DocMsg,
} from "./MessageTypes";

const Message = ({ message, menu }) => {
  if (!message) return null;

  const userId = localStorage.getItem("user_id");

  // Divider / timeline
  if (message.type === "divider") {
    return <Timeline el={message} />;
  }

  // Determine if the message is incoming (from other user)
  const enrichedMessage = {
    ...message,
    incoming: String(message.from) !== String(userId),
  };

  // Route by message subtype
  switch (message.subtype) {
    case "Media":
      return <MediaMsg el={enrichedMessage} menu={menu} />;

    case "Document":
      return <DocMsg el={enrichedMessage} menu={menu} />;

    case "Link":
      return <LinkMsg el={enrichedMessage} menu={menu} />;

    case "Reply":
      return <ReplyMsg el={enrichedMessage} menu={menu} />;

    case "Text":
    default:
      return <TextMsg el={enrichedMessage} menu={menu} />;
  }
};

export default Message;
