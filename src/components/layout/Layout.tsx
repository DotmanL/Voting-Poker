import { Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Grid>
      <Outlet />
    </Grid>
  );
}
export default Layout;
