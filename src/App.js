import Header from "./components/header/Header";
import { BrowserRouter } from "react-router-dom";
import { useCustomAlert } from "./contexts/AlertContext";
import Alert from "./components/alert/Alert";
import ScrollToTop from "./components/utilities/ScrollToTop";
import GoToTopButton from "./components/utilities/GoToTopButton";
import AllRoutes from "./components/routes/AllRoutes";
import AddPostAlert from "./pages/blog/AddPostAlert";
import { useState } from "react";

function App() {
  const { showAlert, alertMessage, alertType } = useCustomAlert();
  const [showPopup, setShowPopup] = useState(false);

  window.setTimeout(() => {
    setShowPopup(true);
  }, 5000);

  return (
    <BrowserRouter>
      <GoToTopButton />
      <ScrollToTop />
      <Header />
      {/* {showPopup ? <AddPostAlert /> : null} */}
      {showAlert ? <Alert message={alertMessage} type={alertType} /> : null}
      <AllRoutes />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
