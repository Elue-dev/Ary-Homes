import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import logo from "../../assets/logo.jpg";
import { TiInfoOutline } from "react-icons/ti";
import { useCustomAlert } from "../../contexts/AlertContext";

export default function Verify() {
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  if (location.pathname === "/verify" && user.emailVerified) {
    navigate("/");
    setShowAlert(true);
    setAlertMessage(`Your email (${user.email}) has been verified.`);
    setAlertType("info");
    window.setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
      setAlertType(null);
    }, 7000);
    return;
  }

  const verifyUser = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      alert("verification sent");
    });
  };

  const validate = () => {
    window.location.reload();
    if (user.emailVerified === false) {
      window.setTimeout(
        () =>
          setError(
            "You have to verify your email first, if you have, click on Done, then Proceed"
          ),
        4000
      );

      return;
    } else {
      setError("");
      window.location.reload();
      navigate("/");
    }
  };
  return (
    <div className="auth__modal">
      <div className="auth__contents verify__contents">
        <img src={logo} alt="ary homes logo" />
        <p className="verification__message" style={{ marginBottom: "1rem" }}>
          Click on the <b>Proceed</b> button when you have verified your email
          with the link sent to you
        </p>
        {error && <p className="alert error">{error}</p>}
        <div className="buttons">
          <button onClick={validate} className="refresh__btn">
            Proceed
          </button>
          <div className="resend">
            <button onClick={verifyUser} className="verification__btn">
              Resend verification link
            </button>
          </div>
        </div>

        <p className="info">
          <b>
            <TiInfoOutline /> Verifying your email is useful to access some of
            our services.
          </b>
        </p>
      </div>
    </div>
  );
}
