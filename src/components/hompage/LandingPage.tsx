import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import bg1 from "./assets/bg1.svg";
import teams from "./assets/teams.svg";
import { Link } from "../shared/component/Link";

function LandingPage() {
  return (
    <Grid
      sx={{
        flexDirection: { md: "row", xs: "column" },
        mt: "80px",
        p: 0,
        mb: 0,
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: (theme) => theme.palette.secondary.main
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          position: "relative",
          height: "100%"
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "center", xs: "center" },
            width: { md: "50%", xs: "100%" },
            pl: { md: 2, xs: 2 }
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { md: "flex-start", xs: "center" }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { md: "64px", xs: "28px" },
                mt: { md: 20, xs: 3 },
                fontWeight: "bold",
                fontFamily: "Roboto"
              }}
            >
              Create your planning
            </Typography>

            <Typography
              sx={{
                display: { md: "flex" },
                fontSize: { md: "64px", xs: "28px" },
                fontWeight: "bold",
                fontFamily: "Roboto"
              }}
            >
              poker rooms here
            </Typography>

            <Typography
              sx={{
                fontSize: { md: "28px", xs: "15px" },
                fontWeight: 400,
                fontStyle: "italic",
                mt: { md: 1, xs: 0.5 }
              }}
            >
              Help your team make decisions faster
            </Typography>

            <Link to="new-room">
              <Button
                variant="contained"
                sx={[
                  {
                    mt: { md: 4, xs: 2 },
                    background: (theme) => theme.palette.primary.main,
                    color: "secondary.main",
                    px: { md: 6, xs: 2 },
                    py: { md: 0.7, xs: 0.5 },
                    fontSize: { md: "24px", xs: "18px" }
                  },
                  {
                    "&:hover": {
                      color: "white",
                      opacity: "0.6"
                    }
                  }
                ]}
              >
                Create Room
              </Button>
            </Link>
          </Grid>
        </Grid>

        <Grid
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: "flex-start",
            alignItems: { md: "flex-start", xs: "center" },
            width: { md: "50%", xs: "100%" },
            mt: { md: -5, xs: 3 }
          }}
        >
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { md: "column", xs: "column" },
              justifyContent: { md: "flex-start" }
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                height: "50vh",
                padding: 0,
                width: "100%"
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { md: "100%", xs: "auto" },
                  width: { md: "50%", xs: "100%" }
                }}
              >
                {/* 1st Quarter */}
                <Grid
                  component="img"
                  sx={{
                    width: { md: "600px", xs: "350px" },
                    height: { xs: "95%" }
                  }}
                  src={teams}
                  alt="teams card"
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { md: "100%", xs: "auto" },
                  width: { md: "50%", xs: "100%" }
                }}
              >
                {/* 2nd Quarter */}
                <Grid
                  component="img"
                  sx={{
                    display: { md: "none", xs: "flex" },
                    width: { md: "500px", xs: "350px" },
                    height: { xs: "85%" }
                  }}
                  src={bg1}
                  alt="work planning"
                />
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: { md: "row", xs: "column" },
                height: "50vh",
                padding: 0,
                width: "100%"
              }}
            >
              <Grid
                sx={{
                  display: { md: "flex", xs: "none" },
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { md: "100%", xs: "auto" },
                  width: { md: "50%", xs: "100%" }
                }}
              >
                {/* 3rd Quarter */}
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { md: "100%", xs: "auto" },
                  width: { md: "50%", xs: "100%" }
                }}
              >
                {/* 4th Quarter */}
                <Grid
                  component="img"
                  sx={{
                    display: { md: "flex", xs: "none" },
                    width: { md: "550px" },
                    mr: { md: 4 }
                  }}
                  src={bg1}
                  alt="work planning"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
