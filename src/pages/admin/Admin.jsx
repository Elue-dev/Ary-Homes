import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import './admin.scss'
import Home from "./home/Home";
import ViewProperties from "./view_properties/ViewProperties";
import AddProperty from "./add_property/AddProperty";
import Users from "./users/Users";
import AddBlogPost from "./add_blog_post/AddBlogPost";

export default function Admin() {
  return (
    <div className="admin">
      <div className="admin__navbar">
        <Navbar />
      </div>
      <div className="admin__contents">
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='view-properties' element={<ViewProperties />} />
          <Route path='add-property' element={<AddProperty />} />
          <Route path='add-blog-post' element={<AddBlogPost />} />
          <Route path='users' element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}
