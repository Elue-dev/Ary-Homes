import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import "./auth.scss";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.jpg";
import BeatLoader from "react-spinners/BeatLoader";
import { useCustomAlert } from "../../contexts/AlertContext";
import { useSelector } from "react-redux";
import { selectBlogURL, selectPreviousURL } from "../../redux/slice/authSlice";
import useFetchCollection from "../../hooks/useFetchCollection";
import { motion } from "framer-motion";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login, googleSignIn, user } = useAuth();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const previousURL = useSelector(selectPreviousURL);
  const blogURL = useSelector(selectBlogURL);
  const { data } = useFetchCollection("users");

  const allEmails = [];
  data.map((mails) => allEmails.push(mails.email));

  const redirectUser = () => {
    if (previousURL.includes("property")) {
      return navigate(-1);
    } else if (blogURL.includes("blog")) {
      navigate("/blog/add-blog-post");
    } else {
      navigate("/");
    }
  };

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
      redirectUser();
    } catch (error) {
      if (allEmails.includes(email)) {
        setError(
          "Wrong password. Also, this email has already been signed in using google, log in using google instead."
        );
        setLoading(false);
        return;
      }
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("No user with these credentials exists");
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

  const storeUsersInDatabase = async () => {
    const today = new Date();
    const date = today.toDateString();
    const usersConfig = {
      assignedID: uuidv4(),
      firstName: "",
      lastName: "",
      phone: "",
      email: email || user.email,
      joinedAt: date,
      avatar: "",
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
      redirectUser();
      setShowAlert(true);
      setAlertMessage(`Google sign in was successful!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      // const today = new Date();
      // const date = today.toDateString();
      // const usersConfig = {
      //   assignedID: uuidv4(),
      //   firstName: "",
      //   lastName: "",
      //   phone: "",
      //   email: user.email,
      //   joinedAt: date,
      //   avatar: "",
      //   createdAt: Timestamp.now().toDate(),
      // };
      // try {
      //   const usersRef = collection(database, "users");
      //   await addDoc(usersRef, usersConfig);
      // } catch (error) {
      //   console.log(error.message);
      // }
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
        }, 8000);
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
    <motion.section
      className="auth__modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="auth__contents login__contents">
        <p className="close__icon" onClick={() => navigate(-1)}>
          &larr;
        </p>
        <br />
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="ary homes logo" />
          </Link>
          <h1>LOG IN</h1>
        </div>
        {error && <p className="alert error">{error}</p>}
        <form>
          <label>
            <span>Email Address:</span>
            <div className="auth__icon">
              <MdOutlineMail />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
          </label>
          <br />
          <label>
            <span>Password:</span>
            <div className="password__visibility__toggler">
              <RiLockPasswordLine />
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
            <button type="button" className="btn submit__btn" disabled>
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
        <div className="new__user">
          <p>New to AryHomes? </p>
          <Link to="/user/signup">
            <button className="btn signup__btn" style={{ color: "#fff" }}>
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
