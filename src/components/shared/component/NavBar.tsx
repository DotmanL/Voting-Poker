import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "./Link";
import { AccountCircle } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import UserService from "api/UserService";
import { IUser } from "interfaces/User/IUser";
import { toast } from "react-toastify";
import { userContext } from "../../../App";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { SidebarContext } from "utility/providers/SideBarProvider";
import DarkModeToggle from "./DarkModeToggle";
import MobileNavBar from "./MobileNavBar";

type Props = {
  appName: string;
  currentUser?: IUser;
  isBorderBottom?: boolean;
};

export const NavBar = (props: Props) => {
  const { appName, currentUser } = props;
  const navigate = useNavigate();
  const userData = useContext(userContext);
  const location = useLocation();
  const urlPath = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [scrolledDownEnough, setScrolledDownEnough] = useState(false);
  const [user, setUser] = useState<IUser>(
    currentUser ? currentUser : userData!
  );

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveRoom = async () => {
    navigate("/new-room");
    handleClose();
    // toast.info("Kindly join a room");
  };

  const handleSignOut = async () => {
    localStorage.removeItem("userId");
    await UserService.deleteUser(user._id);
    navigate("/");
    window.location.reload();
    toast.success("Sign Out Succesful and Account Deleted");
  };

  const handleSignUp = async () => {
    navigate("/new-room");
  };

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(userData!);
    }
    const handleScroll = () => {
      const bodyScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrolledDown = bodyScrollTop > 50;
      setScrolledDownEnough(scrolledDown);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolledDownEnough, currentUser, userData]);

  return (
    <Grid>
      <AppBar
        elevation={!scrolledDownEnough ? 0 : 7}
        sx={{
          top: "0",
          background: (theme) => theme.palette.secondary.main,
          boxShadow: !scrolledDownEnough
            ? "none"
            : "0 5px 5px -2px rgba(0, 0, 0, 0.2)",
          height: { md: "90px", xs: "80px" },
          // borderBottom: isBorderBottom ? "2px solid #67A3EE" : "",
          justifyContent: { md: "space-between", xs: "flex-start" }
        }}
        position="fixed"
      >
        <MobileNavBar
          user={user}
          appName={appName}
          handleLeaveRoom={handleLeaveRoom}
          handleSignOut={handleSignOut}
          handleSignUp={handleSignUp}
        />
        <Toolbar
          sx={{
            display: { md: "flex", xs: "none" },
            flexDirection: "row",
            my: 2,
            ml: 2,
            alignItems: "center",
            justifyContent: { md: "space-between", xs: "flex-start" },
            marginRight:
              isSidebarOpen && urlPath.indexOf("/room") >= 0 ? "380px" : "0"
          }}
        >
          <Link to="/">
            <Grid>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: { md: "40px", xs: "24px" },
                  color: "primary.main"
                }}
              >
                {appName}
              </Typography>
            </Grid>
          </Link>

          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {user && (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "auto",
                    mr: { md: 2, xs: 0 },
                    ml: { md: 0, xs: 2 }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { md: "24px", xs: "14px" },
                      mt: { xs: 0.5 }
                    }}
                  >
                    Hi {user?.name}
                  </Typography>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "auto"
                    }}
                  >
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                      sx={{ ml: { md: 0.5, xs: 2 }, mt: 0.5 }}
                    >
                      <AccountCircle />
                    </IconButton>

                    <Menu
                      id="menu-appbar"
                      sx={{ mt: 5, mr: { md: 0.5, xs: 1 } }}
                      PaperProps={{
                        sx: { height: "auto", width: "auto", px: 1, py: 0.5 }
                      }}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        sx={{
                          display:
                            urlPath.indexOf("/room") >= 0 ? "flex" : "none"
                        }}
                        onClick={handleLeaveRoom}
                      >
                        Leave Room
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Grid onClick={!user ? handleSignUp : handleSignOut}>
                          {!user ? "Sign Up" : "Sign Out"}
                        </Grid>
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
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
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: (theme) => theme.palette.primary.main,
                mr: { md: 2, xs: 0 },
                mt: { md: 1, xs: 0.5 },
                p: { md: 1, xs: 0.5 },
                cursor: "pointer",
                display: urlPath.indexOf("/room") >= 0 ? "flex" : "none"
              }}
            >
              <ViewSidebarIcon
                sx={{
                  width: "32px",
                  height: "32px",
                  color: (theme) => theme.palette.primary.main
                }}
              />
            </Grid>
            <Grid
              sx={{
                mr: { md: 7, xs: 0 },
                mt: { md: 0.5, xs: 0 }
              }}
            >
              <DarkModeToggle />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};
