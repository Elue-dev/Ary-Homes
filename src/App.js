import Header from "./components/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCustomAlert } from "./contexts/AlertContext";
import Alert from "./components/alert/Alert";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/utilities/ScrollToTop";
import GoToTopButton from "./components/utilities/GoToTopButton";
import AllRoutes from "./components/routes/AllRoutes";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { showAlert, alertMessage, alertType } = useCustomAlert();
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <GoToTopButton />
      <ScrollToTop />
      <Header />
      {showAlert ? <Alert message={alertMessage} type={alertType} /> : null}
      <AllRoutes />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
