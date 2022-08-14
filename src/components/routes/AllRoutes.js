import { Routes, Route, useLocation } from "react-router-dom";
import Error404 from "../../pages/404/Error404";
import Admin from "../../pages/admin/Admin";
import Login from "../../pages/auth/Login";
import Reset from "../../pages/auth/Reset";
import Signup from "../../pages/auth/Signup";
import Verify from "../../pages/auth/Verify";
import Blog from "../../pages/blog/Blog";
import Bookmarks from "../../pages/bookmarks/Bookmarks";
import Contact from "../../pages/contact/Contact";
import Home from "../../pages/home/Home";
import Account from "../../pages/user_account/Account";
import AdminOnlyRoute from "../admin_only/AdminOnlyRoute";
import PropertyDetail from "../property_detail/PropertyDetail";
import ProtectedRoute from "../protected_route/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

export default function AllRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route
          path="/user/admin/*"
          element={
            <AdminOnlyRoute>
              <Admin />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/account/:uid"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/blog" element={<Blog />} />
        {/* <Route
      path="/bookmarks"
      element={
        <ProtectedRoute>
          <Bookmarks />
        </ProtectedRoute>
      }
    /> */}
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AnimatePresence>
  );
}
