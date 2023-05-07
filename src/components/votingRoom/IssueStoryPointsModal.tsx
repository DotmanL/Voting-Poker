import React from "react";
import Grid from "@mui/material/Grid";
import { IIssue } from "interfaces/Issues";
import { SxProps, Theme } from "@mui/material";

type Props = {
  issue: IIssue;
  setIsStoryPointsDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isStoryPointsDropDownOpen: boolean;
  storyPointsDropDownRef: React.RefObject<HTMLDivElement>;
  cardValues: (string | number)[];
  handleAddStoryPoints(cardValue: number | string): Promise<void>;
  storyPointCardStyle?: SxProps<Theme> | undefined;
};

function IssueStoryPointsModal(props: Props) {
  const {
    issue,
    setIsStoryPointsDropDownOpen,
    storyPointsDropDownRef,
    isStoryPointsDropDownOpen,
    cardValues,
    handleAddStoryPoints,
    storyPointCardStyle
  } = props;

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
          background: (theme) =>
            theme.palette.mode === "dark" ? "#151e22" : "#FFFFFF",
          borderRadius: "50%",
          fontSize: "20px",
          width: "30px",
          height: "30px"
        }}
        onClick={(event) => {
          setIsStoryPointsDropDownOpen(!isStoryPointsDropDownOpen);
          event.stopPropagation();
        }}
      >
        {!!issue.storyPoints ? issue.storyPoints : "-"}
      </Grid>
      <Grid
        sx={
          !!storyPointCardStyle
            ? storyPointCardStyle
            : {
                position: "absolute",
                left: 10,
                marginTop: "-40px",
                zIndex: 700
              }
        }
        ref={storyPointsDropDownRef}
      >
        {isStoryPointsDropDownOpen && (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              width: { md: "320px", xs: "250px" },
              height: { md: "250px", xs: "auto" },
              borderRadius: "10px",
              zIndex: 700,
              py: { md: 1, xs: 0.5 },
              cursor: "pointer",
              background: (theme) =>
                theme.palette.mode === "dark" ? "#000814" : "#fdf0d5",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 0px 10px 2px rgba(255, 255, 255, 0.1)"
                  : "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                border: "1px solid #FFFFFF"
              }
            }}
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                height: "100%",
                px: 1,
                py: 1
              }}
            >
              {cardValues.map((cardValue, index) => (
                <Grid
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#000814" : "#fdf0d5",
                    alignItems: "center",
                    justifyContent: "center",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "white" : "black",
                    borderRadius: "50%",
                    mx: 0.5,
                    my: 0.2,
                    fontSize: "20px",
                    width: "45px",
                    height: "45px",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0px 0px 10px 2px rgba(255, 255, 255, 0.1)"
                        : "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      border: "primary.main",
                      opacity: 0.8
                    }
                  }}
                  onClick={(event) => {
                    handleAddStoryPoints(cardValue);
                    event.stopPropagation();
                  }}
                >
                  {cardValue}
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default IssueStoryPointsModal;
