import React, { useEffect } from "react";
import Header from "../components/header/Header";
import Thanks from "../components/thanks/Thanks";
import { useLocation, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const ThanksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      enqueueSnackbar("Add products in the cart to checkout", {
        variant: "warning",
      });
      navigate("/");
    }
  }, [location]);

  if (location.state) {
    return (
      <>
        <Header />
        <Thanks />
      </>
    );
  }
};

export default ThanksPage;
