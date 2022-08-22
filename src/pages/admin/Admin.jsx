import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import "./admin.scss";
import ViewProperties from "./view_properties/ViewProperties";
import AddProperty from "./add_property/AddProperty";
import Users from "./users/Users";
import AddBlogPost from "./add_blog_post/AddBlogPost";
import Subscribers from "./subscribers/Subscribers";

export default function Admin() {
  return (
    <div className="admin">
      <div className="admin__navbar">
        <Navbar />
      </div>
      <div className="admin__contents">
        <Routes>
          <Route path="view-properties" element={<ViewProperties />} />
          <Route path="add-property/:id" element={<AddProperty />} />
          <Route path="add-post" element={<AddBlogPost />} />
          <Route path="users" element={<Users />} />
          <Route path="subscribers" element={<Subscribers />} />
        </Routes>
      </div>
    </div>
  );
}
