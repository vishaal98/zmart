import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Google from "../../assets/icons/google.svg";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function Login({ handleClose }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  const googleHandler = async () => {
    // login || singup
  };

  const loginHandler = async () => {};

  return (
    <>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <form
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
            label="Email"
            {...register("email", {
              required: { value: true, message: "Email cannot be empty" },
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
          {/* <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress /> : "SignUp"}
        </Button> */}
          {/* <Button type="submit">Submit</Button> */}
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
            Login
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

      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions> */}
    </>
  );
  //   <Dialog open={open} onClose={handleClose}></Dialog>;
}
