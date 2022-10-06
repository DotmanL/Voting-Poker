import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import Layout from "./components/layout/Layout";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";

function App() {
  return (
    <Grid>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePageContainer />} />
            <Route path="new-room" element={<RoomOnboardingContainer />} />
            <Route path="room/:roomId" element={<VotingRoomContainer />} />

            <Route path="*" element={<NotFoundContainer />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </Grid>
  );
}

export default App;
