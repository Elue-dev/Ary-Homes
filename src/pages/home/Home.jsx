import React from "react";
import { useSelector } from "react-redux";
import Hero from "../../components/header/hero/Hero";
import { useAuth } from "../../contexts/authContext";
import { selectEmail } from "../../redux/slice/authSlice";
import "./home.scss";

export default function Home() {
  const {user} = useAuth
  console.log(user);

  return (
    <div className="home">
      <Hero />
    </div>
  );
}
