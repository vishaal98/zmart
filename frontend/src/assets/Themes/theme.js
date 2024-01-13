import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  palette: {
    primary: {
      light: "#E0AED0",
      main: "#AC87C5",
      dark: "#756AB6",
      contrastText: "#fff",
      text: "#FFE5E5",
      google: "#c93b27",
    },
  },
});

export default theme;
