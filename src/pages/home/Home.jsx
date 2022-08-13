import React, { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Hero from "../../components/header/hero/Hero";
import Properties from "../../components/properties/Properties";
import { useAuth } from "../../contexts/AuthContext";
import "./home.scss";

export default function Home() {
  const { logout, user } = useAuth();
  console.log(user)

  // useEffect(() => {
  //   window.setTimeout(() => logout(), 10000); ====> automatic logout, look for how to do 2 hours
  // }, []);

  return (
    <section className="home">
      <Hero />
      <Properties />
      <Footer />
    </section>
  );
}
