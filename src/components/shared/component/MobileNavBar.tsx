import React, { useState, useContext } from "react";
import { SidebarContext } from "utility/providers/SideBarProvider";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Grid, IconButton, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Link } from "./Link";
import MenuIcon from "@mui/icons-material/Menu";
import { AiOutlineClose } from "react-icons/ai";
import { IUser } from "interfaces/User/IUser";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import DarkModeToggle from "./DarkModeToggle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@mui/material/styles";
import darkvppLogo from "../assets/darkvppLogo.png";
import lightvpplogo from "../assets/lightvpplogo.png";

type Props = {
  user: IUser;
  appName: string;
  isCopied: boolean;
  handleSignOut: () => Promise<void>;
  handleLeaveRoom: () => Promise<void>;
  handleSignUp: () => Promise<void>;
  setIsInviteModalOpen: (isInviteModalOpen: boolean) => void;
};

function MobileNavBar(props: Props) {
  const {
    user,
    appName,
    isCopied,
    handleSignOut,
    handleLeaveRoom,
    handleSignUp,
    setIsInviteModalOpen
  } = props;
  const appTheme = useTheme();
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
        <Typography variant="h6">
          {!!user ? `Hi ${" "}${user?.name}` : ""}
        </Typography>
      </Grid>

      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          px: 3,
          width: "100%"
        }}
      >
        {urlPath.includes("/room") ? (
          <Grid
            sx={{
              mx: 0.5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontFamily: "Jost",
              cursor: "pointer",
              color: (theme) => theme.palette.primary.main,
              py: 0.5,
              background: (theme) => theme.palette.secondary.main,
              borderColor: (theme) => theme.palette.primary.main,
              "&:hover": {
                opacity: 0.8
              }
            }}
            onClick={() => {
              setIsMobileNavOpen(false);
              setIsInviteModalOpen(true);
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <PersonAddAlt1Icon sx={{ mr: 1 }} />
              <Typography variant="h5">Invite Players</Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid></Grid>
        )}
        <Grid
          sx={{
            m: 0,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            p: 0,
            justifyContent: "flex-start"
          }}
        >
          <DarkModeToggle isMobileFlex />
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
          flexDirection: urlPath.indexOf("/room") >= 0 ? "row" : "row-reverse",
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
        <Link
          to="/"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none"
          }}
        >
          <Grid>
            {appTheme.palette.mode === "dark" ? (
              <Grid
                component={"img"}
                src={darkvppLogo}
                alt="waves"
                sx={{
                  height: { md: "60px", xs: "60px" },
                  width: { md: "60px", xs: "60px" }
                }}
              />
            ) : (
              <Grid
                component={"img"}
                src={lightvpplogo}
                alt="waves"
                sx={{
                  height: { md: "60px", xs: "60px" },
                  width: { md: "60px", xs: "60px" }
                }}
              />
            )}
          </Grid>
          <Grid>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: { xs: "18px" },
                letterSpacing: "-0.01em",
                color: "primary.main"
              }}
            >
              {appName}
            </Typography>
          </Grid>
        </Link>
        <Grid
          sx={{
            position: "absolute",
            top: 60,
            display: isCopied ? "flex" : "none",
            px: 4,
            height: "auto",
            ml: 4,
            mt: 2,
            border: "none",
            borderRadius: "12px",
            background: (theme) =>
              theme.palette.mode === "dark" ? "#1c2329" : "#1a1a2e",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            width: "auto",
            color: (theme) => theme.palette.primary.main,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {isCopied ? (
            <Typography variant="h6" fontSize="10px" sx={{ py: 1 }}>
              Invitation Link Copied to you Clipboard,
              <br /> You can now share with your team mates
            </Typography>
          ) : (
            ""
          )}
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
            border: "1.5px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(91, 147, 217, 0.3)",
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
        anchor={urlPath.indexOf("/room") >= 0 ? "left" : "right"}
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
