import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { enqueueSnackbar } from "notistack";
import CheckoutPage from "./pages/CheckoutPage";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  if (!token)
    enqueueSnackbar("Login to access this page", { variant: "warning" });
  return token ? <Outlet /> : <Navigate to="/" />;
};

const App = () => {
  // return <LandingPage />;
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
};

export default App;
