import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import bg1 from "./assets/bg1.svg";
import teams from "./assets/teams.svg";
// import waveBottom from "./assets/wavesBottom.svg";
import { Link } from "../shared/component/Link";

function LandingPage() {
  return (
    <Grid
      sx={{
        flexDirection: { md: "row", xs: "column" },
        mt: "80px",
        p: 0,
        mb: 0,
        height: "85vh",
        overflow: "hidden",
        position: "relative",
        background: (theme) => theme.palette.secondary.main
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          zIndex: 100,
          position: "relative",
          height: "100%"
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "center", xs: "center" },
            width: { md: "40%", xs: "100%" }
          }}
        >
          <Grid sx={{ mt: { md: 15, xs: 2 } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { md: "72px", xs: "30px" },
                fontWeight: "bold",
                fontFamily: "Roboto"
              }}
            >
              Create your
              <Typography
                sx={{
                  fontSize: { md: "64px", xs: "30px" },
                  fontWeight: "bold",
                  fontFamily: "Roboto"
                }}
              >
                polls here
              </Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: { md: "28px", xs: "15px" },
                fontWeight: 400,
                fontStyle: "italic"
              }}
            >
              Help your team make decisions faster
            </Typography>
            <Link to="new-room">
              <Button
                variant="contained"
                sx={[
                  {
                    mt: 4,
                    ml: { md: 5, xs: 0 },
                    background: (theme) => theme.palette.primary.main,
                    color: "secondary.main",
                    px: { md: 4, xs: 2 },
                    py: { md: 0.7, xs: 0.5 },
                    fontSize: "20px"
                  },
                  {
                    "&:hover": {
                      color: "white",
                      opacity: "0.6"
                    }
                  }
                ]}
              >
                Start/Join Room
              </Button>
            </Link>
          </Grid>
        </Grid>

        <Grid
          sx={{
            display: "flex",
            zIndex: 100,
            flexDirection: { md: "column", xs: "column" },
            justifyContent: "flex-start",
            alignItems: { md: "flex-start", xs: "center" },
            width: { md: "60%", xs: "100%" },
            mt: { md: -7, xs: 3 }
          }}
        >
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              alignItems: { xs: "center" },
              justifyContent: { md: "flex-start" }
            }}
          >
            <Grid
              component="img"
              sx={{
                width: { md: "70%", xs: "100%" },
                height: { md: "90%", xs: "90%" }
              }}
              src={teams}
              alt="teams card"
            />
          </Grid>
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              backgorund: "red",
              flexDirection: { md: "row", xs: "column" },
              justifyContent: "flex-end",
              alignItems: { md: "flex-start", xs: "center" },
              mt: { md: -15, xs: -10 },
              ml: { md: 10, xs: 0 }
            }}
          >
            <Grid
              component="img"
              sx={{
                width: { md: "70%", xs: "90%" },
                height: { md: "70%", xs: "70%" },
                mb: { md: "10px", xs: "5px" }
              }}
              src={bg1}
              alt="work planning"
            />
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid sx={{ display: { md: "flex", xs: "none" } }}>
        <img
          src={waveBottom}
          alt="waves"
          style={{
            position: "absolute",
            opacity: 0.9,
            bottom: 0,
            left: 0,
            right: 0,
            height: "50vh",
            width: "100%"
          }}
        />
      </Grid> */}
    </Grid>
  );
}

export default LandingPage;
