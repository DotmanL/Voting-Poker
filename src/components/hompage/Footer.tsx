import React from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "../shared/component/Link";
import { useTheme } from "@mui/material/styles";
import darkvppLogo from "./assets/darkvppLogo.png";
import lightvpplogo from "./assets/lightvpplogo.png";

function Footer() {
  const appTheme = useTheme();

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: { md: "column", xs: "column" },
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#0f1419" : "#f1f3f5",
        height: { md: "200px", xs: "100%" },
        pb: { md: 0, xs: 2 }
      }}
    >
      <Grid
        sx={{
          borderTop: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
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
            <Grid>
              {appTheme.palette.mode === "dark" ? (
                <Grid
                  component={"img"}
                  src={darkvppLogo}
                  alt="darkvppLogo"
                  sx={{
                    height: { md: "80px", xs: "50px" },
                    width: { md: "80px", xs: "50px" }
                  }}
                />
              ) : (
                <Grid
                  component={"img"}
                  src={lightvpplogo}
                  alt="lightvpplogo"
                  sx={{
                    height: { md: "80px", xs: "50px" },
                    width: { md: "80px", xs: "50px" }
                  }}
                />
              )}
            </Grid>
          </Link>
          <Link to="/">
            <Typography
              variant="h5"
              color="#f9f7f3"
              sx={{
                color: "text.secondary",
                fontSize: { md: "22px", xs: "14px" },
                fontWeight: 600,
                "&:hover": {
                  color: "text.secondary",
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
                  fontSize: { md: "16px", xs: "14px" },
                  fontWeight: 500,
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    transition: "color 0.2s ease"
                  }
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Typography
              sx={{
                fontSize: { md: "16px", xs: "14px" },
                fontWeight: "normal",
                color: "text.secondary",
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
                  fontSize: { md: "16px", xs: "14px" },
                  ml: 1,
                  color: "text.secondary",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    transition: "color 0.2s ease"
                  }
                }}
              >
                Contact Me
              </Typography>
            </Link>
          </Grid>
          <Grid>
            <Link to="https://github.com/DotmanL/" target="_blank">
              <Typography
                variant="h6"
                sx={{
                  fontSize: { md: "16px", xs: "14px" },
                  ml: 1,
                  color: "text.secondary",
                  textDecorationStyle: "underline",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    transition: "color 0.2s ease"
                  }
                }}
              >
                Created by DotmanL
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
