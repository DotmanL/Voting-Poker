import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "./component/Link";

function NotFoundContainer() {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: (theme) => theme.palette.secondary.main,
        px: 3,
        textAlign: "center"
      }}
    >
      <Typography
        sx={{
          fontSize: { md: "120px", xs: "80px" },
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "primary.main",
          opacity: 0.15,
          mb: -3,
          userSelect: "none"
        }}
      >
        404
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontSize: { md: "32px", xs: "22px" },
          fontWeight: 700,
          letterSpacing: "-0.02em",
          mb: 1.5,
          animation: "fadeInUp 0.6s ease-out"
        }}
      >
        Page not found
      </Typography>
      <Typography
        sx={{
          fontSize: { md: "16px", xs: "14px" },
          color: "text.secondary",
          maxWidth: "400px",
          lineHeight: 1.6,
          mb: 4,
          animation: "fadeInUp 0.7s ease-out"
        }}
      >
        The page you're looking for doesn't exist or may have been moved.
      </Typography>
      <Link to="/">
        <Button
          variant="contained"
          sx={[
            {
              px: 4,
              py: 1,
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "12px",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
              animation: "fadeInUp 0.8s ease-out"
            },
            {
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(91, 147, 217, 0.3)"
              }
            }
          ]}
        >
          Go Home
        </Button>
      </Link>
    </Grid>
  );
}

export default NotFoundContainer;
