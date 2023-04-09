import React, { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiImport } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { Divider, Grid, Tooltip, Typography } from "@mui/material";
import Dropdown from "components/shared/component/DropDown";
import MultipleUrlsModal from "./MultipleUrlsModal";
import SingleIssueTextbox from "./SingleIssueTextbox";
import { IIssue } from "interfaces/Issues";
import IssuesView from "./IssuesView";
import { SidebarContext } from "utility/providers/SideBarProvider";
import { toast } from "react-toastify";
import IssueService from "api/IssueService";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";

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
    toolTip: "Coming Soon...",
    link: "https://example.com/option2"
  },
  {
    label: "Import from CSV",
    value: "csvImport",
    toolTip: "Coming Soon...",
    link: "https://example.com/option3"
  }
];

type Props = {
  socket: any;
  issues: IIssue[];
  error: Error | null;
  isLoading: boolean;
  roomId: string;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
};

function RightSidebar(props: Props) {
  const { issues, isLoading, error, refetchIssues, roomId, socket } = props;
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isMiniDropDownOpen, setIsMiniDropDownOpen] = useState<boolean>(false);
  const [isSingleIssueTextBoxOpen, setIsSingleIssueTextBoxOpen] =
    useState<boolean>(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] =
    useState<boolean>(false);
  const [cards, setCards] = useState(issues);

  useEffect(() => {
    if (issues) {
      setCards(issues);
    }
    if (!isSidebarOpen) {
      setIsMiniDropDownOpen(false);
      setIsDropDownOpen(false);
      setIsSingleIssueTextBoxOpen(false);
      return;
    }
    return () => {
      setIsSidebarOpen(false);
    };
  }, [issues, isSidebarOpen]);

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
    refetchIssues();
    setIsAddMultipleModalOpen(false);
    setIsSingleIssueTextBoxOpen(false);
  }

  function handleOptionClick(label: string) {
    if (label === "addMultipleUrls") {
      setIsDropDownOpen(false);
      setIsAddMultipleModalOpen(true);
      setIsMiniDropDownOpen(false);
    }
  }

  async function handleDeleteAllIssues() {
    const roomIssuesIds = await IssueService.getAllIssues(roomId);
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
    await IssueService.deleteIssues(issueIds);
    refetchIssues();
    setIsMiniDropDownOpen(false);
  }

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
            justifyContent: "space-between",
            width: "25%"
          }}
        >
          <Grid sx={{ display: "flex", flexDirection: "column" }}>
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
          </Grid>
          <Grid sx={{ cursor: "pointer" }}>
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
          <Divider sx={{ borderWidth: 2 }} orientation="vertical" flexItem />
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
              roomId={roomId}
              socket={socket}
              cards={cards}
              setCards={setCards}
              refetchIssues={refetchIssues}
            />
          )}
          <Grid sx={{ ml: 2, mb: 2 }}>
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
                <GrAdd style={{ marginLeft: "15px" }} size={28} />
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
