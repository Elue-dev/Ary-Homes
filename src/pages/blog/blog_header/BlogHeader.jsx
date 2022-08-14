import React from "react";
import { Link } from "react-router-dom";
import { GrInstagram, GrFacebook } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { RiMailFill } from "react-icons/ri";
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
          <h2>
            AryHomes Blog
          </h2>
        </div>
      </div>
    </div>
  );
}