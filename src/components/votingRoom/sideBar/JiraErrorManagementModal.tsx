import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import { Tooltip, Typography } from "@mui/material";
import { userContext } from "App";
import SettingsIcon from "@mui/icons-material/Settings";

type Props = {
  isJiraErrorManagementModalOpen: boolean;
  setIsJiraErrorManagementModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setIsJiraManagementModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function JiraErrorManagementModal(props: Props) {
  const {
    isJiraErrorManagementModalOpen,
    setIsJiraErrorManagementModalOpen,
    setIsJiraManagementModalOpen
  } = props;
  const user = useContext(userContext);

  return (
    <Grid>
      <CustomModal
        isOpen={isJiraErrorManagementModalOpen}
        customLeftPosition="40%"
        modalWidth="45vw"
        size="sm"
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
              setIsJiraErrorManagementModalOpen(false);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>

          <Grid
            sx={{
              height: "100%",
              mt: 2,
              px: 4,
              pt: 4,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Grid>
              <Typography variant="h5" fontSize={24}>
                Errors could either be due to the{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>
                  "{user?.storyPointsField}",{" "}
                </span>
                field{" "}
                <span>
                  <Tooltip arrow title="Reconfigure StoryPoints field">
                    <SettingsIcon
                      onClick={() => {
                        setIsJiraManagementModalOpen(true);
                      }}
                      sx={{ color: "green", cursor: "pointer", width: 32 }}
                    />
                  </Tooltip>
                </span>{" "}
                is not the appropriate story points field for your JIRA site or
                the selected story points field is not configured to a screen on
                JIRA
                <br />
                <p>
                  For the latter case, please follow the instructions in this{" "}
                  <Link
                    href={
                      "https://support.atlassian.com/jira-cloud-administration/docs/add-a-custom-field-to-a-screen/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      "&:hover": {
                        color: "green"
                      }
                    }}
                  >
                    link
                  </Link>
                </p>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraErrorManagementModal;
