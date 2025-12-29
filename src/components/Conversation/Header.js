import React from 'react'
import { Box, Stack, Avatar, Typography, IconButton, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { faker } from '@faker-js/faker'
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react'
import StyledBadge from '../StyledBadge'
import { ToggleSidebar } from '../../redux/Slices/app'
import { useDispatch } from 'react-redux'

const Header = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
  return (
    <Box
        p={2}
        sx={{
          width: "100%",
          backgroundColor: theme.palette.mode === "light" ? "#F5F5F5" : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{ width: "100%", height: "100%" }}
        >
          <Stack onClick={() => {dispatch(ToggleSidebar())}} direction={"row"} spacing={2}>
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={faker.name.fullName()}
                  src={faker.internet.avatar()}
                />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle">
                {faker.name.fullName()}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={3}>
            <IconButton>
              <VideoCamera />
            </IconButton>
            <IconButton>
              <Phone />
            </IconButton>
            <IconButton>
              <MagnifyingGlass />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton>
              <CaretDown />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
  )
}

export default Header
