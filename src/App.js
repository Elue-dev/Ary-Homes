import Header from "./components/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Blog from "./pages/blog/Blog";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import About from "./pages/about/About";
import Footer from "./components/footer/Footer";
import Contact from "./pages/contact/Contact";
import Verify from "./pages/auth/Verify";
import ProtectedRoute from "./components/protected_route/ProtectedRoute";
import AdminOnlyRoute from "./components/admin_only/AdminOnlyRoute";
import Admin from "./pages/admin/Admin";
import Reset from "./pages/auth/Reset";
import Alert from "./components/alert/Alert";
import { useCustomAlert } from "./contexts/AlertContext";
import Account from "./pages/user_account/Account";

function App() {
  const { showAlert, alertMessage, alertType } = useCustomAlert();

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        {showAlert ? <Alert message={alertMessage} type={alertType} /> : null}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<Reset />} />
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
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
