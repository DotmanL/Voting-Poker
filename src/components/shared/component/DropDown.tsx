import React from "react";
import { Grid, Link, SxProps, Theme } from "@mui/material";

interface Option {
  label: string;
  value: string;
  link: string;
}

type Props = {
  isDropDownOpen: boolean;
  options: Option[];
  sx?: SxProps<Theme> | undefined;
  children?: React.ReactNode;
};

function DropDown(props: Props) {
  const { isDropDownOpen, options, sx, children } = props;

  return (
    <Grid>
      {isDropDownOpen && (
        <Grid
          sx={
            !!sx
              ? sx
              : {
                  position: "absolute",
                  top: "90px",
                  right: "100px",
                  zIndex: 100,
                  width: "auto",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  background: "secondary.main",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
                }
          }
        >
          {!!children ? (
            <>{children}</>
          ) : (
            <>
              {options.map((option, i) => (
                <>
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
                    <Link href={option.link} color="inherit" underline="none">
                      {option.label}
                    </Link>
                  </Grid>
                </>
              ))}
            </>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default DropDown;
