import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { Brightness7, Brightness4 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "utility/providers/ColorContext";
import { Grid, Typography } from "@mui/material";

type Props = {
  isMobileFlex?: boolean;
};

function DarkModeToggle(props: Props) {
  const { isMobileFlex = false } = props;
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";
  const icon = isDark ? <Brightness7 /> : <Brightness4 />;

  return (
    <Grid
      sx={{
        display: "flex",
        width: "100%"
      }}
    >
      {!isMobileFlex ? (
        <IconButton
          onClick={colorMode.toggleColorMode}
          color="inherit"
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1.5px solid",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.08)",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "primary.main",
              background: isDark
                ? "rgba(232, 234, 237, 0.06)"
                : "rgba(91, 147, 217, 0.06)"
            }
          }}
        >
          {icon}
        </IconButton>
      ) : (
        <Grid
          onClick={colorMode.toggleColorMode}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
            px: 1,
            py: 0.8,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "background 0.15s ease",
            "&:hover": {
              background: isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.03)"
            }
          }}
        >
          <IconButton
            color="inherit"
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: isDark
                ? "rgba(232, 234, 237, 0.06)"
                : "rgba(91, 147, 217, 0.06)",
              color: "primary.main"
            }}
          >
            {icon}
          </IconButton>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 500
            }}
          >
            {isDark ? "Dark Mode" : "Light Mode"}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default DarkModeToggle;
