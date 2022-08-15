import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../../assets/error2.svg";
import "./error404.scss";
import { motion } from "framer-motion";

export default function Error404() {
  return (
    <motion.div
      className="error__page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <img src={errorImg} alt="error" />
      <h1>SORRY</h1>
      <p>We can't seem to find the page you are looking for</p>
      <Link to="/">&larr; Visit Ary Home's homepage</Link>
    </motion.div>
  );
}
