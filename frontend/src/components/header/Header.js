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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Login from "../login/Login";
import Register from "../register/Register";
import { useTheme } from "@emotion/react";
import Logo from "../../assets/icons/logo.svg";
import MobileLogo from "../../assets/icons/logo-mobile.svg";
import "./header.scss";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";
import { Badge } from "@mui/material";
const drawerWidth = 240;

const Header = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { window: screen, children, handleCartToggle, cartCount } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userToken = localStorage.getItem("token");

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

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

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        height: "100%",
        color: theme.palette.primary.dark,
      }}
    >
      <Box
        component="div"
        sx={{
          // flexGrow: 1,
          display: { xs: "block", sm: "none" },
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <img
          src={MobileLogo}
          style={{ height: "35px" }}
          alt="Z-mart Logo"
        ></img>
      </Box>
      <Divider />
      <List>
        {!userToken ? (
          <>
            <ListItem key="Login" disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText
                  primary="Login"
                  onClick={() => handleClickOpen("login")}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="Register" disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText
                  primary="Register"
                  onClick={() => handleClickOpen("register")}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem key="Profile" disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText
                  primary="Profile"
                  onClick={() => navigate("/profile")}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="Logout" disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary="Logout" onClick={handleLogout} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Box className="header-position">
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{ position: "inherit", background: theme.palette.primary.dark }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <div className="icon-buttons">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              {userToken && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleCartToggle}
                  sx={{ display: { sm: "none" } }}
                >
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}
            </div>
            <Box
              component="div"
              sx={{
                // flexGrow: 1,
                display: { xs: "none", md: "block" },
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
            {children && <Box>{children}</Box>}
            {userToken ? (
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Button
                    key="Profile"
                    sx={{ color: "#fff" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
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
                <Box sx={{ display: { xs: "none", md: "block" } }}>
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
