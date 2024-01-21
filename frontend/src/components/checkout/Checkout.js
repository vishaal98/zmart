import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import Cart, { generateCartItemsFrom, getTotalCartValue } from "../cart/Cart";
import { enqueueSnackbar } from "notistack";
import axios from "../../api/axios";
import AddNewAddressView from "./AddNewAddressView";
import { CreditCard, Delete } from "@mui/icons-material";
import "./checkout.scss";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem("token");
  const { walletMoney, _id: userId } = JSON.parse(localStorage.getItem("user"));
  // const history = useHistory();
  //   const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({
    all: [],
    selected: "",
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get("v1/products/productList");
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await axios.get("v1/cart/getcart");
      if (response.data.length === 0) {
        enqueueSnackbar("Add items to the cart to checkout", {
          variant: "warning",
        });
        navigate("/");
        return;
      }

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  const getAddresses = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`v1/users/${userId}?q=address`);
      setAddresses({ ...addresses, all: response.data.address });
      return response.data.address;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  const addAddress = async (newAddress) => {
    try {
      let url = `v1/users/${userId}`;
      let res = await axios.put(url, newAddress);
      console.log(res.data.address);
      setAddresses({ ...addresses, all: res.data.address });
      setIsAddingNewAddress(false);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      let res = await axios.delete(`v1/users/deleteAddress/${addressId}`);
      console.log("delte add: ", res.data);
      setAddresses({ ...addresses, all: res.data });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const validateRequest = (items, addresses) => {
    if (walletMoney < getTotalCartValue(items)) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }
    if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }
    if (addresses.selected === "") {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const performCheckout = async (items, addresses) => {
    if (!validateRequest(items, addresses)) return;
    try {
      let res = await axios.post(`v1/cart/checkout`, {
        addressId: addresses.selected,
      });
      enqueueSnackbar("Order placed successfully!", { variant: "success" });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // history.push("/thanks");
      navigate("/thanks", { state: true });
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not place the order. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart();

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      getAddresses(token);
    } else {
      enqueueSnackbar("You must be logged in to access checkout page", {
        variant: "info",
      });
      // history.push("/");
    }
  }, [token]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {addresses.all.length ? (
                addresses.all.map((address) => (
                  <Box
                    className={
                      addresses.selected === address._id
                        ? "address-item selected"
                        : "address-item not-selected"
                    }
                    key={address._id}
                    onClick={() =>
                      setAddresses({ ...addresses, selected: address._id })
                    }
                  >
                    <Typography>{address.street}</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Delete />}
                      onClick={async () => {
                        await deleteAddress(address._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography my="1rem">
                  No addresses found for this account. Please add one to proceed
                </Typography>
              )}
            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            {!isAddingNewAddress ? (
              <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  setIsAddingNewAddress(true);
                }}
              >
                Add new address
              </Button>
            ) : (
              <AddNewAddressView
                handleCancel={() => {
                  setIsAddingNewAddress(false);
                }}
                addAddress={addAddress}
              />
            )}

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available ${walletMoney}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={async () => await performCheckout(items, addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid
          className="cart-parent"
          item
          xs={12}
          md={3}
          backgroundColor={theme.palette.primary.light}
        >
          <Cart isReadOnly products={products} items={items} />
          <Box className="cart" paddingX={3}>
            <Box spacing={2} display="flex" flex-direction="column">
              <h2>Order Details</h2>
            </Box>
            <Stack>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <p>Products</p>
                <p>{items.length}</p>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <p>Subtotal</p>
                <p>${getTotalCartValue(items)}</p>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <p>Shipping</p>
                <p>$0</p>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <p>
                  <b>Total</b>
                </p>
                <p>
                  <b>${getTotalCartValue(items)}</b>
                </p>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </>
  );
};

export default Checkout;
