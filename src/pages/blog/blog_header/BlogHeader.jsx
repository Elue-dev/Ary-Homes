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
          <Link to="/">
            <h2>
              <span>Ary</span>Homes Blog
            </h2>
          </Link>
        </div>
        <div className="blog__header__social__links">
          <ul>
            <li>
              <a href="mailto: aryhomes1@gmail.com">
                {" "}
                <RiMailFill />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/aryhomes">
                {" "}
                <GrInstagram />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/aryhomes">
                {" "}
                <GrFacebook />
              </a>
            </li>
            <li>
              <BsWhatsapp />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
