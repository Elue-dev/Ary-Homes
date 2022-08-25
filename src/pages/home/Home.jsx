import React, { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Hero from "../../components/header/hero/Hero";
import Properties from "../../components/properties/Properties";
import { useAuth } from "../../contexts/AuthContext";
import { motion, useScroll, useSpring } from "framer-motion";
import "./home.scss";
import SomeBlogPosts from "../../components/some_blog_posts/SomeBlogPosts";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // useEffect(() => {
  //   window.setTimeout(() => logout(), 10000); ====> automatic logout, look for how to do 2 hours
  // }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="progress__bar__animate"
      ></motion.div>
      <motion.section
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Hero />
        <Properties />
        <SomeBlogPosts />
        <Footer />
      </motion.section>
    </>
  );
}
