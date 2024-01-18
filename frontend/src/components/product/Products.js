import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
// import products from "../../assets/data/data";
import ProductCard from "./ProductCard";
import { enqueueSnackbar } from "notistack";
import Cart, { generateCartItemsFrom } from "../cart/Cart";
import { useTheme } from "@emotion/react";
import axios from "../../api/axios";

const Products = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("v1/products/productList");
      setProducts(response.data);
      setFilteredProducts(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching the products: ", err);
      enqueueSnackbar("Failed to get products", { variant: "error" });
    }
  };

  const fetchCart = async () => {
    setIsCartLoading(true);
    try {
      let res = await axios.get("v1/cart/getcart");
      const cartData = generateCartItemsFrom(res.data, products);
      setCartItems(cartData);
      setIsCartLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  useEffect(() => {
    if (token) fetchCart(setCartItems);
  }, [products]);

  const isItemInCart = (items, productId) => {
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].product === productId) return true;
      }
    }
    return false;
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    try {
      let data = { productId: productId, quantity: qty };
      console.log(data);
      let res = await axios.post("v1/cart/addtocart", data);

      setCartItems(
        generateCartItemsFrom(res.data.updatedCart.cartItems, products)
      );
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        console.log(error);
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const handleQuantity = async (token, items, products, item_id, item_qty) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    try {
      let data = { productId: item_id, quantity: item_qty };
      console.log("before update api: ", data);
      let res = await axios.put("v1/cart/updatecart", data);
      console.log("after update api: ", res.data);
      setCartItems(
        generateCartItemsFrom(res.data.updatedCart.cartItems, products)
      );
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        console.log(error);
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <Grid container sx={{ mt: "64px" }}>
      <Grid item md={token ? 9 : 12} sm={12}>
        <Grid container>
          <Grid item className="product-grid" sx={{ height: "400px" }}>
            <Box
              className="hero"
              // sx={{
              //   height: "inherit",
              //   display: "flex",
              //   flexDirection: "column",
              //   justifyContent: "center",
              // }}
            >
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          <Grid item md={12} sm={12}>
            {isLoading ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "40vh" }}
              >
                <CircularProgress />
                <h4>Loading Products...</h4>
              </Box>
            ) : filteredProducts?.length ? (
              <Grid
                container
                spacing={3}
                direction="row"
                alignItems="center"
                marginY={1}
                paddingX={2}
              >
                {filteredProducts?.map(function (pd) {
                  return (
                    <Grid item md={3} xs={6} key={pd._id}>
                      <ProductCard
                        product={pd}
                        handleAddToCart={
                          () =>
                            addToCart(token, cartItems, products, pd._id, 1, {
                              preventDuplicate: true,
                            })
                          //   console.log("hey i am the product Card")
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ height: "40vh" }}
              >
                <SentimentDissatisfiedIcon />
                <h4>No products found</h4>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      {token && (
        <Grid item md={3} sm={12} backgroundColor={theme.palette.primary.light}>
          <Cart
            products={products}
            items={cartItems}
            handleQuantity={handleQuantity}
            isCartLoading={isCartLoading}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Products;
