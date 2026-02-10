import { useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "./Link";
import { AccountCircle } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import UserService from "api/UserService";
import { IUser } from "interfaces/User/IUser";
import { toast } from "react-toastify";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { SidebarContext } from "utility/providers/SideBarProvider";
import DarkModeToggle from "./DarkModeToggle";
import { IssueContext } from "utility/providers/IssuesProvider";
import darkvppLogo from "../assets/darkvppLogo.png";
import lightvpplogo from "../assets/lightvpplogo.png";
import MobileNavBar from "./MobileNavBar";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useTheme } from "@mui/material/styles";
import CustomModal from "./CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
import { UserContext } from "utility/providers/UserProvider";

type Props = {
  appName: string;
  companyName?: string;
  loggedInUser?: IUser;
  isBorderBottom?: boolean;
  currentRoomLink?: string;
};

export const NavBar = (props: Props) => {
  const { appName, loggedInUser, currentRoomLink, companyName } = props;
  const navigate = useNavigate();
  const appTheme = useTheme();
  const { currentUser } = useContext(UserContext);
  const { activeIssue } = useContext(IssueContext);
  const location = useLocation();
  const urlPath = location.pathname;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [scrolledDownEnough, setScrolledDownEnough] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>(
    loggedInUser ? loggedInUser : currentUser!
  );

  async function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  async function handleClose() {
    setAnchorEl(null);
  }

  async function handleLeaveRoom() {
    if (companyName) {
      navigate(`/${companyName}`);
    } else {
      navigate("/new-room");
    }
    handleClose();
  }

  async function handleSignOut() {
    localStorage.removeItem("userId");
    await UserService.deleteUser(user._id);
    handleClose();
    navigate("/");
    window.location.reload();
    toast.success("Sign Out Succesful and Account Deleted");
  }

  async function handleSignUp() {
    handleClose();
    navigate("/new-room");
  }

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  }

  async function handleCopyClick(text: string) {
    const isCopySuccess = await copyTextToClipboard(text);
    if (isCopySuccess) {
      setIsCopied(true);
      setIsInviteModalOpen(false);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
      return;
    }
    return;
  }

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      setUser(currentUser!);
    }
    const handleScroll = () => {
      const bodyScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrolledDown = bodyScrollTop > 50;
      setScrolledDownEnough(scrolledDown);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolledDownEnough, loggedInUser, currentUser]);

  return (
    <Grid>
      <AppBar
        elevation={0}
        sx={{
          top: "0",
          background: (theme) =>
            scrolledDownEnough
              ? theme.palette.mode === "dark"
                ? "rgba(20, 26, 31, 0.85)"
                : "rgba(248, 249, 250, 0.85)"
              : theme.palette.secondary.main,
          backdropFilter: scrolledDownEnough ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolledDownEnough ? "blur(12px)" : "none",
          boxShadow: !scrolledDownEnough
            ? "none"
            : "0 1px 0 rgba(0, 0, 0, 0.06)",
          height: { md: "80px", xs: "70px" },
          borderBottom: scrolledDownEnough
            ? (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.06)"
                  : "1px solid rgba(0, 0, 0, 0.06)"
            : "none",
          justifyContent: { md: "space-between", xs: "flex-start" },
          transition: "all 0.3s ease"
        }}
        position="fixed"
      >
        <MobileNavBar
          user={user}
          appName={appName}
          isCopied={isCopied}
          handleLeaveRoom={handleLeaveRoom}
          handleSignOut={handleSignOut}
          handleSignUp={handleSignUp}
          setIsInviteModalOpen={setIsInviteModalOpen}
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
          <Link
            to="/"
            sx={{
              display: { md: "flex", xs: "none" },
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
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
                variant="h6"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: { md: "22px", xs: "18px" },
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
              display: isCopied ? "flex" : "none",
              px: 4,
              height: "auto",
              ml: 4,
              mt: 4,
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
              <Typography variant="h6" fontSize="18px" sx={{ py: 1 }}>
                Invitation Link Copied to you Clipboard,
                <br /> You can now share with your team mates
              </Typography>
            ) : (
              ""
            )}
          </Grid>

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
                  px: 1,
                  mr: { md: 2, xs: 0 },
                  ml: { md: 0, xs: 2 },
                  mt: { md: 1, xs: 0.5 },
                  borderRadius: "10px",
                  border: "1.5px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    borderRadius: "10px",
                    borderColor: (theme) => theme.palette.primary.main,
                    transition: "all 0.2s ease-in-out",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 0 0 3px rgba(232, 234, 237, 0.08)"
                        : "0 0 0 3px rgba(91, 147, 217, 0.12)"
                  }
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "auto"
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { md: "24px", xs: "14px" }
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
                      sx={{ ml: { md: 0.5, xs: 2 } }}
                    >
                      <AccountCircle />
                    </IconButton>

                    <Menu
                      id="menu-appbar"
                      sx={{ mt: 5, mr: { md: 4, xs: 1 } }}
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
                      <MenuItem onClick={!user ? handleSignUp : handleSignOut}>
                        <Tooltip
                          arrow
                          title="This deletes your current username and signs you out of the room"
                        >
                          <Grid>{!user ? "Sign Up" : "Sign Out"}</Grid>
                        </Tooltip>
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid
              sx={{
                mx: 2,
                mt: 1,
                display: urlPath.indexOf("/room") >= 0 ? "flex" : "none",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: "10px",
                border: "1.5px solid",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                color: (theme) => theme.palette.primary.main,
                px: 1.5,
                py: 0.5,
                background: (theme) => theme.palette.secondary.main,
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  borderColor: (theme) => theme.palette.primary.main,
                  transition: "all 0.2s ease-in-out",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 0 3px rgba(232, 234, 237, 0.08)"
                      : "0 0 0 3px rgba(91, 147, 217, 0.12)"
                }
              }}
              onClick={() => setIsInviteModalOpen(true)}
            >
              {!!activeIssue ? (
                <PersonAddAlt1Icon sx={{}} />
              ) : (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <PersonAddAlt1Icon sx={{ mr: 1 }} />
                  <Typography variant="h5">Invite Team Members</Typography>
                </Grid>
              )}
            </Grid>
            <Grid>
              <CustomModal
                isOpen={isInviteModalOpen}
                size="sm"
                modalWidth="40vw"
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flexStart",
                    mt: { md: 4, xs: 2 }
                  }}
                >
                  <Grid
                    sx={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      cursor: "pointer",
                      "&:hover": {
                        color: "red"
                      }
                    }}
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      setIsCopied(false);
                    }}
                  >
                    <AiOutlineClose size={32} />
                  </Grid>

                  <Grid sx={{ pl: 5 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { md: "24px", xs: "24px" },
                        fontStyle: "bolder",
                        fontWeight: "900px"
                      }}
                    >
                      Invite Team Members
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: { md: 4, xs: 2 },
                      width: "90%",
                      height: "auto",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: { md: "16px", xs: "10px" },
                      textAlign: { xs: "center" },
                      alignSelf: "center",
                      border: "1.5px solid",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {currentRoomLink}
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      mt: { md: 2, xs: 1 },
                      mb: { xs: 2 },
                      width: "90%",
                      height: { md: "50px", xs: "30px" },
                      borderRadius: "10px",
                      alignSelf: "center",
                      background: (theme) => theme.palette.primary.main,
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
                      fontWeight: 600,
                      fontSize: "16px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        opacity: 0.9,
                        transform: "translateY(-1px)"
                      }
                    }}
                    onClick={() => handleCopyClick(currentRoomLink!)}
                  >
                    Copy Room Link
                  </Grid>
                </Grid>
              </CustomModal>
            </Grid>

            <Grid
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "auto",
                height: "40px",
                borderRadius: "10px",
                borderWidth: "1.5px",
                border: "1.5px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(0, 0, 0, 0.1)",
                mr: { md: 2, xs: 0 },
                mt: { md: 1, xs: 0.5 },
                p: { md: 1, xs: 0.5 },
                cursor: "pointer",
                display: urlPath.indexOf("/room") >= 0 ? "flex" : "none",
                "&:hover": {
                  borderColor: (theme) => theme.palette.primary.main,
                  transition: "all 0.2s ease-in-out",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 0 3px rgba(232, 234, 237, 0.08)"
                      : "0 0 0 3px rgba(91, 147, 217, 0.12)"
                }
              }}
            >
              <ViewSidebarIcon
                sx={{
                  width: "28px",
                  height: "28px",
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
