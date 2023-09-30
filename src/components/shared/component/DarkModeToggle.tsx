import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "utility/providers/ColorContext";
import { Grid } from "@mui/material";

type Props = {
  isMobileFlex?: boolean;
};

function DarkModeToggle(props: Props) {
  const { isMobileFlex = false } = props;
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const icon =
    theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />;
  // const isDarkMode = theme.palette.mode === "dark";

  return (
    <Grid
      sx={{
        display: "flex",
        width: "100%"
      }}
    >
      {!isMobileFlex ? (
        <>
          {/* <Switch
            checked={isDarkMode}
            sx={{
              background: (theme) => theme.palette.secondary.main
            }}
            onClick={colorMode.toggleColorMode}
          /> */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {icon}
          </IconButton>
        </>
      ) : (
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <IconButton
            onClick={colorMode.toggleColorMode}
            color="inherit"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: 0.5
            }}
          >
            {icon}
          </IconButton>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "24px",
              width: "100%"
            }}
          >
            {theme.palette.mode === "dark" ? "Dark Mode" : "Light Mode"}
          </Grid>
          {/* <Grid>
            <Switch
              checked={isDarkMode}
              sx={{
                background: (theme) => theme.palette.secondary.main
              }}
              onClick={colorMode.toggleColorMode}
            />
          </Grid> */}
        </Grid>
      )}
    </Grid>
  );
}

export default DarkModeToggle;
