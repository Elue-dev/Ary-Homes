import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiChevronsRight, BiTimeFive } from "react-icons/bi";
import { BsPersonPlusFill } from "react-icons/bs";
import { FaCommentMedical, FaComments } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import { database } from "../../firebase/firebase";
import useFetchCollection from "../../hooks/useFetchCollection";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import BlogHeader from "../../pages/blog/blog_header/BlogHeader";
import GoBack from "../utilities/GoBack";
import maleImg from "../../assets/male.jpg";
import femaleImg from "../../assets/female.png";
import "./blogDetails.scss";
import { MdOutlineDateRange } from "react-icons/md";
import OtherPosts from "./other_posts/OtherPosts";
import { useCustomAlert } from "../../contexts/AlertContext";
import BlogFooter from "../../pages/blog/blog_footer/BlogFooter";
import { motion } from "framer-motion";

export default function BlogDetails() {
  const { id } = useParams();
  const { document } = useFetchDocuments("blog", id);
  const { data } = useFetchCollection("blog");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [blogPost, setBlogPost] = useState(null);
  const [storedId, setStoredId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [gender, setGender] = useState("");
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  const getDataId = data?.filter((d) => d.id === id);

  const likePost = () => {
    
  }

  useEffect(() => {
    setBlogPost(document);
  }, [document]);

  useEffect(() => {
    setStoredId(getDataId[0]?.id);
  }, [getDataId]);

  const submitComment = async (e) => {
    e.preventDefault();

    const today = new Date();
    const date = today.toDateString();
    try {
      const docRef = doc(database, "blog", storedId);
      await updateDoc(
        docRef,
        {
          comments: [{ name, email, comment, gender, date }],
        },
        { merge: true }
      );
      alert("ongoing");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is a required field");
      window.setTimeout(() => setError(null), 5000);
      return;
    } else if (!email) {
      setError("Email is a required field");
      window.setTimeout(() => setError(null), 5000);
      return;
    } else {
      setError(null);
    }

    setPending(true);

    try {
      const subscribersRef = collection(database, "subscribers");
      await addDoc(subscribersRef, {
        name,
        email,
      });
      setPending(false);
      setEmail("");
      setName("");
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`You have successfully subscribed to our newsletter!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(`An unnexpected error occured`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  };

  if (!blogPost) {
    return (
      <RiseLoader
        loading={true}
        color={"#333"}
        className="post__details__loader"
      />
    );
  }

  return (
    <motion.div
      className="blog__post__details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <BlogHeader />
      <div className="post__details__wrapper">
        <GoBack />

        <div className="posts__grid">
          <div className="left__post__details">
            <div className="top__links">
              <Link to="/">Home </Link>
              <BiChevronsRight /> <Link to="/blog">Blog </Link>{" "}
              <BiChevronsRight />
              <b>{blogPost.title}</b>
            </div>
            <div className="top__buttons">
              <button>{blogPost.readTime}</button>
              <button>{blogPost.category}</button>
            </div>
            <h1>{blogPost.title}</h1>
            <div className="post__top">
              <div className="left__post__top">
                <p>
                  <BsPersonPlusFill />
                  {blogPost.uploader}
                </p>
                <p>
                  <BiTimeFive />
                  {blogPost.addedAt}
                </p>
              </div>
              <div className="right__post__top">
                <p>
                  <FaComments />
                  {blogPost.comments.length}
                </p>
                <p>
                  <AiOutlineHeart />
                  {blogPost.likes}
                </p>
              </div>
            </div>
            <div className="post__image">
              <img src={blogPost.imageUrl} alt={blogPost.name} />
            </div>
            <div className="post__description">{blogPost.description}</div>
            <div className="post__tags">
              {blogPost.tags.map((tag, index) => (
                <ul key={index}>
                  <li># {tag}</li>
                </ul>
              ))}
            </div>
            <button onClick={likePost}>Click to Like this post</button>
            <div className="post__comments">
              <h2>
                {blogPost.comments.length}{" "}
                {blogPost.comments.length === 1 ? "comment" : "comments"}
              </h2>
              {blogPost.comments.length === 0 ? (
                <div className="n__comment">
                  <p>Be the first to add a comment</p>
                </div>
              ) : (
                <div className="y__comment">
                  {blogPost.comments.map((c, index) => {
                    const { comment, name, gender, date } = c;
                    return (
                      <div key={index} className="comments__grid">
                        <div className="gender__img">
                          {gender === "male" ? (
                            <img src={maleImg} alt={name} />
                          ) : (
                            <img src={femaleImg} alt={name} />
                          )}
                        </div>
                        <div className="commentor">
                          <p>{name}</p>
                          <p>
                            <MdOutlineDateRange />
                            {date}
                          </p>
                          <p>{comment}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <form onSubmit={submitComment}>
              <h2>
                <FaCommentMedical />
                Add a comment
              </h2>
              <label>
                <span>Name:</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </label>

              <label>
                <span>Email: (would not be published)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                />
              </label>
              <label>
                <span>Gender:</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label>
                <span>Your comment</span>
              </label>
              <textarea
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your Comment"
                cols=""
                rows="8"
              />
              <button type="submit">Submit Comment</button>
            </form>
            <OtherPosts />
          </div>
          <div className="right__post__details">
            <div className="newsletter">
              <h3>SUBSCRIBE TO OUR NEWSLETTER</h3>
              {error && <p className="error alert">{error}</p>}
              <form onSubmit={handleSubscribe}>
                <label>
                  <span>Name:</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First or Full name"
                  />
                </label>
                <label>
                  <span>Email:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                  />
                </label>
                {pending ? (
                  <button type="button" className="subscribe__btn" disabled>
                    LOADING...
                  </button>
                ) : (
                  <button type="submit" className="subscribe__btn">
                    SUBSRIBE
                  </button>
                )}
              </form>
            </div>
            {data?.map((p) => {
              const { id, imageUrl, title, readTime } = p;
              return (
                <Link to={`/blog/${id}`}>
                  <div key={id} className="right__related">
                    <div className="right__related__image">
                      <img src={imageUrl} alt={title} />
                    </div>
                    <div className="right__related__texts">
                      <h4>{title}</h4>
                      <p>
                        <BiTimeFive />
                        {readTime}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <BlogFooter />
    </motion.div>
  );
}
