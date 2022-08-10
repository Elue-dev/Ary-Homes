import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./auth.scss";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.jpg";
import BeatLoader from "react-spinners/BeatLoader";
import { useCustomAlert } from "../../contexts/AlertContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login, googleSignIn, facebookSignIn } = useAuth();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    } else if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      setShowAlert(true);
      setAlertMessage(`You are successfully logged in!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("User not found");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/wrong-password).") {
        setError("Wrong password");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (
        error.message ===
        "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
      ) {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
        );
        window.setTimeout(() => {
          setError("");
        }, 12000);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setShowAlert(true);
      setAlertMessage(`You are successfully logged in!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      navigate("/");
    } catch (err) {
      if (err.message === "Firebase: Error (auth/popup-closed-by-user).") {
        setError("Google sign in failed. (You exited the google sign in)");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (err.message === "Firebase: Error (auth/network-request-failed).") {
        setError(
          "Google sign in failed, this is mostly due to network connectivity issues, please check your network and try again."
        );
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
      navigate("/");
    } catch (err) {
      if (err.message === "Firebase: Error (auth/popup-closed-by-user).") {
        setError("Facebook sign in failed. (You exited the facebook sign in)");
        window.setTimeout(() => {
          setError("");
        }, 3500);
      }
      if (err.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Facebook sign in failed.c");
        window.setTimeout(() => {
          setError("");
        }, 3500);
      }
    }
  };

  const handlePasswordVisibility = () => {
    setVisible(!visible);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  return (
    <section className="auth__modal">
      <div className="auth__contents login__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          &larr;
        </p>
        <br />
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="ary homes logo" />
            <h1>LOG IN</h1>
          </Link>
        </div>
        {error && <p className="alert error">{error}</p>}
        <form>
          <label>
            <span>Email Address:</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </label>
          <br />
          <label>
            <span>Password:</span>
            <div className="password__visibility__toggler">
              <input
                type="password"
                value={password}
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <span onClick={handlePasswordVisibility}>
                {visible ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </span>
            </div>
          </label>
          {loading && (
            <button type="submit" className="btn submit__btn">
              <BeatLoader loading={loading} size={10} color={"#fff"} />
            </button>
          )}
          {!loading && (
            <button
              type="submit"
              className="btn submit__btn"
              onClick={loginUser}
            >
              Continue
            </button>
          )}
        </form>
        <p className="reset__password">
          <Link to="/reset-password">Forgot Password?</Link>
        </p>

        <div className="line">
          <p className="or">or</p>
        </div>
        <div className="google">
          <button onClick={handleGoogleSignIn} className="btn google__btn">
            <FcGoogle />
            Continue with google
          </button>
        </div>
        {/* <div className="facebook">
          <button onClick={handleFacebookSignIn} className=" btn facebook__btn">
            <BsFacebook />
            Continue with facebook
          </button>
        </div> */}
        <hr />
        <div className="new__user">
          <p>New to AryHomes? </p>
          <Link to="/signup">
            <button className="btn signup__btn" style={{ color: "#fff" }}>
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
