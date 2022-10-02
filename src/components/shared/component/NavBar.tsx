import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Link } from "./Link";
import { Navbox } from "./styles/Navbar.styles";
import { AccountCircle } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const useStyles = makeStyles((theme) => ({
  appBarHomePage: {
    top: "0",
    boxShadow: "none",
    background: "red",
    height: "90px",
    padding: theme.spacing(3, 2),
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      height: "60px",
      padding: theme.spacing(2, 0),
      borderBottom: "2px solid white"
    }
  },

  logoo: {
    width: "50px",
    height: "50px",
    marginTop: "13px",
    [theme.breakpoints.down("md")]: {
      width: "30px",
      height: "30px",
      marginTop: "2px"
    }
  },

  button: {
    color: theme.palette.background.default,
    background: theme.palette.primary.main,
    width: "auto",
    height: "auto",
    borderRadius: "15px",
    padding: theme.spacing(0.3, 2),
    "&:hover": {
      background: theme.palette.primary.main,
      opacity: 0.9
    }
  },
  menuIconDiv: {
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column"
    }
  },
  menuIcon: {
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      color: "white"
    }
  },
  mobileMenu: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  menuText: {
    fontSize: theme.spacing(3.5),
    margin: theme.spacing(2, 0.8),
    color: "black"
  },
  new: {
    backgroundColor: theme.palette.secondary.main,
    top: "0",
    color: "black",
    height: "90px",
    padding: theme.spacing(3, 2),
    justifyContent: "center",
    boxShadow: "0 5px 5px -2px rgba(0, 0, 0, 0.2)",
    marginTop: theme.spacing(-0.1),
    [theme.breakpoints.down("md")]: {
      height: "60px",
      padding: theme.spacing(3, 0)
    }
  }
}));

interface NavBarProps {
  appName: string;
  isHomePage?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ appName, isHomePage }) => {
  const classes = useStyles();
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolledDownEnough, setScrolledDownEnough] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      const bodyScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrolledDown = bodyScrollTop > 50;
      setScrolledDownEnough(scrolledDown);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolledDownEnough]);

  return (
    <Grid>
      <AppBar
        elevation={!scrolledDownEnough ? 0 : 7}
        sx={{
          top: "0",
          boxShadow: !scrolledDownEnough
            ? "none"
            : "0 5px 5px -2px rgba(0, 0, 0, 0.2)",
          height: "90px",
          p: 2,
          justifyContent: "center"
        }}
        position="fixed"
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Link to="/">
            <Grid>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Jost",
                  fontWeight: "bold",
                  fontSize: "40px",
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
            <Grid sx={{ ml: 3 }}>
              {auth && (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Typography variant="h5" sx={{ mr: 4 }}>
                    Ola
                  </Typography>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ mr: 15 }}
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
                  </Menu>
                </Grid>
              )}
            </Grid>
            <Grid>
              <Button
                sx={[
                  { background: "#67A3EE", px: 3, py: 1 },
                  {
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green"
                    }
                  }
                ]}
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </Grid>
          </Grid>

          <IconButton
            className={classes.menuIconDiv}
            onClick={handleMobileMenu}
            size="large"
          >
            {/* {mobileMenu ? <Hamburger hidden={false} /> : <Hamburger />} */}
          </IconButton>
        </Toolbar>
      </AppBar>
      {mobileMenu && (
        <Navbox>
          <Typography className={classes.menuText} onClick={handleMobileMenu}>
            <Link to="/signup">Sign Up</Link>
          </Typography>
          <Typography className={classes.menuText} onClick={handleMobileMenu}>
            <Link to="/signin">Sign In</Link>
          </Typography>
        </Navbox>
      )}
    </Grid>
  );
};
