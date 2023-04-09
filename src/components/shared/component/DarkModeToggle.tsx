import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { Brightness7, Brightness4 } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "utility/providers/ColorContext";

function DarkModeToggle() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Toolbar variant="dense">
      <Box
        sx={{
          display: "flex"
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7 titleAccess="Light Mode" />
          ) : (
            <Brightness4 titleAccess="Dark Mode" />
          )}
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default DarkModeToggle;
