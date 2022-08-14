import Header from "./components/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCustomAlert } from "./contexts/AlertContext";
import Alert from "./components/alert/Alert";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/utilities/ScrollToTop";
// import Home from "./pages/home/Home";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import Blog from "./pages/blog/Blog";
// import Bookmarks from "./pages/bookmarks/Bookmarks";
// import About from "./pages/about/About";

// import Contact from "./pages/contact/Contact";
// import Verify from "./pages/auth/Verify";
// import ProtectedRoute from "./components/protected_route/ProtectedRoute";
// import AdminOnlyRoute from "./components/admin_only/AdminOnlyRoute";
// import Admin from "./pages/admin/Admin";
// import Reset from "./pages/auth/Reset";


// import Account from "./pages/user_account/Account";

// import PropertyDetail from "./components/property_detail/PropertyDetail";
// import Error404 from "./pages/404/Error404";
import AllRoutes from "./components/routes/AllRoutes";

function App() {
  const { showAlert, alertMessage, alertType } = useCustomAlert();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      {showAlert ? <Alert message={alertMessage} type={alertType} /> : null}
      <AllRoutes />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
