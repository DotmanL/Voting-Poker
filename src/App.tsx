import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import { IUser } from "interfaces/User/IUser";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import Layout from "./components/layout/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer, Zoom } from "react-toastify";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";
import UserService from "api/UserService";
import "react-toastify/dist/ReactToastify.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import SidebarProvider from "components/providers/SideBarProvider";

const queryClient = new QueryClient();
export const userContext = createContext<IUser | null>(null);

function App() {
  useEffect(() => {
    const getCurrentUser = async () => {
      const getUserId = localStorage.getItem("userId");
      const userId = JSON.parse(getUserId!);
      if (!userId) {
        return;
      }
      const user = await UserService.loadUser(userId);
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  const [currentUser, setCurrentUser] = useState<IUser>();

  return (
    <QueryClientProvider client={queryClient}>
      <userContext.Provider value={currentUser!}>
        <SidebarProvider>
          <Grid>
            <DndProvider backend={HTML5Backend}>
              <ToastContainer
                style={{ marginTop: "80px" }}
                closeOnClick
                draggable={false}
                transition={Zoom}
              />
              <ScrollToTop>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePageContainer />} />
                    <Route
                      path="new-room"
                      element={<RoomOnboardingContainer />}
                    />
                    <Route
                      path="room/:roomId"
                      element={<VotingRoomContainer />}
                    />

                    <Route path="*" element={<NotFoundContainer />} />
                  </Route>
                </Routes>
              </ScrollToTop>
            </DndProvider>
          </Grid>
        </SidebarProvider>
      </userContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
