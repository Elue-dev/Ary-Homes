import React from "react";
import { motion } from "framer-motion";

export default function ViewProperties() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      ViewProperties
    </motion.div>
  );
}
