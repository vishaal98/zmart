import { Box, Grid, InputAdornment, TextField } from "@mui/material";
import Header from "../components/header/Header";
import Products from "../components/product/Products";
import axios from "../api/axios";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const LandingPage = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async (text) => {
    setIsLoading(true);
    try {
      let res = await axios.get(`v1/products/search?value=${text}`);
      setFilteredProducts(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        setFilteredProducts([]);
      }
    }
    setIsLoading(false);
  };

  const debounceSearch = (event, debounceTimeout) => {
    let value = event.target.value;
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => performSearch(value), 500));
  };

  return (
    <div className="landing-page">
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
            style: {
              borderColor: "#ffffff",
              color: theme.palette.primary.dark,
              backgroundColor: "#ffffff",
            },
          }}
          placeholder="Search for products"
          name="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            debounceSearch(event, debounceTimeout);
          }}
        />
      </Header>
      <Products
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        showHeroimage={!Boolean(search)}
      />
    </div>
  );
};

export default LandingPage;
