import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import bg1 from "./assets/bg1.svg";
import teams from "./assets/teams.svg";
import { Link } from "../shared/component/Link";
import GroupsIcon from "@mui/icons-material/Groups";
import SpeedIcon from "@mui/icons-material/Speed";
import InsightsIcon from "@mui/icons-material/Insights";

function LandingPage() {
  const features = [
    {
      icon: <GroupsIcon sx={{ fontSize: 32 }} />,
      title: "Real-time Collaboration",
      description:
        "Vote simultaneously with your team. See results instantly as everyone participates."
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: "Fast & Simple",
      description:
        "Create a room in seconds. No sign-up walls, just share the link and start voting."
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 32 }} />,
      title: "Jira Integration",
      description:
        "Import stories directly from Jira and sync story points back when you're done."
    }
  ];

  return (
    <Grid
      sx={{
        flexDirection: "column",
        mt: "80px",
        p: 0,
        mb: 0,
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        background: (theme) => theme.palette.secondary.main
      }}
    >
      {/* ===== HERO SECTION ===== */}
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          position: "relative",
          minHeight: { md: "calc(70vh - 80px)", xs: "auto" },
          alignItems: "center",
          px: { md: 8, xs: 2 },
          pt: { md: 0, xs: 4 },
          pb: { md: 0, xs: 6 }
        }}
      >
        {/* Decorative dot pattern - top right */}
        <Grid
          className="dot-pattern"
          sx={{
            top: { md: 60, xs: 20 },
            right: { md: 80, xs: 20 },
            color: "primary.main",
            display: { xs: "none", md: "block" }
          }}
        />
        {/* Decorative dot pattern - bottom left */}
        <Grid
          className="dot-pattern"
          sx={{
            bottom: { md: 100 },
            left: { md: 40 },
            color: "text.secondary",
            display: { xs: "none", md: "block" },
            opacity: 0.2
          }}
        />

        {/* Left — Text Content */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "flex-start", xs: "center" },
            width: { md: "50%", xs: "100%" },
            pl: { md: 6, xs: 0 },
            animation: "fadeInUp 0.7s ease-out"
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { md: "56px", xs: "32px" },
              fontWeight: 800,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Estimate smarter,
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { md: "56px", xs: "32px" },
              fontWeight: 800,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              textAlign: { xs: "center", md: "left" }
            }}
          >
            ship faster.
          </Typography>

          <Typography
            sx={{
              fontSize: { md: "18px", xs: "15px" },
              fontWeight: 400,
              color: "text.secondary",
              mt: { md: 2.5, xs: 1.5 },
              maxWidth: "480px",
              lineHeight: 1.7,
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Create planning poker rooms instantly. Collaborate with your team in
            real time to estimate tasks and align on effort, no friction, no
            hassle.
          </Typography>

          <Link to="new-room">
            <Button
              variant="contained"
              sx={[
                {
                  mt: { md: 4, xs: 3 },
                  background: (theme) => theme.palette.primary.main,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
                  px: { md: 5, xs: 3 },
                  py: { md: 1.2, xs: 0.8 },
                  fontSize: { md: "18px", xs: "16px" },
                  fontWeight: 700,
                  borderRadius: "14px",
                  letterSpacing: "0.01em",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(232, 234, 237, 0.12)"
                      : "0 4px 20px rgba(91, 147, 217, 0.25)"
                },
                {
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 8px 28px rgba(232, 234, 237, 0.18)"
                        : "0 8px 28px rgba(91, 147, 217, 0.35)"
                  }
                }
              ]}
            >
              Create a Room
            </Button>
          </Link>
        </Grid>

        {/* Right — Hero Image */}
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: { md: "50%", xs: "100%" },
            mt: { md: 0, xs: 4 },
            animation: "fadeInUp 0.9s ease-out"
          }}
        >
          <Grid
            sx={{
              position: "relative",
              width: { md: "480px", xs: "300px" },
              height: { md: "400px", xs: "260px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* Background decorative shape */}
            <Grid
              sx={{
                position: "absolute",
                width: { md: "420px", xs: "270px" },
                height: { md: "420px", xs: "270px" },
                borderRadius: "50%",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(232, 234, 237, 0.03)"
                    : "rgba(91, 147, 217, 0.06)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
            <Grid
              component="img"
              sx={{
                width: { md: "440px", xs: "280px" },
                height: "auto",
                position: "relative",
                zIndex: 1,
                animation: "float 5s ease-in-out infinite",
                filter: (theme) =>
                  theme.palette.mode === "dark" ? "brightness(0.9)" : "none"
              }}
              src={teams}
              alt="Team collaborating on planning poker"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* ===== FEATURES SECTION ===== */}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { md: 8, xs: 3 },
          py: { md: 10, xs: 6 },
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.015)"
              : "rgba(0, 0, 0, 0.015)"
        }}
      >
        <Typography
          sx={{
            fontSize: { md: "13px", xs: "11px" },
            fontWeight: 600,
            color: "primary.main",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            mb: 1
          }}
        >
          Why teams love it
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { md: "36px", xs: "24px" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            mb: { md: 6, xs: 4 },
            textAlign: "center"
          }}
        >
          Everything you need to estimate
        </Typography>

        <Grid
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: { md: 4, xs: 3 },
            maxWidth: "1000px",
            width: "100%"
          }}
        >
          {features.map((feature, index) => (
            <Grid
              key={index}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: { md: "flex-start", xs: "center" },
                textAlign: { md: "left", xs: "center" },
                p: { md: 3.5, xs: 3 },
                borderRadius: "16px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.06)"
                    : "1px solid rgba(0, 0, 0, 0.06)",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.02)"
                    : "rgba(255, 255, 255, 0.7)",
                transition: "all 0.3s ease",
                animation: `fadeInUp ${0.5 + index * 0.15}s ease-out`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.08)",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(91, 147, 217, 0.2)"
                }
              }}
            >
              <Grid
                sx={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  color: "primary.main",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(232, 234, 237, 0.06)"
                      : "rgba(91, 147, 217, 0.08)"
                }}
              >
                {feature.icon}
              </Grid>
              <Typography
                sx={{
                  fontSize: { md: "18px", xs: "16px" },
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: "-0.01em"
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { md: "14px", xs: "13px" },
                  color: "text.secondary",
                  lineHeight: 1.65
                }}
              >
                {feature.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* ===== SECONDARY CTA / IMAGE SECTION ===== */}
      <Grid
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column-reverse" },
          alignItems: "center",
          px: { md: 10, xs: 3 },
          py: { md: 8, xs: 5 },
          gap: { md: 6, xs: 3 }
        }}
      >
        <Grid
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            animation: "fadeIn 1s ease-out"
          }}
        >
          <Grid
            component="img"
            src={bg1}
            alt="Work planning illustration"
            sx={{
              width: { md: "420px", xs: "280px" },
              height: "auto",
              filter: (theme) =>
                theme.palette.mode === "dark" ? "brightness(0.85)" : "none"
            }}
          />
        </Grid>
        <Grid
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: { md: "flex-start", xs: "center" },
            textAlign: { md: "left", xs: "center" }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { md: "34px", xs: "24px" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 2
            }}
          >
            Focus on what matters, let us handle the rest
          </Typography>
          <Typography
            sx={{
              fontSize: { md: "16px", xs: "14px" },
              color: "text.secondary",
              lineHeight: 1.7,
              maxWidth: "460px",
              mb: 3
            }}
          >
            With built-in chat, drag-and-drop issue management, and automatic
            vote tallying, your team can stay aligned and keep sprints moving.
          </Typography>
          <Link to="new-room">
            <Button
              variant="outlined"
              sx={{
                borderRadius: "12px",
                px: { md: 4, xs: 3 },
                py: 1,
                fontSize: { md: "16px", xs: "14px" },
                fontWeight: 600,
                borderWidth: "2px",
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderWidth: "2px",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Create a Room
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LandingPage;
