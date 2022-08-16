import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiChevronsRight, BiTimeFive } from "react-icons/bi";
import { BsFillHeartFill, BsPersonPlusFill } from "react-icons/bs";
import { FaCommentMedical, FaComments } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BeatLoader, RiseLoader } from "react-spinners";
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
import { useAuth } from "../../contexts/AuthContext";

export default function BlogDetails() {
  const { id } = useParams();
  const { document } = useFetchDocuments("blog", id);
  const { data } = useFetchCollection("blog");
  const subscribers = useFetchCollection("subscribers");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [blogPost, setBlogPost] = useState(null);
  const [storedId, setStoredId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [gender, setGender] = useState("");
  const [liked, setLiked] = useState(false);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  const getDataId = data?.filter((d) => d.id === id);

  const likePost = async () => {
    try {
      const docRef = doc(database, "blog", storedId);
      await updateDoc(docRef, {
        likes: blogPost.likes + 1,
      });
      setLoading(false);
      setLiked(true);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(
        `You just liked this blog post :), would be updated soon`
      );
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    } catch (error) {
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`An unexpected error occured`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    }
  };

  const unLikePost = async () => {
    setLoading(true);
    try {
      const docRef = doc(database, "blog", storedId);
      await updateDoc(docRef, {
        likes: blogPost.likes - 1,
      });
      if (blogPost?.likes < 0) {
        setBlogPost({ ...blogPost, likes: 0 });
      }
      setLiked(false);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(
        `You just unliked this blog post :(, would be updated soon`
      );
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 10000);
    } catch (error) {
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`An unexpected error occured`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 10000);
    }
  };

  //to make sure likes is never < 0
  useEffect(() => {
    if (blogPost?.likes < 0) {
      setBlogPost({ ...blogPost, likes: 0 });
    }
  }, [blogPost]);

  useEffect(() => {
    setBlogPost(document);
  }, [document]);

  useEffect(() => {
    setStoredId(getDataId[0]?.id);
  }, [getDataId]);

  const submitComment = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!name || !email || !gender || !comment) {
      setLoading(false);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`Please fill all fields before submitting`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
      return;
    }

    const today = new Date();
    const date = today.toDateString();
    try {
      const docRef = doc(database, "blog", storedId);
      const commentToAdd = { name, email, comment, gender, date };
      await updateDoc(docRef, {
        comments: [...blogPost.comments, commentToAdd],
      });
      setLoading(false);
      window.scrollTo(0, 0);
      setName("");
      setEmail("");
      setComment("");
      setGender("");
      setShowAlert(true);
      setAlertMessage(`Your comment has been successfully added`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setLoading(false);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`An unexpected error occured`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
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

    let subscribersEmails = [];
    subscribers.data.map((mails) => subscribersEmails.push(mails.email));
    if (subscribersEmails.includes(email)) {
      setLoading(false);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`YOU HAVE ALREADY SUBSCRIBED TO OUR NEWSLETTER!`);
      setAlertType("info");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
      return;
    }

    setPending(true);

    const today = new Date();
    const date = today.toDateString();
    try {
      const subscribersRef = collection(database, "subscribers");
      await addDoc(subscribersRef, {
        name,
        email,
        subscribedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
      setPending(false);
      setEmail("");
      setName("");
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`YOU HAVE SUCESSFULLY SUBSCRIBED TO OUR NEWSLETTER!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(`AN UNEXPECTED ERROR OCCURED`);
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
        color={"#ae8625"}
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
              <button>{blogPost.readTime} mins read</button>
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
              {liked ? (
                <BsFillHeartFill
                  onClick={unLikePost}
                  className="like__icon"
                  color="red"
                />
              ) : (
                <BsFillHeartFill
                  onClick={likePost}
                  className="like__icon"
                  color="#fff"
                />
              )}
            </div>
            <div className="post__description">{blogPost.description}</div>
            <div className="post__tags">
              {blogPost.tags.map((tag, index) => (
                <ul key={index}>
                  <li>#{tag}</li>
                </ul>
              ))}
            </div>
            <div className="post__comments">
              <h2>COMMENTS ({blogPost.comments.length})</h2>
              {blogPost.comments.length === 0 ? (
                <div className="n__comment">
                  <p>Be the first to add a comment to this post</p>
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
              {loading ? (
                <button type="submit" className="submit__comment__btn">
                  <BeatLoader
                    loading={loading}
                    size={10}
                    color={"#fff"}
                    disabled
                  />
                </button>
              ) : (
                <button type="submit" className="submit__comment__btn">
                  Submit comment
                </button>
              )}
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
            {data?.slice(1, 5).map((p) => {
              const { id, imageUrl, title, readTime } = p;
              return (
                <Link to={`/blog/${id}`} key={id}>
                  <div className="right__related">
                    <div className="right__related__image">
                      <img src={imageUrl} alt={title} />
                    </div>
                    <div className="right__related__texts">
                      <h4>{title}</h4>
                      <p>
                        <BiTimeFive />
                        {readTime} mins read
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
