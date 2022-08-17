import React from "react";
import { FaUserCircle, FaBlogger } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectUserName } from "../../../redux/slice/authSlice";
import { FiHome, FiUsers } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import { MdAddBusiness } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";
import "./navbar.scss";

export default function Navbar() {
  const adminUser = useSelector(selectUserName);
  const { user } = useAuth();

  return (
    <div className="admin__nav">
      <div className="admin__user">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="admin__user__photo"
          />
        ) : (
          <FaUserCircle size={40} color="#fff" />
        )}

        <h3>{adminUser}</h3>
        <p>
          <b>
            <i>ADMINISTRATOR</i>
          </b>
        </p>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/view-properties">
              <SiHomeadvisor />
              View Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-property/ADD">
              <MdAddBusiness />
              Add Property
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-post">
              <FaBlogger />
              Add A Blog Post
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <FiUsers />
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
