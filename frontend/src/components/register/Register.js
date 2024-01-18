import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Google from "../../assets/icons/google.svg";
import { CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import axios from "../../api/axios";

export default function Register({ handleClose }) {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  // const onSubmit = (data) => console.log(data);

  const registerUser = async (data) => {
    try {
      const response = await axios.post("v1/auth/register/", data);
      console.log(response.data);
      localStorage.setItem(
        "token",
        JSON.stringify(response.data.tokens.access.token)
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      handleClose();
      window.location.reload();
    } catch (err) {
      console.log("Error registering the user: ", err);
      if (err.response.status === 409) {
        setError("email", { message: err.response.data.message });
      }
    }
  };

  const googleRegisterHandler = () => {};
  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  return (
    <>
      <DialogTitle>Register</DialogTitle>
      <DialogContent>
        <form
          component="form"
          onSubmit={handleSubmit(registerUser)}
          // sx={{
          //   maxWidth: "500px",
          //   padding: "20px",
          //   borderRadius: "10px",
          //   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          //   backgroundColor: "#2c2435",
          // }}
        >
          <TextField
            fullWidth
            label="Username"
            // name="name"
            {...register("name", {
              required: { value: true, message: "Name cannot be empty" },
            })}
            // value={formData.name}
            // onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            margin="normal"
            // sx={{
            //   backgroundColor: "#322a3a",
            // }}
            // InputLabelProps={{
            //   sx: { color: "#ffffff" },
            // }}
            // InputProps={{
            //   sx: { color: "#ffffff" },
            // }}
          />
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
            // sx={{
            //   backgroundColor: "#322a3a",
            // }}
            // InputLabelProps={{
            //   sx: { color: "#ffffff" },
            // }}
            // InputProps={{
            //   sx: { color: "#ffffff" },
            // }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password", {
              required: { value: true, message: "Password cannot be empty" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                message:
                  "Password length must be 6 characters or more and contain atleast 1 upper case, 1 lower case and 1 number",
              },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            margin="normal"
            // sx={{
            //   backgroundColor: "#322a3a",
            // }}
            // InputLabelProps={{
            //   sx: { color: "#ffffff" },
            // }}
            // InputProps={{
            //   sx: { color: "#ffffff" },
            // }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: { value: true, message: "Password do not match" },
              validate: (value) =>
                value === watch("password") || "Password do not match",
            })}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            margin="normal"
            // sx={{
            //   backgroundColor: "#322a3a",
            // }}
            // InputLabelProps={{
            //   sx: { color: "#ffffff" },
            // }}
            // InputProps={{
            //   sx: { color: "#ffffff" },
            // }}
          />
          {/* <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress /> : "SignUp"}
        </Button> */}
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
            Register
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
          onClick={googleRegisterHandler}
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.google,
            "&:hover": { backgroundColor: "#D97567" },
          }}
        >
          Sign in with Google
        </Button>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        
      </DialogActions> */}
    </>
  );
  //   <Dialog open={open} onClose={handleClose}></Dialog>;
}
