import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../hooks/useFetchCollection";
import { selectBlogs, STORE_BLOGS } from "../../redux/slice/blogSlice";
import { FaComments } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { BsArrowLeft, BsPersonPlusFill } from "react-icons/bs";
import { BiCategory, BiCheckboxSquare, BiTimeFive } from "react-icons/bi";
import { GiSemiClosedEye } from "react-icons/gi";
import { GrInstagram, GrFacebook } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { RiMailFill } from "react-icons/ri";
import { GrArticle } from "react-icons/gr";
import { SiHey } from "react-icons/si";
import { MdLibraryAdd } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { CgLayoutList } from "react-icons/cg";
import "./blog.scss";
import BlogHeader from "./blog_header/BlogHeader";
import RiseLoader from "react-spinners/RiseLoader";
import ReactWhatsapp from "react-whatsapp";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useCustomAlert } from "../../contexts/AlertContext";
import {
  FILTER_BY_CATEGORY,
  selectFilteredBlogs,
} from "../../redux/slice/filterSlice";

export default function Blog() {
  const { data, loading } = useFetchCollection("blog");
  const [pending, setPending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState(null);
  const blogPosts = useSelector(selectBlogs);
  const [cgr, setCgr] = useState("All");
  const [showLines, setShowlines] = useState(false);
  const [display, setDisplay] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const filteredBlogPosts = useSelector(selectFilteredBlogs);

  let postsArray = [];

  if (cgr === "All") {
    postsArray = blogPosts;
  } else {
    postsArray = filteredBlogPosts;
  }

  const postsCategories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  useEffect(() => {
    dispatch(
      STORE_BLOGS({
        blogs: data,
      })
    );
  }, [dispatch, data]);

  const handleShowLines = () => {
    setShowlines(true);
    setDisplay(false);
  };

  const handleBack = () => {
    setShowlines(false);
    setDisplay(true);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is a required field");
      return;
    } else if (!email) {
      setError("Email is a required field");
      window.setTimeout(() => setError(false), 5000);
      return;
    } else {
      setError(false);
      window.setTimeout(() => setError(false), 5000);
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

  const filterBlogPosts = (cat) => {
    setCgr(cat);
    dispatch(FILTER_BY_CATEGORY({ blogPosts, category: cat }));
  };

  return (
    <section className="blog">
      <BlogHeader />
      <div className="welcome">
        <h1>
          <SiHey className="hey__icon" />
          WELCOME TO ARY HOMES BLOG
        </h1>
        <div className="menu__icon" onClick={() => setShowMenu(true)}>
          <IoMdMenu />
        </div>
        <div className={showMenu ? "menu__items show" : "menu__items"}>
          <div className="layer" onClick={() => setShowMenu(false)} />
          <div className="close__menu" onClick={() => setShowMenu(false)}>
            <IoCloseSharp />
          </div>
          <h3>
            <BiCategory />
            CATEGORIES
          </h3>
          {postsCategories.map((c, index) => (
            <ul key={index} className="category__li">
              <li>
                {" "}
                <CgLayoutList />
                {c}
              </li>
            </ul>
          ))}
          <div className="blog__header__social__links">
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
        </div>
      </div>
      <div className="blog__contents">
        <div className="left__blog__contents">
          <div className="blog__posts">
            <h1>
              <GrArticle />
              BLOG POSTS
            </h1>
            <p style={{ fontSize: "1.1rem" }}>
              <b>{cgr}</b> Blog Posts
            </p>
            <div className="blog__content">
              {loading ? (
                <RiseLoader
                  loading={loading}
                  color={"#333"}
                  className="post__loader"
                />
              ) : (
                <>
                  {postsArray.map((post) => {
                    const {
                      id,
                      imageUrl,
                      title,
                      addedAt,
                      category,
                      tags,
                      likes,
                      comments,
                      uploader,
                      readTime,
                      description,
                    } = post;
                    return (
                      <div key={id} className="posts__wrapper">
                        <div className="post__img">
                          {imageUrl ? (
                            <img src={imageUrl} alt={title} />
                          ) : (
                            "LOADING"
                          )}
                          <p>{category}</p>
                        </div>
                        <div className="flexed__contents">
                          <div className="post__top">
                            <div className="left__post__top">
                              <p>
                                <BsPersonPlusFill />
                                {uploader}
                              </p>
                              <p>
                                <BiTimeFive />
                                {addedAt}
                              </p>
                            </div>
                            <div className="right__post__top">
                              <p>
                                <FaComments />
                                {comments.length}
                              </p>
                              <p>
                                <AiOutlineHeart />
                                {likes}
                              </p>
                            </div>
                          </div>
                          <div className="post__heading">
                            <h2>{title}</h2>
                          </div>
                          <div className="post__description">
                            {description.substring(0, 120)}...
                          </div>
                          <button className="read__more__post">
                            <GiSemiClosedEye />
                            Read More
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="right__blog__contents">
          <div className="post__categories">
            <h1>
              <BiCategory />
              CATEGORIES
            </h1>
            {postsCategories.map((category, index) => (
              <ul key={index} className="categories__list">
                <li
                  onClick={() => filterBlogPosts(category)}
                  className={`${cgr}` === category ? "cat__active" : null}
                >
                  &#8250; {category}
                </li>
              </ul>
            ))}
          </div>
          <h1 className="add__post">
            <MdLibraryAdd />
            ADD BLOG POST
          </h1>
          <p>
            Wish To Add A Blog Post? You can add a post to Ary Homes blog by
            becoming a contributor. Once you are made a contributor, you would
            be able to add blog posts, Or you can send details of the blog post
            to us and we post it in your name. If you are interested in becoming
            a contributor, click on the button below to proceed
          </p>
          {display && (
            <button onClick={handleShowLines} className="contributor__btn">
              I want to become a contributor
            </button>
          )}
          {showLines && (
            <div className="con__buttons">
              <BsArrowLeft onClick={handleBack} />
              <ReactWhatsapp
                number="234-905-201-4239"
                message="Hi, i am from Ary Homes website, i want to become a contributor so i can add blog posts..."
                className="blog__chat"
              >
                <span>Message line 1</span>
              </ReactWhatsapp>
              <ReactWhatsapp
                number="234-810-733-9039"
                message="Hi, i am from Ary Homes website, i want to become a contributor so i can add blog posts..."
                className="blog__chat"
              >
                <span>Message line 2</span>
              </ReactWhatsapp>
            </div>
          )}
          <br />
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
        </div>
      </div>
    </section>
  );
}
