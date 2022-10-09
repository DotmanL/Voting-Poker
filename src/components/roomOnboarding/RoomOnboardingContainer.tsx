import React from "react";
import { Grid } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import RoomCreate from "./RoomCreate";

function RoomOnboardingContainer() {
  return (
    <Grid>
      <NavBar appName="Dot Voting" />
      <RoomCreate />
    </Grid>
  );
}

export default RoomOnboardingContainer;
