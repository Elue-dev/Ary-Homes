import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useCustomAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const formatCurrency = (price) => {
    return new Intl.NumberFormat.format(price);
  };

  const values = {
    showAlert,
    alertMessage,
    alertType,
    setShowAlert,
    setAlertMessage,
    setAlertType,
    formatCurrency
  };

  return (
    <AlertContext.Provider value={values}>{children}</AlertContext.Provider>
  );
};
