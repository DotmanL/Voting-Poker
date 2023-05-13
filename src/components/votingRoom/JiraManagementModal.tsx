import React, { useCallback, useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import { userContext } from "App";
import JiraService from "api/JiraService";

type Props = {
  isJiraManagementModalOpen: boolean;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function JiraManagementModal(props: Props) {
  const { isJiraManagementModalOpen, setIsJiraManagementModalOpen } = props;
  const [siteDetails, setSiteDetails] = useState<any>();
  const [jiraIssues, setJiraIssues] = useState<any[]>([]);
  const user = useContext(userContext);

  const getSite = useCallback(async () => {
    const response = await JiraService.jiraAccessibleResources(user?._id!);
    setSiteDetails(response?.data.data[0]);
    return;
  }, [user?._id]);

  useEffect(() => {
    getSite();
  }, [getSite]);

  async function handleBasicSearch() {
    const jqlQuery = "order by created";
    const fields = ["summary", "status", "assignee", "description", "priority"];

    const response = await JiraService.jiraBasicSearch(
      user?._id!,
      jqlQuery,
      fields
    );

    setJiraIssues(response?.data.issues);
    // console.log(response);
  }

  return (
    <Grid>
      <CustomModal
        isOpen={isJiraManagementModalOpen}
        modalWidth="50vw"
        size="md"
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
          <Grid sx={{ mt: 2 }}>
            Issue Management for {!!siteDetails ? siteDetails.url : ""}
          </Grid>
          <Grid
            onClick={handleBasicSearch}
            sx={{ mt: 2, cursor: "pointer", background: "green", p: 2 }}
          >
            Basic Search
          </Grid>
          <Grid sx={{ mt: 2 }}>
            {jiraIssues?.map((jiraIssue, i) => (
              <Grid key={i}>
                <Grid>{jiraIssue.key}</Grid>
                <Grid>{jiraIssue.fields.summary}</Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraManagementModal;
