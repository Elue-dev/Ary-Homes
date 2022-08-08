import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrFormClose } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import "./auth.scss";

export default function Login() {
  const navigate = useNavigate();

  return (
    <section className="auth__modal">
      <div className="auth__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          <GrFormClose />
        </p>
        <br /><br />
        <div className="logo">
          <Link to="/">
            <h1>ARY HOMES LOG IN</h1>
          </Link>
        </div>
        <form>
          <label>
            <span>Email Address:</span>
            <input type="text" placeholder="Enter your email" />
          </label>
          <br />
          <label>
            <span>Password:</span>
            <input type="password" placeholder="Enter your password" />
          </label>
          <button type="submit" className="btn submit__btn">
            Continue
          </button>
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
