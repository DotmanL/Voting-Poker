import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  Link,
  Typography,
  Switch
} from "@mui/material";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "utility/providers/UserProvider";
import JiraService from "api/JiraService";
import LaunchIcon from "@mui/icons-material/Launch";
import { IIssue } from "interfaces/Issues";
import { useParams } from "react-router-dom";
import IssueService from "api/IssueService";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SidebarContext } from "utility/providers/SideBarProvider";
import { useQuery } from "react-query";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";
import Spinner from "components/shared/component/Spinner";
import UserService from "api/UserService";
import { IUser } from "interfaces/User/IUser";

type Props = {
  socket: any;
  isJiraManagementModalOpen: boolean;
  isFirstLaunch?: boolean;
  issuesLength: number;
  isInvalidStoryPointsField: boolean;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
  setIsJiraTokenValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFirstLaunchJiraModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchCurrentUser: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IUser | undefined, unknown>>;
  setIsJiraErrorManagementModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setIsInvalidStoryPointsField: React.Dispatch<React.SetStateAction<boolean>>;
};

enum QueryType {
  Project = 1,
  IssueType = 2,
  Filters = 3
}

type RoomRouteParams = {
  roomId: string;
};

function JiraManagementModal(props: Props) {
  const {
    socket,
    isJiraManagementModalOpen,
    isInvalidStoryPointsField,
    setIsJiraManagementModalOpen,
    refetchCurrentUser,
    refetchIssues,
    issuesLength,
    setIsJiraTokenValid,
    isFirstLaunch,
    setIsFirstLaunchJiraModalOpen,
    setIsJiraErrorManagementModalOpen,
    setIsInvalidStoryPointsField
  } = props;
  const { currentUser } = useContext(UserContext);
  const [jiraIssues, setJiraIssues] = useState<any[]>([]);
  const [issueArray, setIssueArray] = useState<IIssue[]>([]);
  const [checkedIssues, setCheckedIssues] = useState<any[]>([]);
  const [userJqlQuery, setUserJqlQuery] = useState<string>("order by created");
  const [projectJqlQuery, setProjectJqlQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedIssueType, setSelectedIssueType] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [selectedField, setSelectedField] = useState<string>(
    !!currentUser?.storyPointsField ? currentUser.storyPointsField : ""
  );
  const [isConfigurationMode, setIsConfigurationMode] = useState<boolean>(
    isFirstLaunch || isInvalidStoryPointsField ? true : false
  );
  const [isLoadingIssues, setIsLoadingIssues] = useState<boolean>(false);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const { roomId } = useParams<RoomRouteParams>();

  const getSite = useCallback(async () => {
    const response = await JiraService.jiraAccessibleResources(
      currentUser?._id!
    );

    if (currentUser?.jiraAccessToken && !response) {
      await JiraService.jiraAuthenticationAutoRefresh(currentUser?._id!);
    }

    if (response) {
      return response?.data.data[0].url;
    }
  }, [currentUser?._id, currentUser?.jiraAccessToken]);

  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await JiraService.jiraAccessibleResources(
        currentUser?._id!
      );

      if (response?.status === 200) {
        setIsJiraTokenValid(true);
        return;
      }
      if (currentUser?.jiraAccessToken && !response) {
        await JiraService.jiraAuthenticationAutoRefresh(currentUser?._id!);
        setIsJiraTokenValid(true);
      }
      return response;
    } catch (err) {
      setIsJiraTokenValid(false);
    }
  }, [currentUser?._id, currentUser?.jiraAccessToken, setIsJiraTokenValid]);

  const convertIssues = useCallback((issues: any[], siteUrl: string) => {
    return issues.map((issue) => {
      const localIssue: IIssue = {
        name: issue.fields.summary,
        link: `${siteUrl}/browse/${issue.key}`,
        summary:
          issue?.fields?.description?.content?.[0]?.content?.[0]?.text ?? "",
        jiraIssueId: issue.id
      };
      return localIssue;
    });
  }, []);

  function removeDuplicates(
    fetchedJiraIssues: IIssue[],
    roomIssues: IIssue[],
    field: string
  ) {
    const uniqueArray: any[] = [];

    fetchedJiraIssues.forEach((obj1) => {
      const fieldValue = obj1[field];
      const isDuplicate = roomIssues.some((obj2) => obj2[field] === fieldValue);
      if (!isDuplicate) {
        uniqueArray.push(obj1);
      }
    });

    return uniqueArray;
  }

  const handleBasicSearch = useCallback(
    async (generatedQuery?: string) => {
      const siteUrl = await getSite();
      const jqlQuery = !!generatedQuery ? generatedQuery : userJqlQuery;
      const fields = [
        "summary",
        "status",
        "assignee",
        "description",
        "priority",
        !!currentUser?.storyPointsField ? currentUser?.storyPointsField : ""
      ];

      setIsLoadingIssues(true);

      const response = await JiraService.jiraBasicSearch(
        currentUser?._id!,
        jqlQuery,
        fields
      );

      if (currentUser?.jiraAccessToken && !response) {
        await JiraService.jiraAuthenticationAutoRefresh(currentUser?._id!);
        setIsLoadingIssues(false);
      }

      if (response) {
        const roomIssues = await IssueService.getAllIssues(roomId!);
        const issuesResponse = convertIssues(response?.data.issues, siteUrl);

        const filteredissues = removeDuplicates(
          issuesResponse,
          roomIssues!,
          "name"
        );
        setIsLoadingIssues(false);
        setJiraIssues(filteredissues);
      }
    },
    [
      currentUser?.jiraAccessToken,
      currentUser?.storyPointsField,
      currentUser?._id,
      convertIssues,
      getSite,
      roomId,
      userJqlQuery
    ]
  );

  const handleGenerateJqlQuery = useCallback(
    async (queryType: QueryType, queryParameter: string) => {
      let generatedQueryParameter = "";
      let generatedQuery = "";
      const orderBy = "Order by RANK";

      switch (queryType) {
        case QueryType.Project:
          generatedQueryParameter = `(project = ${queryParameter})`;
          setProjectJqlQuery(`(project = ${queryParameter})`);
          generatedQuery = `${generatedQueryParameter} ${orderBy}`;
          setUserJqlQuery(generatedQuery);
          handleBasicSearch(generatedQuery);
          break;
        case QueryType.IssueType:
          generatedQueryParameter = `${projectJqlQuery} AND (issuetype = '${queryParameter}')`;
          generatedQuery = `${generatedQueryParameter} ${orderBy}`;
          handleBasicSearch(generatedQuery);
          break;
        case QueryType.Filters:
          generatedQuery = queryParameter;
          handleBasicSearch(generatedQuery);
          break;
        default:
          generatedQuery = "order by created";
          break;
      }
    },
    [handleBasicSearch, projectJqlQuery]
  );

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => await JiraService.jiraProjects(currentUser?._id!)
  });

  const { data: issueTypes } = useQuery({
    queryKey: ["issueTypes"],
    queryFn: async () => await JiraService.jiraIssueTypes(currentUser?._id!)
  });

  const { data: filters } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => await JiraService.jiraFilters(currentUser?._id!)
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: async () => await JiraService.jiraFields(currentUser?._id!)
  });

  const { data: siteDetails } = useQuery({
    queryKey: ["siteDetails"],
    queryFn: async () =>
      await JiraService.jiraAccessibleResources(currentUser?._id!)
  });

  useEffect(() => {
    checkTokenValidity();
    async function getStatus() {
      if (selectedProject && !selectedIssueType) {
        await handleBasicSearch();
      }
      if (!selectedProject) {
        setJiraIssues([]);
      }
      if (!currentUser?.storyPointsField) {
        setIsConfigurationMode(true);
      }
    }
    getStatus();
  }, [
    selectedProject,
    selectedIssueType,
    handleBasicSearch,
    currentUser?.storyPointsField,
    checkTokenValidity
  ]);

  async function handleAddIssue(issue: any) {
    let currentOrder = issuesLength + 1;
    if (issueArray.length > 0) {
      currentOrder = issueArray[issueArray?.length - 1]?.order! + 1;
    }

    const localIssue: IIssue = {
      name: issue.name,
      link: issue.link,
      summary: issue.summary ?? "",
      order: currentOrder,
      jiraIssueId: issue.jiraIssueId,
      roomId: roomId!
    };

    setIssueArray([...issueArray, localIssue]);
    return true;
  }

  async function importIssues() {
    const issuesCreated = await IssueService.createIssues(issueArray);
    if (issuesCreated) {
      socket.emit("isIssuesSidebarOpen", {
        isIssuesSidebarOpen: true,
        roomId: roomId
      });
      setIsJiraManagementModalOpen(false);
      setCheckedIssues([]);
      setIssueArray([]);
      refetchIssues();
    }
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      refetchIssues();
    }
  }

  async function handleToggleIssue(issueToUpdate: any) {
    if (checkedIssues.some((issue) => issue.link === issueToUpdate.link)) {
      const updatedIssues = issueArray.filter(
        (issue) => issue.link !== issueToUpdate.link
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

  function handleOnClickProject(project: any) {
    if (selectedProject === project.id) {
      setSelectedProject("");
      setSelectedIssueType("");
    } else {
      setSelectedProject(project.id);
      handleGenerateJqlQuery(QueryType.Project, project.id);
    }
    setSelectedFilter("");
  }

  function handleOnClickIssueType(issue: any) {
    if (selectedIssueType === issue.name) {
      setSelectedIssueType("");
    } else {
      if (selectedProject) {
        setSelectedIssueType(issue.name);
        handleGenerateJqlQuery(QueryType.IssueType, issue.name);
      }
    }
    setSelectedFilter("");
  }

  function handleOnClickFliter(filter: any) {
    if (selectedFilter === filter.name) {
      setSelectedFilter("");
    } else {
      setSelectedFilter(filter.name);
      handleGenerateJqlQuery(QueryType.Filters, filter.jql);
    }
    setSelectedProject("");
    setSelectedIssueType("");
  }

  async function handleSelectField(event: SelectChangeEvent) {
    setSelectedField(event.target.value as string);
    currentUser!.storyPointsField = event.target.value;
    await UserService.updateUser(currentUser?._id!, currentUser!);
    setIsInvalidStoryPointsField(false);
    refetchCurrentUser();
  }

  async function handleRevokeJiraAcccess() {
    await UserService.revokeJiraAccess(currentUser?._id!);
    setIsJiraTokenValid(false);
    setIsJiraManagementModalOpen(false);
    refetchCurrentUser();
  }

  return (
    <Grid>
      <CustomModal
        isOpen={isJiraManagementModalOpen}
        customLeftPosition="40%"
        modalWidth="45vw"
        size="lg"
      >
        <Grid
          sx={{
            diplay: "flex",
            background: "secondary.main",
            color: (theme) =>
              theme.palette.mode === "dark" ? "white" : "black",
            flexDirection: "column",
            justifyContent: "center",
            height: "90%",
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
              setIsJiraErrorManagementModalOpen(false);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>
          <Grid
            sx={{
              fontSize: {
                md: "24px",
                xs: "16px",
                display: "flex",
                flexDirection: "row",
                alignItems: "ceneter"
              },
              mt: 1.5
            }}
          >
            <Typography variant="h6"> Issue Management for </Typography>
            <Typography variant="h6" sx={{ ml: 0.5 }}>
              {" "}
              {!!siteDetails ? siteDetails?.data.data[0].url : ""}
            </Typography>
          </Grid>

          <Grid
            sx={{
              alignSelf: "flex-end",
              cursor: "pointer",
              position: "absolute",
              color: (theme) =>
                theme.palette.mode === "dark" ? "white" : "black",
              right: "60px",
              top: "24px"
            }}
          >
            {isConfigurationMode ? "Search" : "Configuration"}
            <Switch
              color="success"
              checked={isConfigurationMode}
              onClick={() => setIsConfigurationMode(!isConfigurationMode)}
              sx={{
                color: "red",
                background: (theme) => theme.palette.secondary.main
              }}
            />
          </Grid>

          {isConfigurationMode && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "98%",
                height: "100%",
                borderRadius: "10px",
                px: 4,
                mt: 2,
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "2px solid white"
                    : "2px solid #67A3EE"
              }}
            >
              <Grid
                sx={{
                  mt: 5,
                  width: "100%",
                  height: "auto",
                  py: 4,
                  px: 4,
                  borderRadius: "10px",
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? "2px solid white"
                      : "2px solid #67A3EE"
                }}
              >
                <Typography variant="h5">Select Story Points Field</Typography>
                <Typography variant="h6" sx={{ mt: 1 }} paragraph>
                  You need to select the field used in Jira for your story
                  points in order to be able to save story points back to jira
                  after estimating
                </Typography>

                <FormControl sx={{ width: "90%", mt: 2 }}>
                  <InputLabel>Issue Fields</InputLabel>
                  <Select
                    value={selectedField}
                    label={
                      fields?.data[
                        fields?.data.findIndex(
                          (field: any) =>
                            field.id === currentUser?.storyPointsField
                        )
                      ]?.name
                    }
                    onChange={handleSelectField}
                  >
                    {fields?.data.map((field: any, i: number) => (
                      <MenuItem key={i} value={field.id}>
                        {field.name} ({field.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid sx={{ mt: 4 }}>
                <Button
                  onClick={() => {
                    setIsConfigurationMode(false);
                    setIsFirstLaunchJiraModalOpen(false);
                  }}
                  disabled={!selectedField}
                  variant="contained"
                  sx={{
                    px: 1,
                    py: 1,
                    background: "green",
                    color: "white",
                    borderRadius: "8px",
                    "&:hover": {
                      opacity: 0.9,
                      background: "green"
                    }
                  }}
                >
                  <Typography>Filter Through your Issues</Typography>
                </Button>
              </Grid>

              <Grid
                sx={{
                  mt: 15,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "98%",
                  height: "auto"
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleRevokeJiraAcccess}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    background: "red",
                    border: "2px solid",
                    cursor: "pointer",
                    borderRadius: "10px",
                    fontSize: "18px",
                    height: "20px",
                    textTransform: "uppercase",
                    width: "auto",
                    ml: 1,
                    px: 1.5,
                    py: 2,
                    "&:hover": {
                      opacity: 0.7
                    }
                  }}
                >
                  Revoke JIRA Access
                </Button>
              </Grid>
            </Grid>
          )}

          {!isConfigurationMode && (
            <Grid
              sx={{
                flexDirection: "column",
                flexWrap: "wrap",
                mt: 2,
                px: 2,
                py: 1.5,
                height: "300px",
                overflowY: "auto",
                borderRadius: "10px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "2px solid white"
                    : "2px solid #67A3EE"
              }}
            >
              <Typography variant="h6" sx={{ cursor: "pointer" }}>
                Basic Search with Controls
              </Typography>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "90%",
                  p: 0.5,
                  height: "80%"
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    mt: 0,
                    p: 0.5,
                    height: "50px"
                  }}
                >
                  <Grid>Projects - </Grid>
                  {projects?.data.values.map((project: any, i: number) => (
                    <Grid
                      onClick={() => handleOnClickProject(project)}
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          selectedProject === project.id ? "green" : "",
                        border: (theme) =>
                          theme.palette.mode === "dark"
                            ? "2px solid white"
                            : "2px solid #67A3EE",
                        cursor: "pointer",
                        borderRadius: "10px",
                        height: "auto",
                        width: "auto",
                        mx: 0.8,
                        px: 1,
                        py: 1,
                        "&:hover": {
                          opacity: 0.7
                        }
                      }}
                    >
                      {project.name}
                    </Grid>
                  ))}
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mt: 0.5,
                    p: 0.5,
                    height: "auto"
                  }}
                >
                  <Grid>Issue Types - </Grid>
                  {issueTypes?.data.map((issue: any, i: number) => (
                    <Button
                      onClick={() => handleOnClickIssueType(issue)}
                      disabled={!selectedProject}
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "white" : "black",
                        background:
                          selectedIssueType === issue.name ? "green" : "none",
                        border: (theme) =>
                          theme.palette.mode === "dark"
                            ? "2px solid white"
                            : "2px solid #67A3EE",
                        cursor: "pointer",
                        borderRadius: "10px",
                        height: "auto",
                        width: "auto",
                        m: 0.8,
                        px: 1,
                        py: 1,
                        "&:hover": {
                          background:
                            selectedIssueType === issue.name ? "green" : "none",
                          opacity: 0.7
                        }
                      }}
                    >
                      {issue.name}
                    </Button>
                  ))}
                </Grid>

                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mt: 0.5,
                    p: 0.5,
                    height: "auto"
                  }}
                >
                  <Grid>My Filters - </Grid>
                  {filters?.data.values.map((filter: any, i: number) => (
                    <Grid
                      onClick={() => handleOnClickFliter(filter)}
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          selectedFilter === filter.name ? "green" : "",
                        border: (theme) =>
                          theme.palette.mode === "dark"
                            ? "2px solid white"
                            : "2px solid #67A3EE",
                        cursor: "pointer",
                        borderRadius: "10px",
                        height: "auto",
                        width: "auto",
                        m: 0.8,
                        py: 1,
                        px: 0.8,
                        "&:hover": {
                          opacity: 0.7
                        }
                      }}
                    >
                      {filter.name}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {!isConfigurationMode && (
            <Grid
              sx={{
                mt: 2,
                diplay: "flex",
                flexDirection: "column",
                maxHeight: "500px",
                borderRadius: "10px",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? "2px solid white"
                    : "2px solid #67A3EE",
                overflow: "auto"
              }}
            >
              <Grid
                sx={{
                  px: 5,
                  py: 1,
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: "22px",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "black",
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#151e22" : "green",
                  borderBottom: "2px solid white",
                  cursor: "pointer",
                  justifyContent: "space-between",
                  position: "sticky",
                  zIndex: 10000,
                  top: -2
                }}
              >
                <Grid>Search Results</Grid>

                <Button
                  variant="contained"
                  sx={{
                    mt: 0.5,
                    px: 2,
                    py: 0.5,
                    borderRadius: "8px",
                    background: "green",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer"
                  }}
                  disabled={issueArray.length === 0}
                  onClick={importIssues}
                >
                  Import Issues
                </Button>
              </Grid>

              {isLoadingIssues ? (
                <Grid
                  sx={{
                    height: "85%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Spinner fullHeight={false} spinnerType="PuffLoader" />
                  <Typography variant="h6" fontSize={14} sx={{ mt: 1 }}>
                    Loading Issues.....
                  </Typography>
                </Grid>
              ) : (
                <Grid
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "row",
                    height: "auto",
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
                        position: "relative",
                        px: 2,
                        py: 1,
                        m: 0,
                        width: { md: "300px", xs: "200px" },
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "white" : "black",
                        fontWeight: "500",
                        height: "150px",
                        borderRadius: "12px",
                        border: checkedIssues.some(
                          (issue) => issue.name === jiraIssue.name
                        )
                          ? "1px solid green"
                          : "",
                        my: "15px",

                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0px 0px 10px 2px rgba(255, 255, 255, 0.1)"
                            : "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
                        background: "secondary.main",
                        "&:hover": {
                          border: "1px solid #green"
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
                        <Typography
                          variant="h6"
                          sx={{
                            wordBreak: "break-word",
                            fontSize: { md: "14px", xs: "12px" }
                          }}
                        >
                          {jiraIssue.name?.length! > 30
                            ? jiraIssue.name?.slice(0, 30) + "..."
                            : jiraIssue.name}
                        </Typography>
                        <Checkbox
                          checked={checkedIssues.some(
                            (issue) => issue.name === jiraIssue.name
                          )}
                          onChange={() => {
                            handleToggleIssue(jiraIssue);
                          }}
                        />
                      </Grid>
                      <Grid sx={{ width: "90%", my: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            wordBreak: "break-word",
                            fontSize: { md: "14px", xs: "12px" }
                          }}
                        >
                          {jiraIssue.summary?.length! > 40
                            ? jiraIssue.summary?.slice(0, 40) + "..."
                            : jiraIssue.summary}
                        </Typography>
                      </Grid>

                      <Link
                        href={jiraIssue.link}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          wordBreak: "break-word",
                          position: "absolute",
                          bottom: 2.5
                        }}
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
              )}
              <Grid
                sx={{
                  width: "100%",
                  height: "80%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {jiraIssues.length === 0 && (
                  <Grid
                    sx={{
                      width: "100%",
                      height: "90%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Typography variant="h5">No issues to display</Typography>
                    <Typography variant="h6">Use the filters above</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraManagementModal;
