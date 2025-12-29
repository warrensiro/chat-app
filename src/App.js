// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings"; 
import { Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ height: "100vh", overflowY: "hidden" }}>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>
    </Box>
  );
}

export default App;
