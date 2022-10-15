import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import { IUser } from "interfaces/User/IUser";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";

const queryClient = new QueryClient();
export const userContext = createContext<IUser | null>(null);

function App() {
  useEffect(() => {
    const getCurrentUser = localStorage.getItem("user");
    const user = JSON.parse(getCurrentUser!);
    setCurrentUser(user);
  }, []);

  const [currentUser, setCurrentUser] = useState<IUser>();

  return (
    <QueryClientProvider client={queryClient}>
      <userContext.Provider value={currentUser!}>
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
      </userContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
