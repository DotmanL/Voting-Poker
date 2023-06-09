import { Theme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export const getDesignTokens = (mode: PaletteMode) => ({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          // backgroundColor: "#FEFAE0",
          backgroundColor: mode === "light" ? "#e9ecef" : "#151e22"
        }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: undefined },
          style: {
            textTransform: "none"
          } as const
        }
      ]
    }
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#67A3EE"
          },
          secondary: {
            // main: "#edf2f4"
            main: "#e9ecef"
          },
          error: {
            main: red[500]
          }
        }
      : {
          primary: {
            main: "#FFFFFF"
          },
          secondary: {
            main: "#151e22"
          },
          error: {
            main: red[500]
          }
        })
  },
  spacing: (value: number) => `${value * 10}px`,
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      "Aleo",
      "Montserrat",
      "Montserrat Alternates",
      "Roboto",
      "Jost"
    ].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 900
  }
});
