import React from "react";
import "./bookmarks.scss";
import { motion } from "framer-motion";
import { FaRegBookmark, FaTrashAlt } from "react-icons/fa";
import { HiEye } from "react-icons/hi";
import { TbBookmarksOff } from "react-icons/tb";
import { MdOutlineHomeWork } from "react-icons/md";
import { GrArticle } from "react-icons/gr";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCustomAlert } from "../../contexts/AlertContext";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import Notiflix from "notiflix";
import Loader from "../../components/utilities/Loader";
import GoBack from "../../components/utilities/GoBack";
import Spinner from "../../components/utilities/Spinner";

export default function Bookmarks() {
  const { data, loading } = useFetchCollection("bookmarks");
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();
  const { setShowAlert, setAlertMessage, setAlertType, formatCurrency } =
    useCustomAlert();
  const savedBlogs = useFetchCollection("saved_blogs");
  const [blogs, setBlogs] = useState([]);

  const filteredBookmarks = bookmarks?.filter(
    (b) => b.user_email === user.email
  );

  const filteredBlogs = blogs?.filter((b) => b.user_email === user.email);

  useEffect(() => {
    setBookmarks(data);
  }, [data]);

  useEffect(() => {
    setBlogs(savedBlogs.data);
  }, [savedBlogs]);

  console.log(blogs);

  const deleteBookmarkFromDatabase = async (id) => {
    try {
      await deleteDoc(doc(database, "bookmarks", id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteBlogFromDatabase = async (id) => {
    try {
      await deleteDoc(doc(database, "saved_blogs", id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const confirmDelete = (id, name) => {
    Notiflix.Confirm.show(
      "Delete Bookmark",
      `Are you sure you want to delete ${name} from your bookmarks?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteBookmarkFromDatabase(id);
        setShowAlert(true);
        setAlertMessage(`${name} removed from your bookmarks`);
        setAlertType("info");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#ae8625",
        okButtonBackground: "#ae8625",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const confirmBlogDelete = (id) => {
    Notiflix.Confirm.show(
      "Delete Bookmark",
      `Are you sure you want to delete this blog post from your bookmarks?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteBlogFromDatabase(id);
        setShowAlert(true);
        setAlertMessage(`Blog post removed from your bookmarks`);
        setAlertType("info");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#ae8625",
        okButtonBackground: "#ae8625",
        cssAnimationStyle: "zoom",
      }
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <motion.div
      className="bookmarks"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <GoBack />
      <div className="bookmarks__heading">
        <h2>
          <FaRegBookmark /> YOUR BOOKMARKS
        </h2>
      </div>
      <div className="bookmarks__wrapper">
        <div className="head">
          <h3>
            <MdOutlineHomeWork />
            Bookmarked Properties
          </h3>
          <p>
            You currently have{" "}
            <b>
              {filteredBookmarks.length}{" "}
              {filteredBookmarks.length === 1 ? "Property" : "Properties"}
            </b>{" "}
            in your bookmarks.
          </p>
          <hr />
          <br />
        </div>
        {filteredBookmarks.length ? (
          <div className="table">
            {filteredBookmarks.length === 0 && filteredBlogs.length === 0 ? (
              <div div className="no__bookmark">
                <TbBookmarksOff />
                <h3>You currently have no properties in your bookmarks.</h3>
              </div>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Property Name</th>
                      <th>Property Price</th>
                      <th>Date Bookmarked</th>
                      <th>See Details</th>
                      <th>Delete Bookmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookmarks?.map((bookmark, index) => {
                      const { id, bookmarkedAt } = bookmark;
                      return (
                        <tr key={id}>
                          <td>{index + 1}</td>
                          <td>
                            <b>{bookmark.property.name.toUpperCase()}</b>
                          </td>
                          <td>
                            <b>
                              NGN {formatCurrency(bookmark.property.price)}
                              /night
                            </b>
                          </td>
                          <td>
                            <b>{bookmarkedAt}</b>{" "}
                          </td>
                          <td>
                            <Link to={`/property/${bookmark.property.id}`}>
                              <HiEye size={22} className="bookmark__icon" />{" "}
                            </Link>
                          </td>
                          <td>
                            <FaTrashAlt
                              size={18}
                              className="bookmark__icon"
                              onClick={() =>
                                confirmDelete(id, bookmark.property.name)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <hr /> <br />
              </>
            )}
          </div>
        ) : null}

        <div className="head">
          <h3>
            <GrArticle />
            Bookmarked Blog Posts
          </h3>
          <p>
            You currently have{" "}
            <b>
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "Blog Post" : "Blog Posts"}
            </b>{" "}
            in your bookmarks.
          </p>
        </div>
        {filteredBlogs.length ? (
          <div className="table">
            {filteredBlogs.length === 0 ? (
              <div div className="no__bookmark">
                <TbBookmarksOff />
                <h3>You currently have no blog posts in your bookmarks.</h3>
              </div>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Blog Title</th>
                      {/* <th>Date Bookmarked</th> */}
                      <th>See Details</th>
                      <th>Delete Bookmark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs?.map((blog, index) => {
                      const { id, savedAt } = blog;
                      return (
                        <tr key={id}>
                          <td>{index + 1}</td>
                          <td>
                            <b>{blog.blog_post.title.toUpperCase()}</b>
                          </td>
                          {/* <td>
                            <b>{blog.blog_post.category}</b>
                          </td> */}
                          {/* <td>
                            <b>{savedAt}</b>{" "}
                          </td> */}
                          <td>
                            <Link to={`/blog/${blog.blog_post.id}`}>
                              <HiEye size={22} className="bookmark__icon" />{" "}
                            </Link>
                          </td>
                          <td>
                            <FaTrashAlt
                              size={18}
                              className="bookmark__icon"
                              onClick={() => confirmBlogDelete(id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
