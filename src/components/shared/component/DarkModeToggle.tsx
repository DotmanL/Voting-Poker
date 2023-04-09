import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Brightness7, Brightness4 } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "utility/providers/ColorContext";
import { Switch } from "@mui/material";

function DarkModeToggle() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const icon =
    theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />;

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Toolbar variant="dense">
      <Box
        sx={{
          display: "flex"
        }}
      >
        <Switch
          checked={isDarkMode}
          sx={{
            background: (theme) => theme.palette.secondary.main
          }}
          onClick={colorMode.toggleColorMode}
        />
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {icon}
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default DarkModeToggle;
