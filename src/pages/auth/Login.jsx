import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrFormClose } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import "./auth.scss";
import { useAuth } from "../../contexts/authContext";
import BeatLoader from "react-spinners/BeatLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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

  return (
    <section className="auth__modal">
      <div className="auth__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          {/* <GrFormClose /> */}
          &larr;
        </p>
        <br />
        <div className="logo">
          <Link to="/">
            <h1>ARY HOMES LOG IN</h1>
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
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

        <div className="line">
          <p className="or">or</p>
        </div>
        <div className="google">
          <button className="btn google__btn">
            <FcGoogle />
            Continue with google
          </button>
        </div>
        <div className="facebook">
          <button className=" btn facebook__btn">
            <BsFacebook />
            Continue with facebook
          </button>
        </div>
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
