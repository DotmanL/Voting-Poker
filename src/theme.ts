import { Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

export const getDesignTokens = (mode: PaletteMode) => ({
  shape: {
    borderRadius: 12
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: mode === "light" ? "#f8f9fa" : "#141a1f"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          borderRadius: "10px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          padding: "8px 24px",
          transition: "all 0.2s ease-in-out"
        },
        contained: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.16)",
            transform: "translateY(-1px)"
          }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "all 0.25s ease-in-out"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: "8px",
          fontSize: "13px",
          padding: "8px 14px"
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow:
            mode === "light"
              ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)"
              : "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)"
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "2px 6px",
          padding: "8px 14px",
          transition: "background-color 0.15s ease"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5B93D9"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5B93D9",
            borderWidth: "2px"
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === "light" ? "#e9ecef" : "#2a2a2a",
          padding: "14px 20px"
        },
        head: {
          fontWeight: 700,
          fontSize: "13px",
          textTransform: "uppercase" as const,
          letterSpacing: "0.06em",
          color: mode === "light" ? "#6c757d" : "#8a9099"
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.15s ease",
          "&:hover": {
            backgroundColor: mode === "light" ? "#f1f3f5" : "#1e252b"
          }
        }
      }
    }
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#67A3EE",
            light: "#89B4E8",
            dark: "#3D72B8"
          },
          secondary: {
            main: "#e9ecef"
          },
          background: {
            default: "#e9ecef",
            paper: "#ffffff"
          },
          text: {
            primary: "#1a1a2e",
            secondary: "#6c757d"
          },
          divider: "#dee2e6",
          error: {
            main: "#e74c3c"
          },
          success: {
            main: "#27ae60"
          }
        }
      : {
          primary: {
            main: "#E8EAED",
            light: "#FFFFFF",
            dark: "#BDC1C6"
          },
          secondary: {
            main: "#141a1f"
          },
          background: {
            default: "#141a1f",
            paper: "#1c2329"
          },
          text: {
            primary: "#E8EAED",
            secondary: "#8a9099"
          },
          divider: "#2a3038",
          error: {
            main: "#e74c3c"
          },
          success: {
            main: "#2ecc71"
          }
        })
  },
  spacing: (value: number) => `${value * 10}px`,
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif"
    ].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em"
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.015em"
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em"
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    body1: {
      lineHeight: 1.6
    },
    body2: {
      lineHeight: 1.5
    }
  }
});
