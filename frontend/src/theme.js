import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d97742",      // rusty orange
      contrastText: "#fff"
    },
    secondary: {
      main: "#6e7f80",      // muted blue-grey
      contrastText: "#fff"
    },
    background: {
      default: "#f9f6f2",   // warm light
      paper: "#fff8f3"      // soft paper
    },
    success: {
      main: "#a3c9a8"       // soft green
    },
    warning: {
      main: "#ffe066"       // pastel yellow
    },
    error: {
      main: "#e57373"       // muted red
    },
    info: {
      main: "#6ec6ff"       // accent blue
    }
  },
  shape: {
    borderRadius: 18
  },
  typography: {
    fontFamily: "'Nunito', 'Roboto', 'Arial', sans-serif",
    h5: {
      fontWeight: 800,
      letterSpacing: "1px",
      color: "#d97742"
    },
    h6: {
      fontWeight: 700,
      color: "#6e7f80"
    },
    body1: {
      color: "#4b3f2a"
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "linear-gradient(120deg, #fff8f3 0%, #f9f6f2 100%)",
          boxShadow: "0 4px 24px 0 rgba(217,119,66,0.10)",
          borderRadius: 18,
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "0 8px 32px 0 rgba(217,119,66,0.18)"
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "0 2px 8px 0 rgba(217,119,66,0.10)",
          transition: "background 0.2s, box-shadow 0.2s",
          "&:hover": {
            background: "#b85c2e",
            boxShadow: "0 4px 16px 0 rgba(217,119,66,0.18)"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "#fff8f3",
          borderRadius: 12,
          transition: "box-shadow 0.2s, border-color 0.2s",
          "& .MuiInputBase-root": {
            color: "#4b3f2a"
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d97742"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b85c2e"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6e7f80"
          },
          "& .MuiInputLabel-root": {
            color: "#b85c2e"
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: "#fff8f3",
          borderRadius: 12,
          "&:hover": {
            background: "#ffe5d0"
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "1rem",
          background: "#d97742",
          color: "#fff"
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "background 0.2s",
          "&:hover": {
            background: "#ffe5d0"
          }
        }
      }
    }
  }
});

export default theme;