import React, { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Hero from "../../components/header/hero/Hero";
import Properties from "../../components/properties/Properties";
import { useAuth } from "../../contexts/AuthContext";
import {motion} from 'framer-motion'
import "./home.scss";

export default function Home() {
  const { logout, user } = useAuth();
  console.log(user)

  // useEffect(() => {
  //   window.setTimeout(() => logout(), 10000); ====> automatic logout, look for how to do 2 hours
  // }, []);

  return (
    <motion.section
    className="home"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: .1 }}>
      <Hero />
      <Properties />
      <Footer />
    </motion.section>
  );
}
