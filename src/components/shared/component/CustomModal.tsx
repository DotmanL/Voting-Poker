import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

type Props = {
  isOpen: boolean;
  children: JSX.Element;
  size?: "sm" | "md" | "lg";
  modalWidth?: string;
  customLeftPosition?: string;
  borderColor?: string;
};

const sizeList: { [key: string]: string } = {
  sm: "300px",
  md: "800px",
  lg: "900px"
};

function CustomModal(props: Props) {
  const { isOpen, children, size, modalWidth, customLeftPosition } = props;
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
                left: !!customLeftPosition ? customLeftPosition : "50%",
                transform: "translate(-50%, -50%)",
                width: { md: modalWidth, xs: "80%" },
                height: { md: !!size ? sizeList[size] : "auto", xs: "sm" },
                background: (theme) => theme.palette.secondary.main,
                border: "1.5px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(91, 147, 217, 0.25)",
                borderRadius: "16px",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 24px 48px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)"
                    : "0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06)"
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
