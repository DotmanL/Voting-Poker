import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import bg1 from "./assets/bg1.svg";
import teams from "./assets/teams.svg";
import waveBottom from "./assets/wavesBottom.svg";
import { Link } from "../shared/component/Link";

function LandingPage() {
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "inset 0 0 0 2000px rgba(255, 255, 255, 0.5)",
        mt: "80px",
        p: 0,
        height: "100vh",
        overflowX: "hidden"
      }}
    >
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
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
          height: "auto"
        }}
      >
        <Grid
          sx={{
            width: "45%",
            p: 3
          }}
        >
          <Grid sx={{ mt: 15, ml: "15%" }}>
            <Typography
              variant="h2"
              sx={{ fontSize: "100px", fontWeight: "bold", fontFamily: "Aleo" }}
            >
              Create your
              <Typography
                sx={{
                  fontSize: "90px",
                  fontWeight: "bold",
                  fontFamily: "Aleo"
                }}
              >
                polls here
              </Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: "30px",
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
                    ml: 15,
                    background: "#67A3EE",
                    color: "white",
                    px: 4,
                    py: 1,
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
            flexDirection: "row",
            justifyContent: "center",
            width: "55%"
          }}
        >
          <Grid sx={{ display: "flex", flexDirection: "row", mt: 5 }}>
            <img
              style={{ width: "550px", height: "550px", marginTop: "-40px" }}
              src={teams}
              alt="teams card"
            />
            <img
              style={{
                width: "350px",
                height: "450px",
                marginTop: "150px",
                marginLeft: "-30px"
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
