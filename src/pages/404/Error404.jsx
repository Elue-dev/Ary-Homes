import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../../assets/error2.svg";
import { TbError404 } from "react-icons/tb";
import "./error404.scss";

export default function Error404() {
  return (
    <div className="error__page">
      <img src={errorImg} alt="error" />
      <h1>SORRY</h1>
      <p>We can't seem to find the page you are looking for</p>
      <Link to="/">&larr; Visit Ary Home's homepage</Link>
    </div>
  );
}
