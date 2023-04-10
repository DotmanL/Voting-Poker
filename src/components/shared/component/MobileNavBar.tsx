import React, { useState, useContext } from "react";
import { SidebarContext } from "utility/providers/SideBarProvider";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Grid, IconButton, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { AiOutlineClose } from "react-icons/ai";
import { IUser } from "interfaces/User/IUser";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import DarkModeToggle from "./DarkModeToggle";

type Props = {
  user: IUser;
  appName: string;
  handleSignOut: () => Promise<void>;
  handleLeaveRoom: () => Promise<void>;
  handleSignUp: () => Promise<void>;
};

function MobileNavBar(props: Props) {
  const { user, appName, handleSignOut, handleLeaveRoom, handleSignUp } = props;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const location = useLocation();
  const urlPath = location.pathname;

  const toggleDrawer =
    (isSideBarOpen: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsMobileNavOpen(isSideBarOpen);
    };

  const list = (
    <Box
      sx={{
        width: "100vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "secondary.main"
      }}
      role="presentation"
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          position: "absolute",
          top: 25,
          right: 25
        }}
      >
        <AiOutlineClose size={32} onClick={() => setIsMobileNavOpen(false)} />
      </Grid>

      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          py: 4,
          pl: 4,
          marginTop: "15px",
          width: "100%"
        }}
      >
        <Typography variant="h6">Hi, {user?.name}</Typography>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          px: 4,
          width: "100%"
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: "24px"
          }}
        >
          Switch Modes
          <Grid sx={{ mt: 0.5 }}>
            <DarkModeToggle />
          </Grid>
        </Grid>
        <Grid sx={{}}>
          <Grid
            sx={{
              display: urlPath.indexOf("/room") >= 0 ? "flex" : "none",
              fontSize: "24px"
            }}
            onClick={handleLeaveRoom}
          >
            Leave Room
          </Grid>
          <Grid onClick={() => setIsMobileNavOpen(false)} sx={{ mt: 0.5 }}>
            <Grid
              onClick={!user ? handleSignUp : handleSignOut}
              sx={{ fontSize: "24px" }}
            >
              {!user ? "Sign Up" : "Sign Out"}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid sx={{ display: { md: "none", xs: "flex" }, p: 2 }}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <Grid onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} sx={{}}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon sx={{ width: "30px", height: "30px" }} />
          </IconButton>
        </Grid>

        <Grid sx={{}}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Jost",
              fontWeight: "bold",
              mt: 0.5,
              fontSize: { md: "40px", xs: "22px" },
              color: "primary.main"
            }}
          >
            {appName}
          </Typography>
        </Grid>
        <Grid
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          sx={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
            height: "50px",
            borderRadius: "10px",
            border: "1px solid #67A3EE",
            mr: 1,
            mt: 0.5,
            px: 1,
            py: 0.5,
            cursor: "pointer",
            display: urlPath.indexOf("/room") >= 0 ? "flex" : "none"
          }}
        >
          <ViewSidebarIcon
            sx={{
              width: "24px",
              height: "24px",
              color: (theme) => theme.palette.primary.main
            }}
          />
        </Grid>
      </Grid>
      <SwipeableDrawer
        anchor={"left"}
        open={isMobileNavOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{ height: "0vh" }}
        PaperProps={{
          sx: { background: (theme) => theme.palette.secondary.main }
        }}
        ModalProps={{
          BackdropProps: {
            invisible: true,
            sx: {
              cursor: "pointer",
              width: "100%",
              height: "0vh"
            }
          }
        }}
      >
        {list}
      </SwipeableDrawer>
    </Grid>
  );
}

export default MobileNavBar;