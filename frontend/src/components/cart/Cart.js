import { ShoppingCart, ShoppingCartOutlined } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.scss";
import ItemQuantity from "./ItemQuantity";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return [];
  const cartItem = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.product === product._id),
  }));

  return cartItem;
};

export const getTotalCartValue = (items = []) => {
  let totalValue = 0;
  for (let i = 0; i < items.length; i++) {
    totalValue += items[i].quantity * items[i].cost;
  }
  return totalValue;
};

const Cart = ({
  products,
  items,
  isReadOnly,
  handleQuantity,
  isCartLoading,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tempQuantity, setTempQuantity] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  // const history = useHistory();

  const debounce = (debounceTimeout, item, quantity) => {
    console.log("in debounce", item);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(
      setTimeout(async () => {
        await handleQuantity(token, items, products, item.product, quantity);
        setTempQuantity(null);
      }, 800)
    );
  };

  if (isCartLoading) {
    return (
      <Box className="cart empty">
        <CircularProgress />
      </Box>
    );
  }

  if (!items || !items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items?.map((item) =>
          item.quantity > 0 ? (
            <Box
              key={item._id}
              display="flex"
              alignItems="flex-start"
              padding="1rem"
              paddingBottom="3rem"
            >
              <Box className="image-container">
                <img
                  // Add product image
                  src={item.image}
                  // Add product name as alt eext
                  alt={item.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{item.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isReadOnly ? (
                    <p>Qty: {item.quantity}</p>
                  ) : (
                    <ItemQuantity
                      value={item.quantity}
                      // Add required props by checking implementation
                      handleAdd={async () => {
                        let updatedQuantity =
                          (tempQuantity ?? item.quantity) + 1;
                        setTempQuantity(updatedQuantity);
                        debounce(debounceTimeout, item, updatedQuantity);
                      }}
                      handleDelete={async () => {
                        let updatedQuantity =
                          (tempQuantity ?? item.quantity) - 1;
                        setTempQuantity(updatedQuantity);
                        debounce(debounceTimeout, item, updatedQuantity);
                      }}
                    />
                  )}
                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null
        )}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          {!isReadOnly ? (
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default Cart;
