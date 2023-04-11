import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

type Props = {
  isOpen: boolean;
  children: JSX.Element;
  size?: "sm" | "md" | "lg";
  modalWidth?: string;
};

const sizeList: { [key: string]: string } = {
  sm: "350px",
  md: "700px",
  lg: "900px"
};

function CustomModal(props: Props) {
  const { isOpen, children, size, modalWidth } = props;
  return (
    <div>
      {isOpen ? (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isOpen}
          closeAfterTransition
        >
          <Fade in={isOpen}>
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { md: modalWidth, xs: "80%" },
                height: { md: !!size ? sizeList[size] : "auto", xs: "sm" },
                bgcolor: "background.paper",
                border: "2px solid #67A3EE",
                borderRadius: "10px",
                boxShadow: 10
              }}
            >
              {children}
            </Box>
          </Fade>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default CustomModal;
