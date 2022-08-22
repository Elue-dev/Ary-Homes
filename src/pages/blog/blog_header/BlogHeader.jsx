import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import "./blogHeader.scss";

export default function BlogHeader() {
  return (
    <div className="blog__header">
      <div className="blog__header__wrapper">
        <div className="blog__header__logo">
          <Link to="/">
            <img src={logo} alt="ary homes logo" />
          </Link>
          <Link to="/blog">
            <h1>AryHomes Blog</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}
