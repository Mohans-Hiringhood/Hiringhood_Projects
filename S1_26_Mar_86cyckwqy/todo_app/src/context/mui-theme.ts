import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#6C63FF",
        dark: "#5850DD",
      },
      secondary: {
        main: "#FF6584",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#FFFFFF" : "#000000",
        secondary: mode === "dark" ? "#B0B0B0" : "#555555",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#6C63FF",
              },
              "&:hover fieldset": {
                borderColor: "#5850DD",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6C63FF",
              },
            },
          },
        },
      },
    },
  });
};