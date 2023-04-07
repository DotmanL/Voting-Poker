import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { RiArrowRightSLine } from "react-icons/ri";
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
import { SidebarContext } from "components/providers/SideBarProvider";

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
  issues: IIssue[];
};

function RightSidebar(props: Props) {
  const { issues } = props;
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isMiniDropDownOpen, setIsMiniDropDownOpen] = useState<boolean>(false);
  const [isSingleIssueTextBoxOpen, setIsSingleIssueTextBoxOpen] =
    useState<boolean>(false);
  const [isAddMultipleModalOpen, setIsAddMultipleModalOpen] =
    useState<boolean>(false);
  const [cards, setCards] = useState(issues);

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

  function handleOptionClick(label: string) {
    if (label === "addMultipleUrls") {
      setIsDropDownOpen(false);
      setIsAddMultipleModalOpen(true);
      setIsMiniDropDownOpen(false);
    }
  }

  function handleDeleteAllIssues() {
    setCards([]);
    setIsMiniDropDownOpen(false);
  }

  const list = (
    <Box
      sx={{
        width: 450,
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
          padding: "5px"
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
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
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
                  <Grid key={i}>
                    <Grid
                      sx={{
                        py: 1,
                        width: "100%",
                        height: "100%",
                        pl: "25px",
                        pr: "50px",
                        cursor: "pointer",
                        background: "#FFFFFF",
                        "&:hover": {
                          background: "#67A3EE",
                          color: "#FFFFFF",
                          transition: "box-shadow 0.3s ease-in-out",
                          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
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
              isAddMultipleModalOpen={isAddMultipleModalOpen}
              setIsAddMultipleModalOpen={setIsAddMultipleModalOpen}
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
                    px: 1,
                    cursor: "pointer",
                    background: "#FFFFFF"
                  }}
                >
                  <Grid
                    sx={{
                      width: "100%",
                      background: "secondary.main",
                      "&:hover": {
                        background: "#67A3EE",
                        color: "#FFFFFF",
                        transition: "box-shadow 0.3s ease-in-out",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
                      }
                    }}
                    onClick={() => handleDeleteAllIssues()}
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
      {cards.length <= 0 ? (
        <Grid>
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
                isSingleIssueTextBoxOpen={isSingleIssueTextBoxOpen}
                setIsSingleIssueTextBoxOpen={setIsSingleIssueTextBoxOpen}
              />
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid></Grid>
      )}
      <Grid
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Grid>
          {cards && (
            <IssuesView issues={issues} cards={cards} setCards={setCards} />
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid>
      <Button
        sx={[
          {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            background: "#67A3EE",
            cursor: isSidebarOpen ? "pointer !important" : "pointer",
            pointerEvents: isSidebarOpen ? "auto" : "initial",
            color: "secondary.main",
            px: { md: 2, xs: 1.5 },
            py: { md: 0.5, xs: 0.5 },
            fontSize: "20px",
            marginRight: isSidebarOpen ? "380px" : "0px"
          },
          {
            "&:hover": {
              color: "white",
              backgroundColor: "green"
            }
          }
        ]}
        onClick={toggleDrawer(true)}
      >
        <Typography variant="h5">Issues</Typography>
        <RiArrowRightSLine size={24} style={{ marginTop: "8px" }} />
      </Button>
      <SwipeableDrawer
        anchor={"right"}
        open={isSidebarOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{ height: "0vh" }}
        ModalProps={{
          BackdropProps: {
            invisible: true,
            sx: {
              cursor: "pointer",
              width: "100%",
              height: "20vh"
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
