import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import bg1 from "./assets/bg1.svg";
import teams from "./assets/teams.svg";
import waveBottom from "./assets/wavesBottom.svg";
import { Link } from "../shared/component/Link";

function LandingPage() {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        position: "relative",
        boxShadow: "inset 0 0 0 2000px rgba(255, 255, 255, 0.5)",
        mt: "80px",
        p: 0,
        height: "100vh",
        overflowX: "hidden"
      }}
    >
      <Grid sx={{ display: { md: "flex", xs: "none" } }}>
        <img
          src={waveBottom}
          alt="waves"
          style={{
            position: "absolute",
            opacity: 0.7,
            bottom: 0,
            height: "45vh",
            width: "100%"
          }}
        />
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          position: "relative",
          height: "auto"
        }}
      >
        <Grid
          sx={{
            width: { md: "45%", xs: "100%" },
            p: { md: 3, xs: 0.5 }
          }}
        >
          <Grid sx={{ mt: { md: 15, xs: 2 }, ml: "15%" }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { md: "100px", xs: "30px" },
                fontWeight: "bold",
                fontFamily: "Aleo"
              }}
            >
              Create your
              <Typography
                sx={{
                  fontSize: { md: "90px", xs: "30px" },
                  fontWeight: "bold",
                  fontFamily: "Aleo"
                }}
              >
                polls here
              </Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: { md: "30px", xs: "15px" },
                fontWeight: 500,
                fontStyle: "italic",
                fontFamily: "Montserrat Alternates"
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
                    ml: { md: 15, xs: 2 },
                    background: "#67A3EE",
                    color: "white",
                    px: { md: 4, xs: 2 },
                    py: { md: 1, xs: 0.5 },
                    fontSize: "20px"
                  },
                  {
                    "&:hover": {
                      color: "white",
                      backgroundColor: "green"
                    }
                  }
                ]}
              >
                Start New Room
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Grid
          sx={{
            disply: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: "center",
            width: { md: "55%", xs: "100%" }
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              justifyContent: "center",
              alignItems: "center",
              mt: { md: 5, xs: 0 }
            }}
          >
            <Box
              component="img"
              sx={{
                width: { md: "550px", xs: "400px" },
                mt: { md: -2, xs: 1 }
              }}
              src={teams}
              alt="teams card"
            />

            <Box
              component="img"
              sx={{
                width: { md: "350px", xs: "400px" },
                mt: { md: 10, xs: -3 },
                ml: { md: 10, xs: 0 }
              }}
              src={bg1}
              alt="work planning"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
