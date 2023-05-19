import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Checkbox, Grid, Link } from "@mui/material";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import { userContext } from "App";
import JiraService from "api/JiraService";
import LaunchIcon from "@mui/icons-material/Launch";
import { IIssue } from "interfaces/Issues";
import { useParams } from "react-router-dom";
import IssueService from "api/IssueService";
import { SidebarContext } from "utility/providers/SideBarProvider";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";

type Props = {
  isJiraManagementModalOpen: boolean;
  issuesLength: number;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
};

type RoomRouteParams = {
  roomId: string;
};

function JiraManagementModal(props: Props) {
  const {
    isJiraManagementModalOpen,
    setIsJiraManagementModalOpen,
    refetchIssues,
    issuesLength
  } = props;
  const [siteDetails, setSiteDetails] = useState<any>();
  const [jiraIssues, setJiraIssues] = useState<any[]>([]);
  const [issueArray, setIssueArray] = useState<IIssue[]>([]);
  const [checkedIssues, setCheckedIssues] = useState<any[]>([]);
  const user = useContext(userContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const { roomId } = useParams<RoomRouteParams>();

  const getSite = useCallback(async () => {
    const response = await JiraService.jiraAccessibleResources(user?._id!);

    if (user?.jiraAccessToken && !response) {
      await JiraService.jiraAuthenticationAutoRefresh(user?._id!);
    }

    if (response) {
      setSiteDetails(response?.data.data[0]);
    }

    return;
  }, [user?._id, user?.jiraAccessToken]);

  const handleBasicSearch = useCallback(async () => {
    const jqlQuery = "order by created";
    const fields = ["summary", "status", "assignee", "description", "priority"];

    const response = await JiraService.jiraBasicSearch(
      user?._id!,
      jqlQuery,
      fields
    );

    if (user?.jiraAccessToken && !response) {
      await JiraService.jiraAuthenticationAutoRefresh(user?._id!);
    }

    if (response) {
      setJiraIssues(response?.data.issues);
    }

    // console.log(response);
  }, [user?.jiraAccessToken, user?._id]);

  useEffect(() => {
    getSite();
    handleBasicSearch(); // use react query
  }, [getSite, handleBasicSearch]);

  async function handleAddIssue(issue: any) {
    let currentOrder = issuesLength + 1;
    if (issueArray.length > 0) {
      currentOrder = issueArray[issueArray?.length - 1]?.order! + 1;
    }

    const localIssue: IIssue = {
      name: issue.fields.summary,
      link: `${siteDetails.url}/browse/${issue.key}`,
      summary: issue.fields.description.content[0].content[0].text,
      order: currentOrder,
      roomId: roomId!
    };

    setIssueArray([...issueArray, localIssue]);
    return true;
  }

  async function importIssues() {
    const issuesCreated = await IssueService.createIssues(issueArray);
    //TODO: FIX ORDER
    if (issuesCreated) {
      // setIsJiraManagementModalOpen(false);
      refetchIssues();
    }
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      refetchIssues();
    }
  }

  async function handleToggleIssue(issueToUpdate: any) {
    if (checkedIssues.includes(issueToUpdate)) {
      const updatedIssues = issueArray.filter(
        (issue) =>
          issue.link !== `${siteDetails.url}/browse/${issueToUpdate.key}`
      );
      setCheckedIssues(updatedIssues);
      setIssueArray(updatedIssues);
      return;
    }
    const isSuccessful = await handleAddIssue(issueToUpdate);
    if (isSuccessful) {
      setCheckedIssues([...checkedIssues, issueToUpdate]);
    }
  }

  return (
    <Grid>
      <CustomModal
        isOpen={isJiraManagementModalOpen}
        customLeftPosition="40%"
        modalWidth="45vw"
        size="md"
      >
        <Grid
          sx={{
            diplay: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            borderRadius: "10px",
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
          <Grid sx={{ fontSize: { md: "24px", xs: "16px" }, mt: 1 }}>
            Issue Management for {!!siteDetails ? siteDetails.url : ""}
          </Grid>
          <Grid
            onClick={handleBasicSearch}
            sx={{
              mt: 2,
              cursor: "pointer",
              p: 2,
              height: "30%",
              borderRadius: "10px",
              border: "2px solid #FFFFFF"
            }}
          >
            Basic Search with Controls
          </Grid>
          <Grid
            sx={{
              mt: 4,
              diplay: "flex",
              flexDirection: "column",
              height: "50%",
              borderRadius: "10px",
              border: "2px solid #67A3EE",
              overflowY: "auto"
            }}
          >
            <Grid
              sx={{
                px: 5,
                py: 0.5,
                borderRadius: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                background: "green",
                cursor: "pointer",
                justifyContent: "space-between",
                position: "sticky",
                zIndex: 10000,
                top: -2
              }}
            >
              <Grid>Search Results</Grid>

              <Button
                variant="outlined"
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: "8px",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
                disabled={issueArray.length === 0}
                onClick={importIssues}
              >
                Import Issues
              </Button>
            </Grid>
            <Grid
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                flexWrap: "wrap"
              }}
            >
              {jiraIssues?.map((jiraIssue, i) => (
                <Grid
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    px: 2,
                    py: 1,
                    m: 0,
                    width: { md: "300px", xs: "200px" },
                    height: "auto",
                    borderRadius: "12px",
                    my: "15px",
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#000814" : "#fdf0d5",
                    "&:hover": {
                      border: "1px solid #FFFFFF"
                    }
                  }}
                >
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Grid>{jiraIssue.key}</Grid>
                    <Checkbox
                      checked={checkedIssues.includes(jiraIssue)}
                      onChange={() => {
                        handleToggleIssue(jiraIssue);
                      }}
                    />
                  </Grid>
                  <Grid>{jiraIssue.fields.summary}</Grid>

                  <Link
                    href={`${siteDetails.url}/browse/${jiraIssue.key}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ wordBreak: "break-word" }}
                  >
                    <LaunchIcon
                      sx={{
                        mt: 1,
                        mr: "10px",
                        "&:hover": {
                          color: "green",
                          opacity: 0.8
                        }
                      }}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraManagementModal;
