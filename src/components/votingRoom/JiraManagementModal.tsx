import React, { useCallback, useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";

import { userContext } from "App";
import axios from "axios";

type Props = {
  isJiraManagementModalOpen: boolean;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function JiraManagementModal(props: Props) {
  const { isJiraManagementModalOpen, setIsJiraManagementModalOpen } = props;
  const [siteDetails, setSiteDetails] = useState<any>();
  const user = useContext(userContext);

  //TODO: Move to API
  const getSite = useCallback(async () => {
    const response = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.jiraAccessToken}`
        }
      }
    );
    setSiteDetails(response.data[0]);
    return;
  }, [user?.jiraAccessToken]);

  useEffect(() => {
    getSite();
  }, [getSite]);

  return (
    <Grid>
      <CustomModal
        isOpen={isJiraManagementModalOpen}
        modalWidth="40vw"
        size="sm"
      >
        <Grid
          sx={{
            diplay: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 2
          }}
        >
          <Grid
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
              "&:hover": {
                color: "red"
              }
            }}
            onClick={() => {
              setIsJiraManagementModalOpen(!isJiraManagementModalOpen);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>
          <Grid>Get Site Details</Grid>
          <Grid>{!!siteDetails ? siteDetails.url : ""}</Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraManagementModal;
