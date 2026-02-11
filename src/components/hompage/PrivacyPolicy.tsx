import React from "react";
import { Grid, Typography } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import Footer from "./Footer";

function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We may collect personal information provided by you, such as your name, email address, and any additional information you voluntarily provide. We also collect information automatically, including your IP address, browser type, device information, and usage data through cookies and similar tracking technologies."
    },
    {
      title: "2. Use of Personal Information",
      items: [
        "To provide and maintain our online planning poker services.",
        "To communicate with you, respond to your inquiries, and send you relevant information.",
        "To personalize your experience and improve our website and services.",
        "To comply with legal obligations and resolve any disputes."
      ]
    },
    {
      title: "3. Data Security",
      content:
        "We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security."
    },
    {
      title: "4. Third-Party Websites",
      content:
        "Our website may contain links to third-party websites. We are not responsible for the privacy practices or the content of such websites. We encourage you to review the privacy policies of these third-party websites before providing any personal information."
    }
  ];

  return (
    <Grid>
      <NavBar appName="Virtual Planning Poker" isBorderBottom />
      <Grid
        sx={{
          mt: { md: 8, xs: 8 },
          px: { md: 0, xs: 3 },
          py: { md: 8, xs: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
          background: (theme) => theme.palette.secondary.main
        }}
      >
        <Grid
          sx={{
            maxWidth: "720px",
            width: "100%",
            animation: "fadeInUp 0.6s ease-out"
          }}
        >
          {/* Header */}
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "primary.main",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 1
            }}
          >
            Legal
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { md: "40px", xs: "28px" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              mb: 2
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            sx={{
              fontSize: { md: "16px", xs: "14px" },
              color: "text.secondary",
              lineHeight: 1.7,
              mb: { md: 5, xs: 3 }
            }}
          >
            Thank you for visiting our website and using our online planning
            poker services. This Privacy Policy outlines how we collect, use,
            disclose, and protect your personal information when you access our
            website and use our services.
          </Typography>

          {/* Sections */}
          {sections.map((section, index) => (
            <Grid
              key={index}
              sx={{
                mb: { md: 4, xs: 3 },
                p: { md: 3.5, xs: 2.5 },
                borderRadius: "14px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.06)"
                    : "1px solid rgba(0, 0, 0, 0.06)",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.02)"
                    : "rgba(255, 255, 255, 0.6)",
                transition: "border-color 0.2s ease",
                "&:hover": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(91, 147, 217, 0.2)"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "18px", xs: "16px" },
                  fontWeight: 700,
                  mb: 1.5,
                  letterSpacing: "-0.01em"
                }}
              >
                {section.title}
              </Typography>
              {section.content && (
                <Typography
                  sx={{
                    fontSize: { md: "15px", xs: "13px" },
                    color: "text.secondary",
                    lineHeight: 1.75
                  }}
                >
                  {section.content}
                </Typography>
              )}
              {section.items && (
                <Grid
                  component="ul"
                  sx={{ pl: 2.5, m: 0, listStyleType: "none" }}
                >
                  {section.items.map((item, i) => (
                    <Grid
                      component="li"
                      key={i}
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        "&::before": {
                          content: '""',
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "primary.main",
                          mt: "8px",
                          flexShrink: 0
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { md: "15px", xs: "13px" },
                          color: "text.secondary",
                          lineHeight: 1.75
                        }}
                      >
                        {item}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
}

export default PrivacyPolicy;
