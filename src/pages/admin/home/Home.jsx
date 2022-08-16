import React from "react";
import {motion} from 'framer-motion'

export default function Home() {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      Home
    </motion.section>
  );
}
