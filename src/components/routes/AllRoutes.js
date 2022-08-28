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
import BlogDetails from "../blog_details/BlogDetails";
import AllProperties from "../../pages/all_properties/AllProperties";
import AddBlogPost from "../../pages/blog/add_blog_post/AddBlogPost";

export default function AllRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/all-properties" element={<AllProperties />} />
        <Route
          path="/admin/*"
          element={
            <AdminOnlyRoute>
              <Admin />
            </AdminOnlyRoute>
          }
        />
        <Route
          path="/user/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/:uid"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route
          path="/blog/add-blog-post"
          element={
            <ProtectedRoute>
              <AddBlogPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AnimatePresence>
  );
}
