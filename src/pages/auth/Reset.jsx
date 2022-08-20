import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.jpg";
import BeatLoader from "react-spinners/BeatLoader";
import {motion} from 'framer-motion'

export default function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const resetUserPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setEmail("");
      setLoading(false);
      setMessage(
        "Check your inbox for further instructions (Ensure to check spam folder, click on 'Report as not spam and continue from inbox')."
      );
      window.setTimeout(() => {
        setMessage("REDIRECTING...");
      }, 5000);
      window.setTimeout(() => {
        navigate("/user/login");
      }, 7000);
    } catch (err) {
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        setError("This email is not registered");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (err.message === "Firebase: Error (auth/too-many-requests).") {
        setError("Reset password limit exceeded");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    }
  };

  return (
    <motion.section className="auth__modal" initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: .1 }}>
      <div className="auth__contents reset__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          &larr;
        </p>
        <br />
        <div className="reset__logo">
          <Link to="/">
            <img src={logo} alt="ary homes logo" />
          </Link>
        </div>

        <h2>Reset your password</h2>
        <div className="reset__info">
          <p>
            If the email goes to your spam folder, click on{" "}
            <b>'Report as not spam'</b>, this will move the mail from spam to
            your inbox. then go to your inbox and continue from there.
          </p>
        </div>
        <br />
        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert message">{message}</p>}
        <form onSubmit={resetUserPassword} className="reset__password__input">
          <label>
            <span>Email address:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>
          {loading && (
            <button type="submit" className="reset__password__btn">
              <BeatLoader loading={loading} size={10} color={"#fff"} />
            </button>
          )}
          {!loading && (
            <button type="submit" className="reset__password__btn">
              Proceed
            </button>
          )}
        </form>
        <p className="back__to__login">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </motion.section>
  );
}
