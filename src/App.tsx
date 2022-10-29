import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import { IUser } from "interfaces/User/IUser";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import { io } from "socket.io-client";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer, Zoom } from "react-toastify";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();
export const userContext = createContext<IUser | null>(null);

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://votingpokerapi.herokuapp.com/";
      break;
    case "development":
    default:
      url = "http://localhost:4000";
  }

  return url;
};

const socket = io(getBaseUrl());

// setAlll USers here and pass as global state from socket emit

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
          <ToastContainer
            style={{ marginTop: "80px" }}
            closeOnClick
            draggable
            transition={Zoom}
          />
          <ScrollToTop>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePageContainer />} />
                <Route path="new-room" element={<RoomOnboardingContainer />} />
                <Route
                  path="room/:roomId"
                  element={<VotingRoomContainer socket={socket} />}
                />

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
