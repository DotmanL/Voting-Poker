import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Grid } from "@mui/material";
import ScrollToTop from "components/shared/hooks/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer, Zoom } from "react-toastify";
import HomePageContainer from "components/hompage/HomePageContainer";
import NotFoundContainer from "components/shared/NotFoundContainer";
import VotingRoomContainer from "components/votingRoom/room/VotingRoomContainer";
import RoomOnboardingContainer from "components/roomOnboarding/RoomOnboardingContainer";
import { ColorModeContext } from "utility/providers/ColorContext";
import "react-toastify/dist/ReactToastify.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import SidebarProvider from "utility/providers/SideBarProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getDesignTokens } from "theme";
import IssuesProvider from "utility/providers/IssuesProvider";
import JiraCallbackContainer from "components/votingRoom/sideBar/JiraCallbackContainer";
import PrivacyPolicy from "components/hompage/PrivacyPolicy";
import UserProvider from "utility/providers/UserProvider";

const queryClient = new QueryClient();

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
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
                          path="bindystreet"
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
          </UserProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
