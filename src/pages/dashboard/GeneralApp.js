import React from "react";
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar } = useSelector((store) => store.app);

  return (
    <Stack
      direction="row"
      sx={{
        width: "100vw",
        height: "100vh", // ✅ ROOT HEIGHT
        overflow: "hidden", // ✅ prevent page scroll
      }}
    >
      {/* Chats (left sidebar) */}
      <Chats />

      {/* Conversation area */}
      <Box
        sx={{
          flex: 1, // ✅ fill remaining width
          display: "flex", // ✅ REQUIRED
          flexDirection: "column", // ✅ REQUIRED
          minHeight: 0, // ✅ REQUIRED
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background.paper,
          overflow: "hidden", // ✅ prevent bleed scroll
        }}
      >
        <Conversation />
      </Box>

      {/* Right sidebar */}
      {sidebar.open && (
        <Box
          sx={{
            width: 320,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {(() => {
            switch (sidebar.type) {
              case "CONTACT":
                return <Contact />;
              case "STARRED":
                return <StarredMessages />;
              case "SHARED":
                return <SharedMessages />;
              default:
                return null;
            }
          })()}
        </Box>
      )}
    </Stack>
  );
};

export default GeneralApp;
