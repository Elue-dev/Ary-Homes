import React from "react";
import { Link } from "react-router-dom";
import "./hero.scss";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__contents">
        <h2>Enjoy premium</h2>
        <h1>Luxury Shortlet Apartments</h1>
        <p>Let's find the perfect place for you</p>
        <Link to="/contact">
          <button className="hero__btn">Reach out to us</button>
        </Link>
      </div>
    </div>
  );
}
