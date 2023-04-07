import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import { useContext, useEffect, useState } from "react";
// import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "./Link";
// import { AccountCircle } from "@mui/icons-material";
// import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
import UserService from "api/UserService";
import { IUser } from "interfaces/User/IUser";
import { toast } from "react-toastify";
import { userContext } from "../../../App";
import { SidebarContext } from "components/providers/SideBarProvider";

type Props = {
  appName: string;
  currentUser?: IUser;
  isBorderBottom?: boolean;
};

export const NavBar = (props: Props) => {
  const { appName, currentUser, isBorderBottom } = props;
  const navigate = useNavigate();
  const userData = useContext(userContext);
  const location = useLocation();
  const urlPath = location.pathname;
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isSidebarOpen } = useContext(SidebarContext);
  const [scrolledDownEnough, setScrolledDownEnough] = useState(false);
  const [user, setUser] = useState<IUser>(
    currentUser ? currentUser : userData!
  );

  // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleLeaveRoom = async () => {
    navigate("/new-room");
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
          boxShadow: !scrolledDownEnough
            ? "none"
            : "0 5px 5px -2px rgba(0, 0, 0, 0.2)",
          height: { md: "90px", xs: "80px" },
          borderBottom: isBorderBottom ? "2px solid #67A3EE" : "",
          p: 2,
          justifyContent: { md: "space-between", xs: "flex-start" }
        }}
        position="fixed"
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: { md: "space-between", xs: "flex-start" },
            marginRight: isSidebarOpen ? "410px" : "0"
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
                  color: "#67A3EE"
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
              ml: "auto",
              alignItems: "center"
            }}
          >
            <Grid>
              {user && (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mr: { md: 4, xs: 2 },
                      display: { md: "flex", xs: "none" }
                    }}
                  >
                    Welcome {user?.name}
                  </Typography>
                  {/* <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ mr: { md: 15, xs: 2 } }}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
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
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </Menu> */}
                </Grid>
              )}
            </Grid>
            <Grid>
              <Button
                sx={[
                  {
                    display: { md: "none", xs: "none" },
                    background: "#67A3EE",
                    color: "secondary.main",
                    px: { md: 2, xs: 1.5 },
                    py: { md: 0.5, xs: 0.5 },
                    fontSize: { md: "20px", xs: "13px" }
                  },
                  {
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green"
                    }
                  }
                ]}
              >
                {/* <Link to="/signup"> */}
                Sign Up
                {/* </Link> */}
              </Button>
            </Grid>
            <Grid
              sx={{
                display: urlPath.indexOf("/room") >= 0 ? "flex" : "none"
              }}
            >
              <Button
                onClick={handleLeaveRoom}
                sx={[
                  {
                    background: "#67A3EE",
                    color: "secondary.main",
                    px: { md: 2, xs: 1.5 },
                    py: { md: 0.5, xs: 0.5 },
                    fontSize: { md: "20px", xs: "13px" },
                    mx: { md: 2, xs: 1 }
                  },
                  {
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green"
                    }
                  }
                ]}
              >
                Leave Room
              </Button>
            </Grid>
            <Grid>
              <Button
                title={!user ? "Sign Up By Joining a room below" : ""}
                onClick={!user ? handleSignUp : handleSignOut}
                // disabled={!user}
                sx={[
                  {
                    background: "#67A3EE",
                    color: "secondary.main",
                    px: { md: 2, xs: 1.5 },
                    py: { md: 0.5, xs: 0.5 },
                    fontSize: { md: "20px", xs: "13px" },
                    mx: { md: 2, xs: 1 }
                  },
                  {
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green"
                    }
                  }
                ]}
              >
                {!user ? "Sign Up" : "Sign Out"}
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};
