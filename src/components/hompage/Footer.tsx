import React from "react";
import { Grid, Typography } from "@mui/material";
import dotvotingLogo from "./assets/dotvotingLogo.png";
import { Link } from "../shared/component/Link";

function Footer() {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: { md: "column", xs: "column" },
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#121212" : "#e9ecef",
        height: { md: "200px", xs: "100%" }
      }}
    >
      <Grid
        sx={{
          background: "red",
          borderTop: "1px solid gray",
          height: "auto",
          width: { md: "75%", xs: "80%" },
          display: "flex",
          justifyContent: "center",
          mr: "auto",
          ml: "auto",
          mt: 2
        }}
      ></Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          justifyContent: { md: "space-between" },
          width: { md: "75%", xs: "80%" },
          mr: "auto",
          ml: "auto",
          mt: { md: 1, xs: 1 }
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { md: "flex-start", xs: "center" },
            height: { md: "100%", xs: "30%" },
            width: { md: "50%", xs: "100%" }
          }}
        >
          <Link to="/">
            <Grid
              component={"img"}
              src={dotvotingLogo}
              alt="waves"
              sx={{
                height: { md: "80px", xs: "50px" },
                width: { md: "80px", xs: "50px" }
              }}
            />
          </Link>
          <Link to="/">
            <Typography
              variant="h5"
              color="#f9f7f3"
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark" ? "gray" : "black",
                fontSize: { md: "24px", xs: "14px" },
                "&:hover": {
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "gray" : "black",
                  opacity: 1
                }
              }}
            >
              Virtual Planning Poker
            </Typography>
          </Link>
        </Grid>
        <Grid
          sx={{
            ml: { md: 2 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            px: { md: 2 },
            py: { md: 1, xs: 1 },
            height: { md: "100%", xs: "35%" },
            alignItems: { md: "flex-end", xs: "center" },
            width: { md: "50%", xs: "100%" }
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              width: { md: "60%", xs: "100%" },
              justifyContent: { md: "flex-end", xs: "center" },
              alignItems: "center",
              px: 1
            }}
          >
            <Link to="/privacy-policy">
              <Typography
                variant="h6"
                sx={{
                  fontSize: { md: "18px", xs: "14px" },
                  fontWeight: "normal",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "gray" : "black",
                  "&:hover": {
                    opacity: 0.9
                  }
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Typography
              sx={{
                fontSize: { md: "18px", xs: "14px" },
                fontWeight: "normal",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "gray" : "black",
                ml: 0.8,
                "&:hover": {
                  opacity: 0.9
                }
              }}
            >
              •
            </Typography>
            <Link to="https://oladotunlawal.com/" target="_blank">
              <Typography
                variant="h6"
                sx={{
                  fontSize: { md: "18px", xs: "14px" },
                  ml: 1,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "gray" : "black",
                  fontWeight: "normal",
                  "&:hover": {
                    opacity: 0.9
                  }
                }}
              >
                Contact Us
              </Typography>
            </Link>
          </Grid>
          <Grid>
            <Link to="https://github.com/DotmanL/" target="_blank">
              <Typography
                variant="h6"
                sx={{
                  fontSize: { md: "18px", xs: "14px" },
                  ml: 1,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "gray" : "black",
                  textDecorationStyle: "underline",
                  fontWeight: "normal",
                  "&:hover": {
                    opacity: 0.9
                  }
                }}
              >
                Created by Dotmanl
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
