import { styled } from "@mui/material/styles";
import { Badge } from "@mui/material";

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== "online", // allow 'online' prop
})(({ theme, online }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: online ? "#44b700" : "#9E9E9E",
    color: online ? "#44b700" : "#9E9E9E",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: online ? "ripple 1.2s infinite ease-in-out" : "none",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

export default StyledBadge;