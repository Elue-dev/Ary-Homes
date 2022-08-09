import React from "react";
import { useSelector } from "react-redux";
import Hero from "../../components/header/hero/Hero";
import { selectUserName } from "../../redux/slice/authSlice";
import "./home.scss";


export default function Home() {
  const userName = useSelector(selectUserName)
  console.log(userName)

  return (
    <div className="home">
      <Hero />
    </div>
  );
}
