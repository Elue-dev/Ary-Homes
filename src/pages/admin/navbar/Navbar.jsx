import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectUserName } from "../../../redux/slice/authSlice";
import { FiHome, FiUsers } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import { MdAddBusiness } from "react-icons/md";
import "./navbar.scss";

export default function Navbar() {
  const adminUser = useSelector(selectUserName);

  return (
    <div className="admin__nav">
      <div className="admin__user">
        <FaUserCircle size={40} color="#fff" />
        <h3>{adminUser}</h3>
        <p>(ADMIN)</p>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/user/admin/home">
              <FiHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/admin/view-properties">
              <SiHomeadvisor />
              View Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/admin/add-property">
              <MdAddBusiness />
              Add Property
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/admin/users">
              <FiUsers />
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
