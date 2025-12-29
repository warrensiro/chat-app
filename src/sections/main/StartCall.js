import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { MagnifyingGlass } from "phosphor-react";
import { CallElement } from "../../components/CallElement";
import { MembersList } from "../../data";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      slots={{
        transition: Transition,
      }}
      keepMounted
      sx={{ p: 4 }}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {/* title of dialog box */}
      <DialogTitle sx={{ mb: 2 }}>Start Call</DialogTitle>
      {/* content of dialog box  */}
      <DialogContent>
        <Stack spacing={3}>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#789CE5" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>
          {MembersList.map((el) => (
            <CallElement {...el} />
          ))}
        </Stack>
      </DialogContent>
      {/* form */}
    </Dialog>
  );
};

export default StartCall;
