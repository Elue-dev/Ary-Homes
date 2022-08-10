import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../contexts/AuthContext";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import BeatLoader from "react-spinners/BeatLoader";
import { useCustomAlert } from "../../contexts/AlertContext";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const {
    user,
    updateName,
    signup,
    googleSignIn,
    facebookSignIn,
    setUpRecaptcha,
  } = useAuth();

  const verifyUser = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      // fill later
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
      phone,
      email: email,
      joinedAt: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      const usersRef = collection(database, "users");
      await addDoc(usersRef, usersConfig);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setShowAlert(true);
      setAlertMessage(`Google sign in was successful!`);
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

  const handlePasswordVisibility = () => {
    setVisible(!visible);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
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

  return (
    <section className="auth__modal">
      <div className="auth__contents signup__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
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
          <label>
            <span>Name:</span>
            <div className="name">
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
            </div>
          </label>
          <label>
            <span>Phone Number:</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
          <button onClick={handleGoogleSignIn} className="btn google__btn">
            <FcGoogle />
            Continue with google
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
