import {
  Accordion,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./profile.scss";
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTheme } from "@emotion/react";
import axios from "../../api/axios";
import { enqueueSnackbar } from "notistack";
import { formatDate } from "../../utils/utils";

const Profile = () => {
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const [edit, setEdit] = useState(false);
  const [closeChangePassword, setCloseChangePassword] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [ordersList, setOrdersList] = useState([]);

  const handleExpandClick = (id) => {
    setExpanded(id);
  };

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

  const {
    register: registePassword,
    formState: { errors: passwordErrors },
    handleSubmit: handleSubmitPassword,
    watch,
    reset,
  } = useForm();

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
      //   navigate("/");
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not update the profile", { variant: "error" });
      }
    }
  };

  const handleSavePassword = async (data) => {
    try {
      const res = await axios.put(`v1/users/user/${user._id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log(res.data);
      enqueueSnackbar("Password updated Successfully!", { variant: "success" });
      reset();
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not update the password", { variant: "error" });
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

  const [passwordTableContent, setPasswordTableContent] = useState([
    {
      rowName: "Current Password",
      fieldName: "currentPassword",
      visible: false,
    },
    {
      rowName: "New Password",
      fieldName: "newPassword",
      visible: false,
    },
    {
      rowName: "Confirm New Password",
      fieldName: "confirmNewPassword",
      visible: false,
    },
  ]);

  const updatePasswordTableContent = (field) => {
    setPasswordTableContent(
      passwordTableContent.map((val) => {
        let visible;
        if (val.fieldName === field) {
          visible = !val.visible;
        }
        return {
          ...val,
          visible,
        };
      })
    );
  };

  const fetchOrderHistory = async () => {
    try {
      const res = await axios.get("v1/users/orders");
      setOrdersList(res.data.reverse());
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        enqueueSnackbar("Your session has expired, Please login again", {
          variant: "error",
        });
        window.location.reload();
        return;
      }
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not get the order details", {
          variant: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

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
          </div>
        </Accordion>
        <Accordion
          expanded={closeChangePassword}
          onChange={() => setCloseChangePassword(!closeChangePassword)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Change Password</Typography>
          </AccordionSummary>
          <div className="profile-content">
            <form
              className="profile-form"
              onSubmit={handleSubmitPassword(handleSavePassword)}
            >
              <table className="form-table">
                <tbody>
                  {passwordTableContent.map((row, index) => {
                    return (
                      <tr key={index}>
                        <th>{row.rowName}</th>
                        <td>
                          <TextField
                            className="text-field"
                            type={row.visible ? "text" : "password"}
                            placeholder={`Enter ${row.rowName}`}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {row.visible ? (
                                    <IconButton
                                      onClick={() => {
                                        updatePasswordTableContent(
                                          row.fieldName
                                        );
                                      }}
                                    >
                                      <Visibility color="primary" />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      onClick={() => {
                                        updatePasswordTableContent(
                                          row.fieldName
                                        );
                                      }}
                                    >
                                      <VisibilityOff color="primary" />
                                    </IconButton>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            {...registePassword(row.fieldName, {
                              required: {
                                value: true,
                                message: `${row.rowName} cannot be empty`,
                              },
                              pattern: row.fieldName === "newPassword" && {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message:
                                  "Password length must be 8 characters or more and contain atleast 1 upper case, 1 lower case and 1 number",
                              },
                              validate:
                                row.fieldName === "confirmNewPassword" &&
                                ((value) =>
                                  value === watch("newPassword") ||
                                  "Password do not match"),
                            })}
                            error={Boolean(passwordErrors[row.fieldName])}
                            helperText={passwordErrors[row.fieldName]?.message}
                            // sx={{
                            //   width: "100%",
                            // }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

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
                  onClick={() => setCloseChangePassword(!closeChangePassword)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>My Orders</Typography>
          </AccordionSummary>
          {ordersList?.map((order) => (
            <Card>
              <CardHeader
                title={`Order ID:  ${order._id}`}
                subheader={formatDate(order.createdAt)}
              />
              <CardContent>
                <Typography>Delivered To: </Typography>
                <Typography>{`${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`}</Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>View items</Typography>
                <IconButton
                  onClick={() => {
                    if (expanded === order._id) handleExpandClick(null);
                    else handleExpandClick(order._id);
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </CardActions>
              <Collapse
                in={expanded === order._id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Cost</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.product.name}
                            </TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">
                              {row.product.cost}
                            </TableCell>
                            <TableCell align="right">
                              {row.quantity * row.product.cost}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <b>Total Amount</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>{order.totalAmount}</b>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Profile;
