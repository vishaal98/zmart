import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./thanks.scss";

const Thanks = () => {
  const navigate = useNavigate();
  const { walletMoney } = JSON.parse(localStorage.getItem("user"));

  const routeToProducts = () => {
    navigate("/");
  };

  return (
    <>
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">${walletMoney} Available</p>
        <Button
          variant="contained"
          size="large"
          id="continue-btn"
          onClick={routeToProducts}
        >
          Continue Shopping
        </Button>
      </Box>
    </>
  );
};

export default Thanks;
