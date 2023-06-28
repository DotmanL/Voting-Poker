import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Grid } from "@mui/material";
import { IUser } from "interfaces/User/IUser";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer, Zoom } from "react-toastify";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/room/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";
import { ColorModeContext } from "utility/providers/ColorContext";
import UserService from "api/UserService";
import "react-toastify/dist/ReactToastify.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import SidebarProvider from "utility/providers/SideBarProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "theme";
import IssuesProvider from "utility/providers/IssuesProvider";
import JiraCallbackContainer from "components/votingRoom/sideBar/JiraCallbackContainer";
import PrivacyPolicy from "components/hompage/PrivacyPolicy";

const queryClient = new QueryClient();
export const userContext = createContext<IUser | null>(null);

function App() {
  const [currentUser, setCurrentUser] = useState<IUser>();
  const getThemeMode = localStorage.getItem("mode");
  const themeMode = getThemeMode === "light" ? "light" : "dark";
  const [mode, setMode] = React.useState<"light" | "dark">(themeMode);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        localStorage.setItem("mode", mode === "light" ? "dark" : "light");
      }
    }),
    [mode]
  );

  const theme = React.useMemo(
    () => createTheme(getDesignTokens(mode), {}),
    [mode]
  );

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

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <userContext.Provider value={currentUser!}>
            <SidebarProvider>
              <IssuesProvider>
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
                        <Route index element={<HomePageContainer />} />
                        <Route
                          path="new-room"
                          element={<RoomOnboardingContainer />}
                        />
                        <Route
                          path="bindyStreet"
                          element={
                            <RoomOnboardingContainer isRoomsTableVisible />
                          }
                        />
                        <Route
                          path="room/:roomId"
                          element={<VotingRoomContainer />}
                        />
                        <Route
                          path="/room/jiraCallback"
                          element={<JiraCallbackContainer />}
                        />
                        <Route
                          path="privacy-policy"
                          element={<PrivacyPolicy />}
                        />

                        <Route path="*" element={<NotFoundContainer />} />
                      </Routes>
                    </ScrollToTop>
                  </DndProvider>
                </Grid>
              </IssuesProvider>
            </SidebarProvider>
          </userContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
