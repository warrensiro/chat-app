import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useSelector } from "react-redux";

const Reactions = ({ reactions }) => {
  const theme = useTheme();
  const userId = localStorage.getItem("user_id");
  const { activeConversation } = useSelector((state) => state.app);

  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const grouped = reactions.reduce((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, fromMine: false, users: [] };
    acc[r.emoji].count += 1;
    if (String(r.from) === String(userId)) acc[r.emoji].fromMine = true;
    acc[r.emoji].users.push(r.from);
    return acc;
  }, {});

  const groupedArray = Object.entries(grouped).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    fromMine: data.fromMine,
    users: data.users,
  }));

  // Resolve userId → human-readable name
  const resolveName = (id) => {
    if (String(id) === String(userId)) return "You";
    const user = activeConversation?.participants?.find(
      (p) => String(p._id) === String(id),
    );
    return user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Unknown";
  };

  return (
    <Stack direction="row" spacing={0.5} mt={0.5}>
      {groupedArray.map((r) => {
        const names = r.users.map(resolveName).join(", ");

        return (
          <Tooltip
            key={r.emoji}
            title={<Typography variant="caption">{names}</Typography>}
            arrow
          >
            <Box
              sx={{
                px: 0.5,
                py: 0.2,
                backgroundColor: r.fromMine ? "#d1f0ff" : "rgba(0,0,0,0.1)",
                borderRadius: 1,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "default",
              }}
            >
              <Typography fontSize={12}>{r.emoji}</Typography>
              {r.count > 1 && (
                <Typography fontSize={10} color="text.secondary">
                  {r.count}
                </Typography>
              )}
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default Reactions;
