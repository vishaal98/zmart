import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Google from "../../assets/icons/google.svg";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { useTheme } from "@emotion/react";
import axios from "../../api/axios";
import Axios from "axios";

export default function Login({ handleClose }) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const loginUser = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("v1/auth/login/", data);
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem(
        "token",
        JSON.stringify(response.data.tokens.access.token)
      );
      setIsLoading(false);
      handleClose();
      window.location.reload();
    } catch (err) {
      console.log("Error logging in the user: ", err);
      if (err.response.status === 401) {
        setError("email", { message: err.response.data.message });
      }
    }
  };

  const googleHandler = async () => {
    // const response = await Axios.get("http://localhost:8080/auth/google/");
    // const response = await axios.get("auth/google/");
    window.location.href = "http://127.0.0.1:8080/auth/google/";
    // console.log(response.data);
  };

  const loginHandler = async () => {};

  return (
    <>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <form component="form" onSubmit={handleSubmit(loginUser)}>
          <TextField
            fullWidth
            label="Email"
            {...register("email", {
              required: { value: true, message: "Email cannot be empty" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password", {
              required: { value: true, message: "Password cannot be empty" },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth={true}
            sx={{
              mt: "20px",
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.dark,
              "&:hover": { backgroundColor: "#ACA5D3" },
            }}
          >
            {isLoading ? <CircularProgress /> : "Login"}
          </Button>
        </form>
        <h4 style={{ color: theme.palette.primary.dark, textAlign: "center" }}>
          OR
        </h4>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          startIcon={<img src={Google} alt="Google" />}
          onClick={googleHandler}
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.google,
            "&:hover": { backgroundColor: "#D97567" },
          }}
        >
          Google
        </Button>
      </DialogContent>
    </>
  );
}
