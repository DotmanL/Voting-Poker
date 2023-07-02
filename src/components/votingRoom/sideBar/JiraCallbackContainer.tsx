import React, { useCallback, useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "utility/providers/UserProvider";
import JiraService from "api/JiraService";

function JiraCallbackContainer() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const state = params.get("state");
  const { currentUser } = useContext(UserContext);

  const startSliceIndex = state?.indexOf("_");
  const roomId = state?.slice(startSliceIndex! + 1, state.length);

  const getAccessToken = useCallback(async () => {
    if (code && currentUser) {
      const response = await JiraService.jiraAuthentication(
        currentUser?._id!,
        code
      );
      if (response) {
        navigate(`/room/${roomId}?jiraAuthenticate=true`);
        return true;
      }
    }
  }, [code, currentUser, navigate, roomId]);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return (
    <Grid>
      <Grid>Authenticating ....</Grid>
    </Grid>
  );
}

export default JiraCallbackContainer;
