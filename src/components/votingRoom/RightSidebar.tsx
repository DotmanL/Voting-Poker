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
import { userContext } from "App";
import JiraManagementModal from "./JiraManagementModal";
import DeleteIcon from "@mui/icons-material/Delete";

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
  validityText: string;
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
    validityText
  } = props;
  const user = useContext(userContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isJiraImportModalOpen, setIsJiraImportModalOpen] =
    useState<boolean>(false);
  const [isJiraManagementModalOpen, setIsJiraManagementModalOpen] =
    useState<boolean>(false);
  const { activeIssue, setActiveIssue } = useContext(IssueContext);
  const [isSingleIssueTextBoxOpen, setIsSingleIssueTextBoxOpen] =
    useState<boolean>(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] =
    useState<boolean>(false);
  const [cards, setCards] = useState(issues);
  const singleIssueTextBoxRef = useRef<HTMLDivElement>(null);

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
      if (!user) {
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

  function cummulativePoints() {
    const totalStoryPoints = issues.reduce(
      (acc, issue) => acc + issue?.storyPoints!,
      0
    );
    return totalStoryPoints;
  }

  const issuesStoryPoints = cummulativePoints();

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
            width: { md: "100%", xs: "100vw" }
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
                    fontSize: { md: "14px", xs: "12px" },
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
            issuesLength={cards.length}
            isJiraManagementModalOpen={isJiraManagementModalOpen}
            setIsJiraManagementModalOpen={setIsJiraManagementModalOpen}
            refetchIssues={refetchIssues}
          />
        )}

        <Grid sx={{ cursor: "pointer", display: { md: "flex", xs: "none" } }}>
          <Tooltip title="Delete All Issues">
            <DeleteIcon
              sx={{
                px: 1,
                mt: 1,
                height: "32px",
                width: "100%",
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
              room={room}
              socket={socket}
              cards={cards}
              setCards={setCards}
              refetchIssues={refetchIssues}
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
                  // "&:hover": {
                  //   color: "primary.main",
                  //   transition: "box-shadow 0.3s ease-in-out",
                  //   boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
                  // }
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
          BackdropProps: {
            invisible: true,
            sx: {
              cursor: "pointer",
              width: "100%",
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
