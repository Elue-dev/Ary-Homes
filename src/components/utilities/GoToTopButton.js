import React, { useState, useEffect } from "react";
import { TbArrowBigTop } from "react-icons/tb";
import { animateScroll as scroll } from "react-scroll";

export default function BackToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
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
          to=""
          style={{
            position: "fixed",
            bottom: "30px",
            right: "20px",
            height: "30px",
            width: "30px",
            fontSize: "30px",
            color: "#ae8625",
            cursor: "pointer",
            zIndex: "100000000000",
          }}
          onClick={scrollUp}
        >
          <TbArrowBigTop />
        </div>
      ) : null}
    </div>
  );
}
