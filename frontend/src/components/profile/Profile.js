import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import "./profile.scss";
import { ExpandMore } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import axios from "../../api/axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const [edit, setEdit] = useState(false);
  const handleEdit = () => setEdit(!edit);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...user,
    },
  });

  const handleSave = async (data) => {
    const { walletMoney: toBeRemoved, ...userDataToUpdate } = data;
    try {
      const res = await axios.put(
        `v1/users/user/${user._id}`,
        userDataToUpdate
      );
      console.log(res.data);
      enqueueSnackbar("Profile updated Successfully!", { variant: "success" });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not update the profile", { variant: "error" });
      }
    }
  };

  const tableContent = [
    {
      rowName: "Name",
      fieldName: "name",
      disabled: false,
    },
    {
      rowName: "Email",
      fieldName: "email",
      disabled: true,
    },
    {
      rowName: "Wallet Money",
      fieldName: "walletMoney",
      disabled: true,
    },
  ];

  return (
    <div className="profile-parent">
      <div className="profile">
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Profile Settings</Typography>
          </AccordionSummary>
          <div className="profile-content">
            <form className="profile-form" onSubmit={handleSubmit(handleSave)}>
              <table className="form-table">
                <tbody>
                  {tableContent.map((row, index) => {
                    return (
                      <tr key={index}>
                        <th>{row.rowName}</th>
                        <td>
                          {edit ? (
                            <TextField
                              disabled={row.disabled}
                              placeholder={`Enter ${row.rowName}`}
                              {...register(
                                row.fieldName,
                                !row.disabled && {
                                  required: {
                                    value: true,
                                    message: "Name cannot be empty",
                                  },
                                }
                              )}
                              error={Boolean(errors[row.fieldName])}
                              helperText={errors[row.fieldName]?.message}
                              sx={{
                                width: "100%",
                              }}
                            />
                          ) : (
                            user[row.fieldName]
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {edit && (
                <div className="buttons">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.dark,
                      "&:hover": { backgroundColor: "#ACA5D3" },
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEdit}
                    // sx={{
                    //   mt: "20px",
                    //   color: theme.palette.primary.contrastText,
                    //   backgroundColor: theme.palette.primary.dark,
                    //   "&:hover": { backgroundColor: "#ACA5D3" },
                    // }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>

            {!edit && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.dark,
                  "&:hover": { backgroundColor: "#ACA5D3" },
                }}
              >
                EDIT
              </Button>
            )}
            {/* (
              <>
                <div className="details">
                  <div className="left-panel">
                    <p>Name</p>
                    <p>Email</p>
                    <p>Wallet Balance</p>
                  </div>
                  <div>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{user.walletMoney}</p>
                  </div>
                </div>
                <button
                  className="edit-button"
                  type="button"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </>
            )} */}
          </div>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Your Orders</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Profile;
