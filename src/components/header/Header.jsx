import React, { useState, useEffect } from "react";
import { BiHomeAlt, BiLogInCircle } from "react-icons/bi";
import { RiArticleLine } from "react-icons/ri";
import {
  IoBookmarksOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { BsBookmarkStar } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineContactSupport } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { BsDot } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import logo from "../../assets/logo.jpg";
import "./header.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  REMOVE_ACTIVE_USER,
  selectUserName,
  SET_ACTIVE_USER,
} from "../../redux/slice/authSlice";
import { AdminOnlyLink } from "../admin_only/AdminOnlyRoute";
import { useAuth } from "../../contexts/AuthContext";
import { useCustomAlert } from "../../contexts/AlertContext";

export default function Header() {
  const [scrollPage, setScrollpage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [displayName, setDisplayname] = useState(null);
  const userName = useSelector(selectUserName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const modifiedUserName =
    userName?.charAt(0).toUpperCase() + userName?.slice(1);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/verify" ||
      location.pathname === "/reset-password"
    ) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  const fixNavbar = () => {
    if (window.scrollY > 300) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName === null) {
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayname(uName);
        } else {
          setDisplayname(user.displayName);
        }
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userID: user.uid,
            userName: user.displayName ? user.displayName : displayName,
          })
        );
      } else {
        setDisplayname("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });

    return () => unsubscribe();
  }, [dispatch, displayName]);

  const sendVerificationEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      navigate("/verify");
    });
  };

  const logoutUser = async () => {
    await logout();
    setShowAlert(true);
    setAlertMessage(`You have successfully logged out.`);
    setAlertType("success");
    window.setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
      setAlertType(null);
    }, 6000);
    navigate("/");
  };

  return (
    <>
      {showHeader ? (
        <>
          <header
            className={
              scrollPage ? ` header__wrapper fixed` : "header__wrapper"
            }
            style={{ transition: scrollPage && "all 1s ease" }}
          >
            <div className="header__contents">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="ary homes logo" />
                </Link>
                <Link to="/">
                  <h2>
                    <span>ary</span>homes
                  </h2>
                </Link>
              </div>

              <ul>
                <AdminOnlyLink>
                  <Link to="/user/admin/home">
                    <li>
                      <button className="admin__btn">Admin</button>
                    </li>
                  </Link>
                </AdminOnlyLink>

                <Link to="/">
                  <li>
                    <BiHomeAlt />
                    <p>Home</p>
                  </li>
                </Link>

                <Link to="/blog">
                  <li>
                    <RiArticleLine />
                    <p>Blog</p>
                  </li>
                </Link>
                <Link to="/about">
                  <li>
                    <IoInformationCircleOutline />
                    <p>About</p>
                  </li>
                </Link>
                <Link to="/contact">
                  <li>
                    <MdOutlineContactSupport />
                    <p>Contact</p>
                  </li>
                </Link>
              </ul>
              <div
                className="auth"
                onClick={() => setShowAuthModal(!showAuthModal)}
              >
                <CgMenuGridO />

                {user ? (
                  <>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="user__img" />
                    ) : (
                      <FaRegUserCircle />
                     
                    )}
                  </>
                ) : (
                  <FaRegUserCircle />
                )}

                {user && <BsDot className="dot" />}
                <>
                  <div
                    className={
                      showAuthModal ? "auth__popup show" : "auth__popup"
                    }
                  >
                    {!user && (
                      <>
                        <p>
                          {" "}
                          <FiUserPlus />
                          <Link to="/signup">Sign up</Link>
                        </p>
                        <p>
                          <BiLogInCircle />
                          <Link to="/login">Log in</Link>
                        </p>
                      </>
                    )}
                    {user && (
                      <>
                        {user.emailVerified ? (
                          <div className="logged__in">
                            <p>Hi, {modifiedUserName}!</p>
                            {/* <Link to="/bookmarks">
                              <li>
                                <IoBookmarksOutline />
                                <BsBookmarkStar />
                                Bookmarks
                              </li>
                            </Link> */}
                            <Link to={`/user/account/${user.uid}`}>
                              <li>
                                <MdOutlineManageAccounts />
                                My Account
                              </li>
                            </Link>

                            <button
                              className="logout__btn"
                              onClick={logoutUser}
                            >
                              Log out
                            </button>
                          </div>
                        ) : (
                          <p style={{ display: "block", lineHeight: 1.2 }}>
                            Seems you have yet to verifiy your email, either you
                            changed your email or you failed to do this when
                            signing up
                            <br />
                            <button
                              onClick={sendVerificationEmail}
                              className="header__verify__btn"
                            >
                              Verify now
                            </button>
                            <button
                              className="logout__btn"
                              onClick={logoutUser}
                            >
                              Log out
                            </button>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </>
              </div>
            </div>
          </header>
        </>
      ) : null}

      <div className="nav__bottom">
        <ul>
          <Link to="/">
            <li>
              <BiHomeAlt />
              <p>Home</p>
            </li>
          </Link>
          <Link to="/blog">
            <li>
              <RiArticleLine />
              <p>Blog</p>
            </li>
          </Link>
          <Link to="/about">
            <li>
              <IoInformationCircleOutline />
              <p>About</p>
            </li>
          </Link>
          <Link to="/contact">
            <li>
              <MdOutlineContactSupport />
              <p>Contact</p>
            </li>
          </Link>
          <AdminOnlyLink>
            <Link to="/user/admin/home">
              <li>
                <div />
                <button className="admin__btn">Admin</button>
              </li>
            </Link>
          </AdminOnlyLink>
        </ul>
      </div>
    </>
  );
}
