import React from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { MdHouseboat, MdContactMail } from "react-icons/md";
import "./blogFooter.scss";

export default function BlogFooter() {
  return (
    <div className="blog__footer">
      <div className="blog__footer__links">
        <Link to="/">
          <p>
            <HiHome className="foot_icon" />
            Home
          </p>
        </Link>
        <Link to="/all-properties">
          <p>
            <MdHouseboat className="foot_icon" />
            Properties
          </p>
        </Link>
        <Link to="/contact">
          <p>
            <MdContactMail className="foot_icon" />
            Contact
          </p>
        </Link>
      </div>
      <p>&copy; 2022, All Rights Reserved</p>
    </div>
  );
}
