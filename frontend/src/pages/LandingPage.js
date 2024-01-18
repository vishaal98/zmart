import Header from "../components/header/Header";
import Products from "../components/product/Products";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      {/* <div style={{ height: "500" }}>Browse Products</div> */}
      <Products />
    </div>
  );
};

export default LandingPage;
