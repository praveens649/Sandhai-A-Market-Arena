import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import UserLayout from "./app/(mainapp)/_components/UserLayout";
import Home from "./app/(mainapp)/home/Home";
import Products from "./app/(mainapp)/products/Products";
import ProductDetails from "./app/(mainapp)/products/ProductDetails";
import Cart from "./app/(mainapp)/cart/Cart";
import Wishlist from "./app/(mainapp)/wishlist/Wishlist";
import Orders from "./app/(mainapp)/orders/Orders";
import Profile from "./app/(mainapp)/profile/Profile";
import Checkout from "./app/(mainapp)/checkout/Checkout";
const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;