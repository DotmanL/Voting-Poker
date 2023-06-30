import React from "react";
import { Grid, Typography } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import Footer from "./Footer";

function PrivacyPolicy() {
  return (
    <Grid>
      <NavBar appName="Virtual Planning Poker" isBorderBottom />
      <Grid
        sx={{
          mt: { md: 8, xs: 8 },
          px: { md: 40, xs: 5 },
          pt: 2,
          pb: 4,
          display: "flex",
          color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#001219" : "#edf2f4",
          width: "100%",
          textAlign: { md: "justify", xs: "justify" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <Typography variant="h4" sx={{ mt: 3 }}>
          Privacy Policy
        </Typography>
        <p>
          <Typography variant="h6" fontFamily="Montserrat Alternates">
            Thank you for visiting our website and using our online planning
            poker services. This Privacy Policy outlines how we collect, use,
            disclose, and protect your personal information when you access our
            website and use our services. By using our website, you agree to the
            terms of this Privacy Policy.
          </Typography>
        </p>
        <Typography variant="h6" fontFamily="Montserrat Alternates">
          1) Information We Collect:
          <br />
          We may collect the following types of personal information when you
          use our website and services: Personal information provided by you,
          such as your name, email address, and any additional information you
          voluntarily provide. Information collected automatically, including
          your IP address, browser type, device information, and usage data
          through cookies and similar tracking technologies. Use of Personal
          Information: We may use your personal information for the following
          purposes: To provide and maintain our online planning poker services.
          To communicate with you, respond to your inquiries, and send you
          relevant information. To personalize your experience and improve our
          website and services.
          <br />
          <br />
          2) Use of Personal Information:
          <br />
          We may use your personal information for the following purposes:
          <br />
          • To provide and maintain our online planning poker services.
          <br />
          • To communicate with you, respond to your inquiries, and send you
          relevant information.
          <br />
          • To personalize your experience and improve our website and service
          <br />• To comply with legal obligations and resolve any disputes.
          <br />
          <br />
          3) Data Security:
          <br />
          We take reasonable measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction. However,
          no method of transmission over the internet or electronic storage is
          completely secure. Therefore, we cannot guarantee absolute security.
          <br />
          <br />
          4) Third-Party Websites:
          <br />
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices or the content of such websites.
          We encourage you to review the privacy policies of these third-party
          websites before providing any personal information.
        </Typography>
      </Grid>
      <Footer />
    </Grid>
  );
}

export default PrivacyPolicy;
