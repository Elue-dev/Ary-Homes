import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import logo from "../../assets/logo.jpg";
import { TiInfoOutline } from "react-icons/ti";
import { useCustomAlert } from "../../contexts/AlertContext";
import { motion } from "framer-motion";

export default function Verify() {
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  if (user.emailVerified) {
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
      setShowAlert(true);
      setAlertMessage(`A verification email has been sent to you.`);
      setAlertType("info");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 7000);
    });
  };

  const validate = () => {
    window.location.reload();
    if (user.emailVerified === false) {
      window.setTimeout(
        () =>
          setError(
            "You have to verify your email first, if you have, click on Done, then Proceed,If the email goes to your spam folder, click on Report As Not Spam, this will move the mail from spam to your inbox. then go to your inbox and continue from there"
          ),
        10000
      );

      return;
    } else {
      setError("");
      window.location.reload();
      navigate("/");
    }
  };

  return (
    <motion.div
      className="auth__modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="auth__contents verify__contents">
        <img src={logo} alt="ary homes logo" />
        <p className="verification__message" style={{ marginBottom: "1rem" }}>
          Verification email has been sent. Click on the <b>Proceed</b> button when you have verified your email
          with the link sent to you.{" "}<br /><br />
          <span>
            If the email goes to your spam folder, click on{" "}
            <b>'Report as not spam'</b>, this will move the mail from spam to
            your inbox. then go to your inbox and continue from there.
          </span>
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
    </motion.div>
  );
}
