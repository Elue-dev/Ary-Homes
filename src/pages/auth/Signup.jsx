import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrFormClose } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../contexts/authContext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import BeatLoader from "react-spinners/BeatLoader";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateName, signup } = useAuth();

  const verifyUser = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      alert("verification sent");
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    } else if (!password) {
      setError("Please enter your password");
      return;
    } else if (!firstName) {
      setError("Please enter your first name");
      return;
    } else if (!lastName) {
      setError("Please enter your last name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(email, password);
      await updateName(firstName + " " + lastName);
      verifyUser();
      setLoading(false);
      navigate("/verify");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("Email already in use");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setError("Password should be at least 6 characters");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 7000);
      }
      setLoading(false);
    }

    // ===== add users to database =======
    const today = new Date();
    const date = today.toDateString();
    const usersConfig = {
      assignedID: uuidv4(),
      firstName,
      lastName,
      email: email,
      joinedAt: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      const usersRef = collection(database, "Users");
      await addDoc(usersRef, usersConfig);
    } catch (error) {
      console.log(error.message);
    }
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
            <h1>ARY HOMES SIGN UP</h1>
          </Link>
        </div>
        {error && <p className="alert error">{error}</p>}
        <form>
          <label className="name">
            <span>Name:</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </label>
          <label>
            <span>Email Address:</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your valid email"
            />
          </label>
          <br />
          <label>
            <span>Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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
              onClick={registerUser}
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
