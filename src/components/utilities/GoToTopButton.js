import React, { useState, useEffect } from "react";
import { TbArrowBigTop } from "react-icons/tb";

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {showButton ? (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "20px",
            height: "30px",
            width: "30px",
            fontSize: "30px",
            color: "#fff",
            cursor: "pointer",
            zIndex: "1000000",
            background: "#ae8625",
          }}
          onClick={scrollUp}
        >
          <TbArrowBigTop />
        </div>
      ) : null}
    </div>
  );
}
