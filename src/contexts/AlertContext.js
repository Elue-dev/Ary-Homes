import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useCustomAlert = () => {
    return useContext(AlertContext)
}

export const AlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const values = {
    showAlert,
    alertMessage,
    alertType,
    setShowAlert,
    setAlertMessage,
    setAlertType,
  };

  return (
    <AlertContext.Provider value={values}>{children}</AlertContext.Provider>
  );
};
