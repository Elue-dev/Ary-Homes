import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrFormClose } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <section className="auth__modal">
      <div className="auth__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          <GrFormClose />
        </p>
        <br />
        <div className="logo">
          <Link to="/">
            <h1>ARY HOMES SIGN UP</h1>
          </Link>
        </div>
        <form>
          <label>
            <span>Name:</span>
            <input type="text" placeholder="Enter your name" />
          </label>
          <label>
            <span>Email Address:</span>
            <input type="text" placeholder="Enter your valid email" />
          </label>
          <br />
          <label>
            <span>Password:</span>
            <input type="password" placeholder="At least 6 characters" />
          </label>
          {/* <label>
            <span>Confirm Password:</span>
            <input type="password" placeholder="Confirm your password" />
          </label> */}
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
          <p>Own a AryHomes account?</p>
          <Link to="/login">
            <button className="btn signup__btn" style={{ color: "#fff" }}>
              Log in
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
