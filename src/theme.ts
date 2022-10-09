import { createTheme, Theme } from "@mui/material/styles";
import { lightBlue, red } from "@mui/material/colors";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme { }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF"
    },
    secondary: {
      main: lightBlue[900]
    },
    error: {
      main: red[500]
    }
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
    fontWeightBold: 900,
    button: {
      textTransform: "none"
    }
  }
});

export default theme;
