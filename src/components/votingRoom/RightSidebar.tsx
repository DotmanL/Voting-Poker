import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiImport } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { Divider, Grid, Tooltip, Typography } from "@mui/material";
import Dropdown from "components/shared/component/DropDown";
import MultipleUrlsModal from "./MultipleUrlsModal";
import SingleIssueTextbox from "./SingleIssueTextbox";
import { IIssue } from "interfaces/Issues";
import IssuesView from "./IssuesView";
import { SidebarContext } from "utility/providers/SideBarProvider";
import AddIcon from "@mui/icons-material/Add";
import { useClickAway } from "react-use";
import { toast } from "react-toastify";
import IssueService from "api/IssueService";
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
import axios from "axios";

const options = [
  {
    label: "Add multiple urls",
    value: "addMultipleUrls",
    toolTip: "Add Multiple Urls",
    link: "https://example.com/option1"
  },
  {
    label: "Import from JIRA",
    value: "jiraImport",
    toolTip: "Import from jira",
    link: "https://example.com/option2"
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
};

function RightSidebar(props: Props) {
  const { issues, isLoading, error, refetchIssues, room, socket } = props;
  const user = useContext(userContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isMiniDropDownOpen, setIsMiniDropDownOpen] = useState<boolean>(false);
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
  const [isJiraTokenValid, setIsJiraTokenValid] = useState<boolean>(false);
  const [validityText, setValidityText] = useState<string>("");
  const dropDownRef = useRef<HTMLDivElement>(null);
  const miniDropDownRef = useRef<HTMLDivElement>(null);
  const singleIssueTextBoxRef = useRef<HTMLDivElement>(null);

  useClickAway(dropDownRef, () => {
    setIsDropDownOpen(false);
  });

  useClickAway(miniDropDownRef, () => {
    setIsMiniDropDownOpen(false);
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
      setIsMiniDropDownOpen(false);
      setIsDropDownOpen(false);
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

  //TODO: Move to API
  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.atlassian.com/oauth/token/accessible-resources",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.jiraAccessToken}`
          }
        }
      );
      setIsJiraTokenValid(true);
      return response;
    } catch (err) {
      setIsJiraTokenValid(false);
      setValidityText("Jira token has expired");
    }
  }, [user?.jiraAccessToken]);

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
      setIsDropDownOpen(false);
      setIsAddMultipleModalOpen(true);
      setIsMiniDropDownOpen(false);
    }
    if (label === "jiraImport") {
      if (!user) {
        return;
      }
      if (isJiraTokenValid) {
        setIsJiraManagementModalOpen(true);
        setIsDropDownOpen(false);
        setIsMiniDropDownOpen(false);
      } else {
        setIsJiraImportModalOpen(true);
        setIsDropDownOpen(false);
        setIsMiniDropDownOpen(false);
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
    setIsMiniDropDownOpen(false);
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
            Issues
          </Typography>
        </Grid>
        <Grid
          sx={{
            mr: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: { md: "space-between", xs: "flex-end" },
            width: { md: "25%", xs: "100vw" }
          }}
        >
          <Grid
            sx={{
              display: { md: "flex", xs: "none" },
              flexDirection: "column"
            }}
            ref={dropDownRef}
          >
            <Tooltip title="Import Issues">
              <Grid
                sx={{
                  cursor: "pointer",
                  p: 0.5,
                  borderRadius: "50%",
                  "&:hover": {
                    transition: "box-shadow 0.3s ease-in-out",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
                        : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)"
                  }
                }}
                onClick={() => {
                  checkTokenValidity();
                  setIsDropDownOpen(!isDropDownOpen);
                  setIsSingleIssueTextBoxOpen(false);
                  setIsMiniDropDownOpen(false);
                }}
              >
                <BiImport size={36} />
              </Grid>
            </Tooltip>

            <Dropdown isDropDownOpen={isDropDownOpen}>
              <>
                {options.map((option, i) => (
                  <Grid
                    key={i}
                    sx={{
                      borderRadius: "10px"
                    }}
                  >
                    <Grid
                      sx={{
                        py: 1,
                        width: "100%",
                        height: "100%",
                        pl: "25px",
                        pr: "50px",
                        cursor: "pointer",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
                            : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
                        background: (theme) => theme.palette.secondary.main,
                        "&:hover": {
                          background: "#67A3EE",
                          color: "#FFFFFF",
                          transition: "box-shadow 0.3s ease-in-out"
                        }
                      }}
                      key={i}
                    >
                      <Tooltip title={option.toolTip} leaveDelay={10}>
                        <Grid onClick={() => handleOptionClick(option.value)}>
                          {option.label}
                        </Grid>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))}
              </>
            </Dropdown>
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
                isJiraManagementModalOpen={isJiraManagementModalOpen}
                setIsJiraManagementModalOpen={setIsJiraManagementModalOpen}
              />
            )}
          </Grid>

          <Grid
            ref={miniDropDownRef}
            sx={{ cursor: "pointer", display: { md: "flex", xs: "none" } }}
          >
            {!!issues && (
              <BsThreeDotsVertical
                onClick={() => {
                  setIsMiniDropDownOpen(!isMiniDropDownOpen);
                  setIsDropDownOpen(false);
                }}
                size={20}
              />
            )}
            {isMiniDropDownOpen && (
              <Dropdown isDropDownOpen={isMiniDropDownOpen}>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "200px",
                    height: "auto",
                    borderRadius: "10px",
                    zIndex: 100,
                    py: 2,
                    cursor: "pointer",
                    background: (theme) => theme.palette.secondary.main
                  }}
                >
                  <Grid
                    sx={{
                      px: 2,
                      width: "100%",
                      background: (theme) => theme.palette.secondary.main,
                      "&:hover": {
                        background: "darkGray",
                        color: "black",
                        opacity: 0.8
                      }
                    }}
                    onClick={handleDeleteAllIssues}
                  >
                    Delete Issues
                  </Grid>
                </Grid>
              </Dropdown>
            )}
          </Grid>
          <Divider
            sx={{ borderWidth: 2, display: { md: "flex", xs: "none" } }}
            orientation="vertical"
            flexItem
          />
          <Tooltip title="Close Sidebar">
            <Grid
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "red"
                }
              }}
              onClick={() => {
                setIsSidebarOpen(false);
                setIsDropDownOpen(false);
              }}
            >
              <AiOutlineClose size={32} />
            </Grid>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid
        sx={{
          ml: 3,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start"
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flexStart"
          }}
        >
          <Typography>
            {issues.length} issue{issues.length > 1 ? "s" : ""}
          </Typography>
          <Typography sx={{ ml: 1, mt: 0.2 }}>•</Typography>
          <Typography sx={{ ml: 1, mt: 0.2 }}>
            {issuesStoryPoints} point{issuesStoryPoints > 1 ? "s" : ""}
          </Typography>
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
                  borderRadius: "10px",
                  "&:hover": {
                    color: "primary.main",
                    transition: "box-shadow 0.3s ease-in-out",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
                  }
                }}
                onClick={() => setIsSingleIssueTextBoxOpen(true)}
              >
                <AddIcon
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
