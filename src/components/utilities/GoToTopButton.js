import React, { useState, useEffect } from "react";
import { IoMdArrowDropup } from "react-icons/io";
import { animateScroll as scroll } from "react-scroll";

export default function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 150) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const scrollUp = () => {
    scroll.scrollToTop();
  };

  return (
    <div>
      {showButton ? (
        <div
          onClick={scrollUp}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <IoMdArrowDropup
            style={{
              position: "fixed",
              bottom: "65px",
              right: "20px",
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              fontSize: "10px",
              background: "#333",
              boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.1)",
              color: "#fff",
              cursor: "pointer",
              zIndex: "10000000000000",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
