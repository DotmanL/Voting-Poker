import React from "react";
import { Grid, Typography } from "@mui/material";
import dotvotingLogo from "./assets/dotvotingLogo.png";
import { Link } from "../shared/component/Link";

function Footer() {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        justifyContent: { md: "space-between" },
        px: { md: 8, xs: 2 },
        py: { md: 2, xs: 3 },
        width: "100%",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#001219" : "#1e6091",
        height: "250px"
      }}
    >
      <Grid
        sx={{
          ml: { md: 2 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2 },
          alignItems: { md: "center", xs: "flex-start" },
          height: { md: "100%", xs: "30%" },
          width: { md: "20%", xs: "100%" }
        }}
      >
        <Link to="/">
          <Grid
            component={"img"}
            src={dotvotingLogo}
            alt="waves"
            sx={{
              height: { md: "120px", xs: "60px" },
              width: { md: "120px", xs: "60px" }
            }}
          />
          <Typography
            variant="h6"
            color="#f9f7f3"
            sx={{
              fontSize: { md: "24px", xs: "14px" },
              "&:hover": {
                color: "white",
                opacity: 1
              }
            }}
          >
            Dot Voting
          </Typography>
        </Link>
      </Grid>
      <Grid
        sx={{
          ml: { md: 2 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          px: { md: 4, xs: 2 },
          py: { md: 4, xs: 2 },
          height: { md: "100%", xs: "35%" },
          alignItems: { md: "flex-start", xs: "flex-start" },
          width: { md: "30%", xs: "100%" }
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          <Link to="/privacy-policy">
            <Typography
              variant="h6"
              color="#f9f7f3"
              sx={{
                fontSize: { md: "24px", xs: "14px" },
                "&:hover": {
                  color: "white",
                  opacity: 1
                }
              }}
            >
              Privacy Policy
            </Typography>
          </Link>
        </Grid>
      </Grid>

      <Grid
        sx={{
          ml: { md: 2 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          px: { md: 4, xs: 2 },
          py: { md: 4, xs: 2 },
          height: { md: "100%", xs: "35%" },
          alignItems: { md: "flex-start", xs: "flex-start" },
          width: { md: "30%", xs: "100%" }
        }}
      ></Grid>
    </Grid>
  );
}

export default Footer;
