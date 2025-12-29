import React from "react";
import { Box, Stack, Typography, Button, TextField, Paper, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MapIcon from "@mui/icons-material/Map";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// Creative Material UI 404 Page
export default function Page404() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a237e, #0d47a1)",
        p: 4,
        color: "#fff",
        textAlign: "center",
      }}
      spacing={4}
    >
      {/* Floating icon */}
      <Box sx={{ animation: "float 3s ease-in-out infinite" }}>
        <AutoAwesomeIcon sx={{ fontSize: 80, opacity: 0.9 }} />
      </Box>

      <Typography variant="h2" sx={{ fontWeight: 800 }}>
        404 — Lost in Space
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: 420, lineHeight: 1.7 }}>
        The page you’re looking for drifted into another dimension. But don’t worry—our rocket is ready to take you back.
      </Typography>

      {/* Card */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          backdropFilter: "blur(8px)",
          maxWidth: 500,
          width: "100%",
        }}
      >
        {/* Quick Actions */}
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            href="/"
            sx={{ borderRadius: 2 }}
          >
            Home
          </Button>

          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            href="/sitemap.xml"
            sx={{ borderRadius: 2, color: "#fff", borderColor: "#fff" }}
          >
            Sitemap
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<HelpOutlineIcon />}
            href="/support"
            sx={{ borderRadius: 2 }}
          >
            Support
          </Button>
        </Stack>

        {/* Search */}
        <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            placeholder="Search the site..."
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
              },
            }}
          />
          <IconButton
            sx={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              width: 56,
              height: 56,
              "&:hover": { background: "rgba(255,255,255,0.3)" },
            }}
          >
            <SearchIcon sx={{ color: "white" }} />
          </IconButton>
        </Stack>
      </Paper>

      {/* Decorative Footer */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.8 }}>
        <RocketLaunchIcon />
        <Typography variant="caption">Guiding you through the cosmos...</Typography>
      </Stack>

      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Stack>
  );
}
