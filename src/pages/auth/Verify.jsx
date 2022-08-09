import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import { TiInfoOutline } from "react-icons/ti";

export default function Verify() {
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const verifyUser = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      alert("verification sent");
    });
  };

  const validate = () => {
    if (user.emailVerified === false) {
      setError(
        "You have to verify your email first, if you have, click on Done, then Proceed"
      );
      return;
    } else {
      setError("");
      navigate("/");
    }
  };
  return (
    <div className="auth__modal">
      <div className="auth__contents verify__contents">
        <p className='verification__message' style={{ marginBottom: "1rem" }}>
          A verification link has been set to your email, when you have verified
          it, click on the <b>Done</b> button, then click on the <b>Proceed</b>{" "}
          button to continue.
        </p>
        {error && <p className="alert error">{error}</p>}
        <div className="buttons">
          <button
            onClick={() => window.location.reload()}
            className="refresh__btn"
          >
            Done
          </button>
          <button onClick={validate} className="proceed__btn">
            Proceed
          </button>
        </div>
        <hr />
        <div className="resend">
          <p>Need verification link ?</p>
          <button onClick={verifyUser} className="verification__btn">
            Resend verification link
          </button>
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
