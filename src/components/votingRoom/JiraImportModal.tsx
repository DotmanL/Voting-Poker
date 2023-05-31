import React, { useContext } from "react";
import { Button, Grid, Typography } from "@mui/material";
import CustomModal from "components/shared/component/CustomModal";
import { Link, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import CryptoJS from "crypto-js";

import { userContext } from "App";

type Props = {
  isJiraImportModalOpen: boolean;
  setIsJiraImportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validityText: string;
};

type RoomRouteParams = {
  roomId: string;
};

function JiraImportModal(props: Props) {
  const { isJiraImportModalOpen, setIsJiraImportModalOpen, validityText } =
    props;
  const user = useContext(userContext);
  const { roomId } = useParams<RoomRouteParams>();

  const hashUserId = () => {
    const hashedUserId = CryptoJS.SHA256(user?._id!).toString();
    return hashedUserId + "_" + roomId;
  };

  const authUrl = () => {
    let url;
    switch (process.env.NODE_ENV) {
      case "production":
        url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=z3uY8LNXLI6xcRUka1dkwDefZ9WQ0li3&scope=offline_access%20read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Fdot-voting.netlify.app%2Froom%2FjiraCallback&state=${hashUserId()}&response_type=code&prompt=consent`;
        break;
      case "development":
      default:
        url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=W5ABmGr1EIbvFo4oTTrDtVBq26Ts4WyF&scope=offline_access%20read%3Ajira-work%20write%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20manage%3Ajira-webhook%20manage%3Ajira-data-provider&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Froom%2FjiraCallback&state=${hashUserId()}&response_type=code&prompt=consent`;
    }

    return url;
  };

  return (
    <Grid>
      <CustomModal isOpen={isJiraImportModalOpen} modalWidth="40vw">
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
              setIsJiraImportModalOpen(!setIsJiraImportModalOpen);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>
          <Grid
            sx={{
              mt: 5,
              mb: 4,
              display: "flex",
              flexDirection: "column",
              height: "400px"
            }}
          >
            <Grid
              sx={{
                mt: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Typography variant="h3">Import your issues from Jira</Typography>
            </Grid>

            <Grid sx={{ mt: 5 }}>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ textAlign: "center" }}
              >
                We need to authenticate you first and we shall get right to
                importing your issues.
              </Typography>
            </Grid>

            <Grid sx={{ mt: 8 }}>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  px: { md: 12, xs: 0 },
                  mb: 5,
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    px: { md: 4, xs: 2 },
                    fontSize: { md: "20px", xs: "12px" }
                  }}
                  onClick={() => {
                    setIsJiraImportModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Link
                  // to={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=W5ABmGr1EIbvFo4oTTrDtVBq26Ts4WyF&scope=offline_access%20read%3Ajql%3Ajira%20write%3Aissue%3Ajira%20read%3Aissue%3Ajira%20validate%3Ajql%3Ajira%20read%3Afilter%3Ajira%20write%3Afilter%3Ajira%20delete%3Afilter%3Ajira%20read%3Afield%3Ajira%20read%3Afield.default-value%3Ajira%20read%3Afield.option%3Ajira%20read%3Apriority%3Ajira%20read%3Aissue-link%3Ajira%20read%3Aremote-link%3Ajira-software%20read%3Aissue.vote%3Ajira%20write%3Aissue.vote%3Ajira%20read%3Aissue.votes%3Ajira%20read%3Aissue-type%3Ajira%20write%3Aissue-type%3Ajira%20read%3Aproject-category%3Ajira%20read%3Aissue%3Ajira-software%20read%3Aproject-type%3Ajira%20read%3Aavatar%3Ajira%20read%3Aissue-meta%3Ajira%20read%3Afield-configuration%3Ajira%20write%3Afield-configuration%3Ajira%20write%3Aissue-link%3Ajira%20read%3Aissue-details%3Ajira%20write%3Aissue%3Ajira-software&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Froom%2FjiraCallback&state=${hashUserId()}&response_type=code&prompt=consent`}
                  to={authUrl()}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    sx={{
                      px: { md: 4, xs: 2 },
                      fontSize: { md: "20px", xs: "12px" }
                    }}
                  >
                    {validityText ? validityText : "Submit"}
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default JiraImportModal;
