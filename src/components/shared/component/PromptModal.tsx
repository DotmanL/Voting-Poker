import React from "react";
import Grid from "@mui/material/Grid";
import CustomModal from "components/shared/component/CustomModal";
import { AiOutlineClose } from "react-icons/ai";
import { Button, Typography } from "@mui/material";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  promptMessage: string;
  onClickConfirm: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

function PromptModal(props: Props) {
  const { isModalOpen, setIsModalOpen, promptMessage, onClickConfirm } = props;

  return (
    <Grid>
      <CustomModal
        isOpen={isModalOpen}
        customLeftPosition="40%"
        modalWidth="35vw"
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
            onClick={(event) => {
              event.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>

          <Grid
            sx={{
              height: "100%",
              mt: 4,
              px: 4,
              pt: 4,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Grid>
              <Typography
                variant="h5"
                fontSize={24}
                sx={{ textAlign: "center" }}
              >
                {promptMessage}
              </Typography>
            </Grid>
            <Grid
              sx={{
                mt: 7,
                width: "60%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Button
                variant="contained"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsModalOpen(false);
                }}
                sx={{
                  mt: 0.5,
                  px: 2,
                  py: 0.5,
                  borderRadius: "8px",
                  background: "red",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={(event) => onClickConfirm(event)}
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
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default PromptModal;
