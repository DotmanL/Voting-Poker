import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Link } from "./Link";
import { AccountCircle } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

type Props = {
  appName: string;
};

export const NavBar = (props: Props) => {
  const { appName } = props;
  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [scrolledDownEnough, setScrolledDownEnough] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          height: { md: "90px", xs: "80px" },
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
            justifyContent: { md: "space-between", xs: "flex-start" }
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
              {auth && (
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
                    Ola
                  </Typography>
                  <IconButton
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
                  </Menu>
                </Grid>
              )}
            </Grid>
            <Grid>
              <Button
                sx={[
                  {
                    background: "#67A3EE",
                    px: { md: 3, xs: 1.5 },
                    py: { md: 1, xs: 0.5 },
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
                <Link to="/signup">Sign Up</Link>
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};
