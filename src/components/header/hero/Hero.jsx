import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { selectUserName, selectUsers } from "../../../redux/slice/authSlice";
import "./hero.scss";

export default function Hero() {
  const name = useSelector(selectUserName);
  const modifiedName = name?.charAt(0).toUpperCase() + name?.slice(1);
  const { user } = useAuth();
  const shortenedName =
    name && modifiedName?.substring(0, modifiedName?.indexOf(" "));

  return (
    <div className="hero">
      <div className="hero__contents">
        <h1>Luxury Shortlet Apartments</h1>
        <p>
          Let's find the perfect place for you{user?.displayName && ","}
          <span>&nbsp;{name ? modifiedName && `${shortenedName}` : null}</span>
        </p>
        <Link to="/all-properties">
          <button className="hero__btn">EXOLORE OUR PROPERTIES</button>
        </Link>
      </div>
    </div>
  );
}
