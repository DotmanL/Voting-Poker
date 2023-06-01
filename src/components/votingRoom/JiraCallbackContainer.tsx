import React, { useCallback, useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "App";
import JiraService from "api/JiraService";

function JiraCallbackContainer() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const state = params.get("state");
  const user = useContext(userContext);

  const startSliceIndex = state?.indexOf("_");
  const roomId = state?.slice(startSliceIndex! + 1, state.length);

  const getAccessToken = useCallback(async () => {
    if (code && user) {
      const response = await JiraService.jiraAuthentication(user?._id!, code);
      if (response) {
        navigate(`/room/${roomId}`);
        return true;
      }
    }
  }, [code, user, navigate, roomId]);

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
