import Header from "./components/header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCustomAlert } from "./contexts/AlertContext";
import Alert from "./components/alert/Alert";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/utilities/ScrollToTop";
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
