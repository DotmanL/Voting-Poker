import React, { useContext, useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AiOutlineClose } from "react-icons/ai";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import MultipleUrlsModal from "./MultipleUrlsModal";
import SingleIssueTextbox from "./SingleIssueTextbox";
import { IIssue } from "interfaces/Issues";
import IssuesView from "./IssuesView";
import { SidebarContext } from "utility/providers/SideBarProvider";
import { useClickAway } from "react-use";
import { toast } from "react-toastify";
import IssueService from "api/IssueService";
import AddTaskIcon from "@mui/icons-material/AddTask";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";
import { IRoom } from "interfaces/Room/IRoom";
import { IssueContext } from "utility/providers/IssuesProvider";
import JiraImportModal from "./JiraImportModal";
import { UserContext } from "utility/providers/UserProvider";
import JiraManagementModal from "./JiraManagementModal";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import JiraService from "api/JiraService";
import Spinner from "components/shared/component/Spinner";
import JiraErrorManagementModal from "./JiraErrorManagementModal";
import { useQuery } from "react-query";
import UserService from "api/UserService";
import PromptModal from "components/shared/component/PromptModal";

const options = [
  {
    label: "Import from JIRA",
    value: "jiraImport",
    toolTip: "Import your jira issues",
    link: "https://example.com/option2"
  },
  {
    label: "Add multiple urls",
    value: "addMultipleUrls",
    toolTip: "Add Multiple Urls",
    link: "https://example.com/option1"
  }
];

type Props = {
  socket: any;
  issues: IIssue[];
  error: Error | null;
  isLoading: boolean;
  room: IRoom;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
  isJiraTokenValid: boolean;
  setIsJiraTokenValid: React.Dispatch<React.SetStateAction<boolean>>;
  validityText: string;
  isJiraManagementModalOpen: boolean;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFirstLaunchJiraModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstLauchJiraModalOpen: boolean;
};

function RightSidebar(props: Props) {
  const {
    issues,
    isLoading,
    error,
    refetchIssues,
    room,
    socket,
    isJiraTokenValid,
    setIsJiraTokenValid,
    isJiraManagementModalOpen,
    setIsJiraManagementModalOpen,
    isFirstLauchJiraModalOpen,
    setIsFirstLaunchJiraModalOpen,
    validityText
  } = props;
  const { currentUser } = useContext(UserContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isJiraImportModalOpen, setIsJiraImportModalOpen] =
    useState<boolean>(false);
  const { activeIssue, setActiveIssue } = useContext(IssueContext);
  const [isSingleIssueTextBoxOpen, setIsSingleIssueTextBoxOpen] =
    useState<boolean>(false);
  const [isJiraErrorManagementModalOpen, setIsJiraErrorManagementModalOpen] =
    useState<boolean>(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] =
    useState<boolean>(false);
  const [cards, setCards] = useState(issues);
  const [isAddingStoryPoints, setIsAddingStoryPoints] =
    useState<boolean>(false);
  const [isInvalidStoryPointsField, setIsInvalidStoryPointsField] =
    useState<boolean>(false);
  const singleIssueTextBoxRef = useRef<HTMLDivElement>(null);
  const [isConfirmPromptModalOpen, setIsConfirmPromptModalOpen] =
    useState<boolean>(false);

  const { data: reloadedUser, refetch: refetchReloadedUser } = useQuery({
    queryKey: ["reloadUser"],
    queryFn: async () => await UserService.loadUser(currentUser?._id!)
  });

  useClickAway(singleIssueTextBoxRef, () => {
    setIsSingleIssueTextBoxOpen(false);
  });

  useEffect(() => {
    if (!socket) return;

    if (!!issues) {
      setCards(issues);
    }

    if (!isSidebarOpen) {
      setIsSingleIssueTextBoxOpen(false);
    }
    socket.on("isIssuesSidebarOpenResponse", (data: any) => {
      if (data.isIssuesSidebarOpen) {
        setIsSidebarOpen(true);
        refetchIssues();
      }
    });

    socket.on("triggerRefetchIssuesResponse", (data: any) => {
      if (data.isRefetchIssues) {
        refetchIssues();
      }
    });
  }, [issues, isSidebarOpen, setIsSidebarOpen, socket, refetchIssues]);

  const toggleDrawer =
    (isSideBarOpen: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsSidebarOpen(isSideBarOpen);
    };

  async function handleCreateIssues(formData: IIssue[]) {
    await IssueService.createIssues(formData);
    setIsAddMultipleModalOpen(false);
    refetchIssues();
    socket.emit("isIssuesSidebarOpen", {
      isIssuesSidebarOpen: true,
      roomId: room.roomId
    });
    setIsSingleIssueTextBoxOpen(false);
  }

  function handleOptionClick(label: string) {
    if (label === "addMultipleUrls") {
      setIsAddMultipleModalOpen(true);
    }
    if (label === "jiraImport") {
      if (!currentUser) {
        return;
      }
      if (isJiraTokenValid) {
        setIsJiraManagementModalOpen(true);
      } else {
        setIsJiraImportModalOpen(true);
      }
    }
  }

  async function handleDeleteAllIssues() {
    const roomIssuesIds = await IssueService.getAllIssues(room.roomId);
    if (!roomIssuesIds) {
      return;
    }

    function getIssuesId(arr: any[]): string[] {
      return arr.map((obj) => obj._id);
    }

    const issueIds = getIssuesId(roomIssuesIds);
    if (issueIds.length <= 0) {
      toast.warn("No issues to delete");
      return;
    }

    if (issueIds.includes(activeIssue?._id!)) {
      socket.emit("updateActiveIssueId", {
        roomActiveIssueId: "",
        roomId: room.roomId
      });
      setActiveIssue(undefined);
    }
    await IssueService.deleteIssues(issueIds);
    socket.emit("triggerRefetchIssues", {
      isRefetchIssues: true,
      roomId: room.roomId
    });
  }

  async function handleSaveAllJiraIssues() {
    const jiraIssues = issues.filter((issue) => issue.jiraIssueId !== null);

    let showToast = false;
    for (const issue of jiraIssues) {
      const fieldValue = issue.storyPoints!;
      setIsAddingStoryPoints(true);
      const response = await JiraService.jiraUpdateStoryPoints(
        currentUser?._id!,
        issue.jiraIssueId!,
        fieldValue
      );
      setIsAddingStoryPoints(false);
      if (response?.status === 200) {
        showToast = true;
        setIsConfirmPromptModalOpen(false);
        setIsInvalidStoryPointsField(false);
      } else {
        toast.error(
          "Could not add story points to jira, ensure story points field is configured properly",
          { autoClose: 1000, position: "bottom-right" }
        );
        setIsInvalidStoryPointsField(true);
        setIsJiraErrorManagementModalOpen(true);
        return;
      }
    }

    if (showToast) {
      toast.success(
        `Story points added to ${jiraIssues.length} Jira Issues successfully`,
        {
          autoClose: 1800
        }
      );
    }
  }

  function cummulativePoints() {
    const totalStoryPoints = issues.reduce(
      (acc, issue) => acc + issue?.storyPoints!,
      0
    );
    return totalStoryPoints;
  }

  const issuesStoryPoints = cummulativePoints();
  const jiraIssuesLength = issues.filter(
    (issue) => issue.jiraIssueId !== null
  ).length;

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  const list = (
    <Box
      sx={{
        width: { md: 450, xs: "100vw" },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "secondary.main"
      }}
      role="presentation"
    >
      <Grid
        sx={{
          height: "auto",
          marginTop: "30px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          p: { md: "5px", xs: "8px" }
        }}
      >
        <Grid>
          <Typography variant="h5" sx={{ color: "primary.main", ml: 2 }}>
            {issues.length} Issue{issues.length > 1 ? "s" : ""}
          </Typography>
        </Grid>

        <Typography variant="h6" sx={{ mr: 2, mt: 0.2, color: "primary.main" }}>
          {issuesStoryPoints} Story Point{issuesStoryPoints > 1 ? "s" : ""}
        </Typography>

        <Tooltip title="Close Sidebar">
          <Grid
            sx={{
              mr: 4,
              cursor: "pointer",
              "&:hover": {
                color: "red"
              }
            }}
            onClick={() => {
              setIsSidebarOpen(false);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>
        </Tooltip>
      </Grid>

      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 1,
          px: 2,
          justifyContent: { md: "space-between", xs: "flex-end" },
          width: { md: "100%", xs: "100vw" }
        }}
      >
        <Grid
          sx={{
            display: { md: "flex", xs: "none" },
            flexDirection: "row",
            alignItems: "center",
            mt: 1,
            px: 0.5,
            justifyContent: { md: "space-between", xs: "flex-end" },
            width: { md: "75%", xs: "100vw" }
          }}
        >
          {options.map((option, i) => (
            <Grid
              sx={{
                py: 1,
                cursor: "pointer"
              }}
              key={i}
            >
              <Tooltip title={option.toolTip}>
                <Button
                  variant="outlined"
                  sx={{
                    fontSize: { md: "12px", xs: "12px" },
                    mx: 1
                  }}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
        <MultipleUrlsModal
          cardsLength={cards.length}
          isAddMultipleModalOpen={isAddMultipleModalOpen}
          setIsAddMultipleModalOpen={setIsAddMultipleModalOpen}
          onFormSubmitted={handleCreateIssues}
        />
        <JiraImportModal
          isJiraImportModalOpen={isJiraImportModalOpen}
          setIsJiraImportModalOpen={setIsJiraImportModalOpen}
          validityText={validityText}
        />
        {isJiraTokenValid && isJiraManagementModalOpen && (
          <JiraManagementModal
            socket={socket}
            issuesLength={cards.length}
            isFirstLaunch={isFirstLauchJiraModalOpen}
            refetchCurrentUser={refetchReloadedUser}
            setIsJiraTokenValid={setIsJiraTokenValid}
            isJiraManagementModalOpen={isJiraManagementModalOpen}
            setIsJiraManagementModalOpen={setIsJiraManagementModalOpen}
            setIsFirstLaunchJiraModalOpen={setIsFirstLaunchJiraModalOpen}
            isInvalidStoryPointsField={isInvalidStoryPointsField}
            refetchIssues={refetchIssues}
            setIsJiraErrorManagementModalOpen={
              setIsJiraErrorManagementModalOpen
            }
            setIsInvalidStoryPointsField={setIsInvalidStoryPointsField}
          />
        )}
        {isJiraErrorManagementModalOpen && (
          <JiraErrorManagementModal
            isJiraErrorManagementModalOpen={isJiraErrorManagementModalOpen}
            setIsJiraErrorManagementModalOpen={
              setIsJiraErrorManagementModalOpen
            }
            setIsJiraManagementModalOpen={setIsJiraManagementModalOpen}
          />
        )}

        <Grid sx={{ display: { md: "flex", xs: "none" } }}>
          {isAddingStoryPoints ? (
            <Spinner fullHeight={false} spinnerType="PuffLoader" size={50} />
          ) : (
            <Grid>
              {issues.filter((issue: IIssue) => issue.jiraIssueId !== null)
                .length > 0 &&
                !!reloadedUser?.jiraAccessToken &&
                !!reloadedUser?.storyPointsField && (
                  <Tooltip arrow title="Saves All Jira Issues StoryPoints">
                    <SaveIcon
                      sx={{
                        px: 1,
                        mt: 1,
                        cursor: "pointer",
                        height: "32px",
                        width: "100%",
                        "&:hover": {
                          color: "green"
                        }
                      }}
                      onClick={() => setIsConfirmPromptModalOpen(true)}
                    />
                  </Tooltip>
                )}
            </Grid>
          )}
          <Tooltip title="Delete All Issues">
            <DeleteIcon
              sx={{
                cursor: "pointer",
                px: 1,
                mt: 1,
                height: "32px",
                width:
                  issues.filter((issue: IIssue) => issue.jiraIssueId !== null)
                    .length > 0 &&
                  !!reloadedUser?.jiraAccessToken &&
                  !!reloadedUser.storyPointsField
                    ? "50%"
                    : "100%",
                "&:hover": {
                  color: "red"
                }
              }}
              onClick={handleDeleteAllIssues}
            />
          </Tooltip>
        </Grid>
      </Grid>

      {isLoading ? (
        <Grid>Loading Issues</Grid>
      ) : (
        <Grid
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {cards && (
            <IssuesView
              currentUser={reloadedUser}
              setIsJiraErrorManagementModalOpen={
                setIsJiraErrorManagementModalOpen
              }
              room={room}
              socket={socket}
              cards={cards}
              setCards={setCards}
              refetchIssues={refetchIssues}
              setIsInvalidStoryPointsField={setIsInvalidStoryPointsField}
            />
          )}
          <Grid sx={{ ml: 2, mb: 2 }} ref={singleIssueTextBoxRef}>
            {!isSingleIssueTextBoxOpen && (
              <Grid
                sx={{
                  height: "auto",
                  marginTop: "30px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "5px",
                  cursor: "pointer",
                  mt: 0.5,
                  p: 0.5,
                  borderRadius: "10px"
                }}
                onClick={() => setIsSingleIssueTextBoxOpen(true)}
              >
                <AddTaskIcon
                  sx={{
                    marginLeft: "15px",
                    color: (theme) => theme.palette.primary.main,
                    width: "32px",
                    height: "32px"
                  }}
                />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Add Issue(s)
                </Typography>
              </Grid>
            )}
            {isSingleIssueTextBoxOpen && (
              <Grid>
                <SingleIssueTextbox
                  onFormSubmitted={handleCreateIssues}
                  cardsLength={cards.length}
                  isSingleIssueTextBoxOpen={isSingleIssueTextBoxOpen}
                  setIsSingleIssueTextBoxOpen={setIsSingleIssueTextBoxOpen}
                />
              </Grid>
            )}
            {isConfirmPromptModalOpen && (
              <PromptModal
                isModalOpen={isConfirmPromptModalOpen}
                setIsModalOpen={setIsConfirmPromptModalOpen}
                promptMessage={`Are you sure you want to save the story points of ${jiraIssuesLength} ${
                  jiraIssuesLength > 1 ? "issues" : "issue"
                } to JIRA?`}
                onClickConfirm={handleSaveAllJiraIssues}
              />
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Grid>
      <SwipeableDrawer
        anchor={"right"}
        open={isSidebarOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{ height: "0vh" }}
        PaperProps={{
          sx: { background: (theme) => theme.palette.secondary.main }
        }}
        ModalProps={{
          disableEnforceFocus: true,
          BackdropProps: {
            invisible: true,
            sx: {
              cursor: "pointer",
              width: "0vw",
              height: "0vh"
            }
          }
        }}
      >
        {list}
      </SwipeableDrawer>
    </Grid>
  );
}

export default RightSidebar;
