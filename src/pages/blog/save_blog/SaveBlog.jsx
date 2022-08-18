import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useCustomAlert } from "../../../contexts/AlertContext";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase/firebase";
import useFetchCollection from "../../../hooks/useFetchCollection";
import "./saveBlog.scss";

export default function SaveBlog({ post, id, setError }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const { data } = useFetchCollection("saved_blogs");
  const [savedBlogs, setSavedBlogs] = useState(null);

  useEffect(() => {
    setSavedBlogs(data);
  }, [data]);

  const saveBlogToBookmarks = async (post, id) => {
    try {
      setLoading(true);

      if (!user) {
        navigate("/user/login");
        setLoading(false);
        setShowAlert(true);
        setAlertMessage(
          `You have to be logged in to add blog posts to your bookmarks`
        );
        setAlertType("error");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
        return;
      }

      const matchBlog = savedBlogs?.find((sb) => sb.user_email === user?.email);
      const matchBlogId = savedBlogs?.find((bm) => bm.blog_post.id === id);

      if (matchBlog && matchBlogId) {
        window.scrollTo(0, 0);
        setLoading(false);
        setShowAlert(true);
        setAlertMessage(`This blog post is already in your bookmarks`);
        setAlertType("info");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
        return;
      }

      const today = new Date();
      const date = today.toDateString();
      const docRef = collection(database, "saved_blogs");
      await addDoc(docRef, {
        blog_post: post,
        user_email: user.email,
        savedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
      window.scrollTo(0, 0);
      setLoading(false);
      setShowAlert(true);
      setAlertMessage(`This blog post has been added to your bookmarks`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage("An unexpected error occured");
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    }
  };

  return (
    <div className="save__blog">
      {loading ? (
        <button disabled style={{ minWidth: "50%" }}>
          <BeatLoader loading={loading} size={10} color={"#222"} />
        </button>
      ) : (
        <button onClick={() => saveBlogToBookmarks(post, id)}>
          <FaBookmark />
          SAVE TO BOOKMARKS
        </button>
      )}
    </div>
  );
}
