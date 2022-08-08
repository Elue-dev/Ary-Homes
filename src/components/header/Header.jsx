import React, { useState } from "react";
import { BiHomeAlt, BiLogInCircle } from "react-icons/bi";
import { RiArticleLine } from "react-icons/ri";
import {
  IoBookmarksOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { MdOutlineContactSupport } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import "./header.scss";
import { Link } from "react-router-dom";

export default function Header() {
  const [scrollPage, setScrollpage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  return (
    <>
      <header
        className={scrollPage ? ` header__wrapper fixed` : "header__wrapper"}
      >
        <div className="header__contents">
          <div className="logo">
            <Link to="/">
              <h2>AryHomes</h2>
            </Link>
          </div>

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
            {/* <Link to="/bookmarks">
              <li>
                <IoBookmarksOutline />
                <p>Bookmarks</p>
              </li>
            </Link> */}
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
            <FaRegUserCircle />
            <>
              <div
                className={showAuthModal ? "auth__popup show" : "auth__popup"}
              >
                <p>
                  {" "}
                  <FiUserPlus />
                  <Link to="/signup">Sign up</Link>
                </p>
                <p>
                  <BiLogInCircle />
                  <Link to="/login">Log in</Link>
                </p>
              </div>
            </>
          </div>
        </div>
      </header>

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
          {/* <Link to="/bookmarks">
            <li>
              <IoBookmarksOutline />
              <p>Bookmarks</p>
            </li>
          </Link> */}
          <Link to="/contact">
            <li>
              <MdOutlineContactSupport />
              <p>Contact</p>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}
