import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Login from "../login/Login";
import Register from "../register/Register";
import { useTheme } from "@emotion/react";
import Logo from "../../assets/icons/logo.svg";
import "./header.scss";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

const Header = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { window: screen, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userToken = localStorage.getItem("token");

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ZMART
      </Typography>
      <Divider />
      <List>
        <ListItem key="Login" disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Register" disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem key="Profile" disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    screen !== undefined ? () => screen().document.body : undefined;

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleClickOpen = (buttonType) => {
    if (buttonType === "login") {
      setLoginOpen(true);
    } else {
      setRegisterOpen(true);
    }
  };
  const handleClose = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <Box className="header-position">
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{ position: "inherit", background: theme.palette.primary.dark }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="div"
              sx={{
                // flexGrow: 1,
                display: { xs: "none", sm: "block" },
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <img
                src={Logo}
                style={{ height: "35px" }}
                alt="Z-mart Logo"
              ></img>
            </Box>
            {children && <Box sx={{ width: "30rem" }}>{children}</Box>}
            {userToken ? (
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    key="Profile"
                    sx={{ color: "#fff" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    key="Profile"
                    sx={{ color: "#fff" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    key="Login"
                    sx={{ color: "#fff" }}
                    onClick={() => handleClickOpen("login")}
                  >
                    Login
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    key="Register"
                    sx={{ color: "#fff" }}
                    onClick={() => handleClickOpen("register")}
                  >
                    Register
                  </Button>
                </Box>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
      <Dialog open={loginOpen} onClose={handleClose}>
        <Login handleClose={handleClose} />
      </Dialog>
      <Dialog open={registerOpen} onClose={handleClose}>
        <Register handleClose={handleClose} />
      </Dialog>
    </>
  );
};

Header.propTypes = {
  window: PropTypes.func,
};

export default Header;
