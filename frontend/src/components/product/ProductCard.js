import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./productCard.scss";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardActionArea>
        <CardMedia
          component="img"
          image={product.image}
          width={"50px"}
          height={"250px"}
          aria-label="stars"
        />
        <CardContent>
          <Typography>{product.name}</Typography>
          <Typography>
            <b>${product.cost}</b>
          </Typography>
          <Rating name="read-only" value={product.rating} />
        </CardContent>
      </CardActionArea>
      <CardActions className="card-actions">
        <Button
          variant="contained"
          className="card-button"
          onClick={handleAddToCart}
        >
          <ShoppingCartIcon />
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
