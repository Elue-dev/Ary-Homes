import React, { useEffect } from "react";
import Hero from "../../components/header/hero/Hero";
import Properties from "../../components/properties/Properties";
import { useAuth } from "../../contexts/AuthContext";
import "./home.scss";

export default function Home() {
  // const { logout } = useAuth();

  // useEffect(() => {
  //   window.setTimeout(() => logout(), 10000); ====> automatic logout, look for how to do 2 hours
  // }, []);
  return (
    <section className="home">
      <Hero />
      <Properties />
    </section>
  );
}
