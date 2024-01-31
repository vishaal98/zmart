import { Box } from "@mui/material";
import React from "react";
import "./footer.scss";
import Logo from "../../assets/icons/logo.svg";

const Footer = () => {
  return (
    <Box className="footer">
      <Box>
        <img src={Logo} alt="zmart-logo"></img>
      </Box>
      <p className="footer-text">Shop Till You Drop, the Zmart Way!</p>
    </Box>
  );
};

export default Footer;
