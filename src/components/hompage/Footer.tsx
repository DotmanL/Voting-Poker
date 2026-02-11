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
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#0d1117" : "#f1f3f5",
        pt: { md: 5, xs: 3 },
        pb: { md: 4, xs: 3 }
      }}
    >
      {/* Top divider */}
      <Grid
        sx={{
          height: "1px",
          width: { md: "80%", xs: "90%" },
          mx: "auto",
          mb: { md: 4, xs: 3 },
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(0, 0, 0, 0.06)"
        }}
      />

      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          justifyContent: "space-between",
          alignItems: { md: "flex-start", xs: "center" },
          width: { md: "80%", xs: "90%" },
          mx: "auto",
          gap: { md: 0, xs: 3 }
        }}
      >
        {/* Left — Brand */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "flex-start", xs: "center" },
            gap: 1
          }}
        >
          <Link to="/">
            <Grid sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {appTheme.palette.mode === "dark" ? (
                <Grid
                  component="img"
                  src={darkvppLogo}
                  alt="Logo"
                  sx={{ height: "44px", width: "44px" }}
                />
              ) : (
                <Grid
                  component="img"
                  src={lightvpplogo}
                  alt="Logo"
                  sx={{ height: "44px", width: "44px" }}
                />
              )}
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em"
                }}
              >
                Virtual Planning Poker
              </Typography>
            </Grid>
          </Link>
          <Typography
            sx={{
              fontSize: "13px",
              color: "text.secondary",
              mt: 0.5,
              textAlign: { md: "left", xs: "center" }
            }}
          >
            Helping teams estimate better, together.
          </Typography>
        </Grid>

        {/* Right — Links */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "flex-end", xs: "center" },
            gap: 1.2
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2.5
            }}
          >
            <Link to="/privacy-policy">
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.secondary",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.main" }
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link to="https://oladotunlawal.com/" target="_blank">
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.secondary",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.main" }
                }}
              >
                Contact
              </Typography>
            </Link>
            <Link to="https://github.com/DotmanL/" target="_blank">
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "text.secondary",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "primary.main" }
                }}
              >
                GitHub
              </Typography>
            </Link>
          </Grid>
          <Typography
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              opacity: 0.7,
              mt: 0.5
            }}
          >
            © {new Date().getFullYear()} Created by DotmanL
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
