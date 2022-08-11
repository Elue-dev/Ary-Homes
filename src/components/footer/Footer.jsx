import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./footer.scss";

export default function Footer() {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  const date = new Date();
  const year = date.getFullYear();

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/verify" ||
      location.pathname === "/reset-password" ||
      location.pathname.includes("property")
    ) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showFooter ? (
        <footer>
          <div className="footer__contents">
            <p> &copy; {year}. All rights reserved</p>
          </div>
        </footer>
      ) : null}
    </>
  );
}
