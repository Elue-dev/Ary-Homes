import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";
import "./popup.scss";
import { SAVE_BLOG_URL } from "../../redux/slice/authSlice";

export default function Popup() {
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   window.setTimeout(() => {
  //     setShowPopup(true);
  //   }, 15000);
  // },[]);

  const handleRedirect = () => {
    dispatch(SAVE_BLOG_URL("/blog"));
    setShowPopup(false);
  };

  return (
    <div className={showPopup ? "popup show" : "popup"}>
      <div className="alert_box">
        <h3>Hi, {!user ? "Guest" : user.displayName}</h3>
        <br />
        <p>
          Do you know that you can add blog posts to our blog? All you need is
          to be signed in. Become a contributor today and start adding blog
          posts!
        </p>
        <br />
        <button onClick={handleRedirect}>
          <Link to="/blog/add-blog-post">Add a blog post</Link>
        </button>
        <button onClick={() => setShowPopup(false)} className="dismiss">
          I would do that later
        </button>
      </div>
    </div>
  );
}
