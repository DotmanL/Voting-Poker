import { Grid } from "@mui/material";
import LandingPage from "./LandingPage";
import { NavBar } from "components/shared/component/NavBar";
import Footer from "./Footer";

function HomePageContainer() {
  return (
    <Grid>
      <NavBar appName="Virtual Planning Poker" isBorderBottom />
      <LandingPage />
      <Footer />
    </Grid>
  );
}

export default HomePageContainer;
