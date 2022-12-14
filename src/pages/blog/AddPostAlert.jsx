import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { SAVE_BLOG_URL } from "../../redux/slice/authSlice";

export default function AddPostAlert() {
  const [showAlert, setShowAlert] = useState(true);
  const [scrollPage, setScrollpage] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleRedirect = () => {
    dispatch(SAVE_BLOG_URL("/blog"));
    setShowAlert(false);
  };

  const fixAlert = () => {
    if (window.scrollY > 150) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixAlert);

  return (
    <div
      className={scrollPage ? "add__post__alert fixAlert" : "add__post__alert"}
    >
      {showAlert
        ? location.pathname === "/" && (
            <div className="add__post__alert__wrapper">
              <p>
                Did you know? You can add blog posts to our blog, all you have
                to do is sign in.
                <Link to="/blog/add-blog-post" onClick={handleRedirect}>
                  Begin now
                </Link>
                <span onClick={() => setShowAlert(false)}>Dismiss</span>
              </p>
            </div>
          )
        : null}
    </div>
  );
}
