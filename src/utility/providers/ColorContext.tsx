import React from "react";

interface IColorModeContext {
  toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: () => {}
});
