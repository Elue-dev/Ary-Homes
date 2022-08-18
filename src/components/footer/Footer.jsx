import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { GrFacebook, GrInstagram } from "react-icons/gr";
import { RiMailFill } from "react-icons/ri";
import { useLocation, Link } from "react-router-dom";
import ReactWhatsapp from "react-whatsapp";
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
            <div className="footer__Links">
              <ul>
                <li>
                  <a href="mailto: aryhomes1@gmail.com">
                    {" "}
                    <RiMailFill />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/aryhomes">
                    {" "}
                    <GrInstagram />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/aryhomes">
                    {" "}
                    <GrFacebook />
                  </a>
                </li>
                <li>
                  <ReactWhatsapp
                    number="234-905-201-4239"
                    message="Hi, i am from Ary Homes website, i want to leave a message..."
                    className="whatasapp__link"
                  >
                    <BsWhatsapp />
                  </ReactWhatsapp>
                </li>
              </ul>
            </div>
            <i>Stay in class...</i>
          </div>
          <p className="rights"> &copy; {year}. All rights reserved</p>
        </footer>
      ) : null}
    </>
  );
}
