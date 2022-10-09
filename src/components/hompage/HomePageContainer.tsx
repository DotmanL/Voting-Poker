import { Grid } from "@mui/material";
import LandingPage from "./LandingPage";
import { NavBar } from "components/shared/component/NavBar";

function HomePageContainer() {
  return (
    <Grid>
      <NavBar appName="Dot Voting" />
      <LandingPage />
    </Grid>
  );
}

export default HomePageContainer;
