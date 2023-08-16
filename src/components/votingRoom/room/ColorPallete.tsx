import React, { useState, useRef, useContext } from "react";
import Grid from "@mui/material/Grid";
import { Tooltip } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import { useClickAway } from "react-use";
import { IssueContext } from "utility/providers/IssuesProvider";
import { IRoomUsers } from "interfaces/RoomUsers";
import { IUser } from "interfaces/User/IUser";

type Props = {
  currentUser: IUser | undefined;
  currentRoomUser: IRoomUsers | undefined;
  handleChangeColor: (newColor: string, userId: string) => Promise<void>;
};

function ColorPallete(props: Props) {
  const { currentRoomUser, handleChangeColor, currentUser } = props;
  const [isColorPalleteOpen, setIsColorPalleteOpen] = useState<boolean>(false);
  const { activeIssue } = useContext(IssueContext);

  const presetColors = [
    "#67A3EE",
    "#FF0000",
    "#0000FF",
    "#FF6600",
    "#00FF00",
    "#6600FF",
    "#808080",
    "#00B8EA",
    "#FC0FC0"
  ];

  const colorPalleteRef = useRef<HTMLDivElement>(null);

  useClickAway(colorPalleteRef, () => {
    setIsColorPalleteOpen(false);
  });

  return (
    <Grid
      ref={colorPalleteRef}
      sx={{
        position: "absolute",
        top: !!activeIssue ? "25vh" : "18vh",
        left: 80,
        width: "60px",
        height: "60px",
        display: { md: "flex", xs: "none" },
        flexDirection: "row",
        borderRadius: "50%",
        border: `2px solid ${currentRoomUser?.cardColor}`,
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          transition: "box-shadow 0.3s ease-in-out",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0px 0px 10px 2px rgba(255, 255, 255, 0.8)"
              : "0px 0px 10px 2px rgba(0, 0, 0, 0.4)"
        }
      }}
    >
      <Tooltip title="Change Card Color">
        <PaletteIcon
          onClick={() => setIsColorPalleteOpen(!isColorPalleteOpen)}
          sx={{ width: "60px", height: "60px" }}
        />
      </Tooltip>

      <Grid
        sx={{
          position: "absolute",
          top: "3vh",
          left: 65,
          width: "auto",
          height: "auto",
          display: { md: "flex", xs: "none" },
          flexDirection: "row",
          cursor: "pointer",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {isColorPalleteOpen && (
          <Grid
            sx={{
              display: { md: "flex", xs: "none" },
              flexDirection: "row"
            }}
          >
            <Grid
              sx={{
                backgroundColor: (theme) => theme.palette.secondary.main,
                border: `1px solid ${currentRoomUser?.cardColor}`,
                borderRadius: "6px",
                width: "180px",
                height: "180px",
                flexWrap: "wrap",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mt: 0.5,
                px: 1,
                py: 0.5
              }}
            >
              {presetColors.map((presetColor) => (
                <Grid
                  key={presetColor}
                  sx={{
                    background: presetColor,
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    m: 0.25
                  }}
                  onClick={() =>
                    handleChangeColor(presetColor, currentUser?._id!)
                  }
                />
              ))}
            </Grid>
            <Grid
              sx={{
                ml: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "180px"
              }}
              onClick={() => handleChangeColor("#67a3ee", currentUser?._id!)}
            >
              <Tooltip title="Reset Color">
                <FormatColorResetIcon />
              </Tooltip>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ColorPallete;
