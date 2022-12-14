import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../hooks/useFetchCollection";
import { selectBlogs, STORE_BLOGS } from "../../redux/slice/blogSlice";
import { FaComments } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { BsArrowLeft, BsPersonPlusFill } from "react-icons/bs";
import { BiCategory, BiTimeFive } from "react-icons/bi";
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
import ReactPaginate from "react-paginate";

import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useCustomAlert } from "../../contexts/AlertContext";
import {
  FILTER_BY_CATEGORY,
  selectFilteredBlogs,
} from "../../redux/slice/filterSlice";
import BlogFooter from "./blog_footer/BlogFooter";
// import Bounce from "react-reveal/Bounce";
import { motion, useScroll, useSpring } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SavedBlog from "./save_blog/SaveBlog";
import { SAVE_BLOG_URL } from "../../redux/slice/authSlice";
import Pagination from "../../components/pagination/Pagination";

export default function Blog() {
  const { data, loading } = useFetchCollection("blog");
  const subscribers = useFetchCollection("subscribers");
  const [pending, setPending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  // const [fixHeading, setFixHeading] = useState(false);
  const [error, setError] = useState(null);
  const blogPosts = useSelector(selectBlogs);
  const [cgr, setCgr] = useState("All");
  const [showLines, setShowlines] = useState(false);
  const [display, setDisplay] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const filteredBlogPosts = useSelector(selectFilteredBlogs);
  const [scrollPage, setScrollpage] = useState(false);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  let postsArray = [];

  if (cgr === "All") {
    postsArray = blogPosts;
  } else {
    postsArray = filteredBlogPosts;
  }

  // const fixNavbar = () => {
  //   if (window.scrollY > 120) {
  //     setScrollpage(true);
  //   } else {
  //     setScrollpage(false);
  //   }
  // };
  // window.addEventListener("scroll", fixNavbar);

  const handleChangeCategory = (c) => {
    filterBlogPosts(c);
    setShowMenu(false);
  };

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
      setPending(false);
      window.scrollTo(0, 0);
      setShowAlert(true);
      setAlertMessage(`You have already subscribed to our newsletter`);
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
      setAlertMessage(`You have successfully subscribed to our newsletter!`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 8000);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(`An unexpected error occured`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  };

  const filterBlogPosts = (cat) => {
    window.scrollTo(0, 0);
    setCgr(cat);
    dispatch(FILTER_BY_CATEGORY({ blogPosts, category: cat }));
  };

  //each time they click on the read more button 'read' will increase in the collection
  const increaseRead = async (id) => {
    const getDataId = data?.filter((d) => d.id === id);
    try {
      const docRef = doc(database, "blog", getDataId[0].id);
      await updateDoc(docRef, {
        read: getDataId[0].read + 1,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const url = window.location.href;
  const handleRedirect = () => {
    if (!user) {
      dispatch(SAVE_BLOG_URL(url));
      navigate("/user/login");
    } else {
      navigate("/blog/add-blog-post");
    }
  };

  // ========pagination==========
  // const [currentPage, setCurrentPage] = useState(1);
  // const [postsPerPage] = useState(5);

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(postsArray?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(postsArray?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, postsArray]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % postsArray?.length;
    setItemOffset(newOffset);
    window.scrollTo(0, 0);
  };

  //get current products
  // const indexOfLastProduct = currentPage * postsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - postsPerPage;
  // const currentPosts = postsArray.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  return (
    <>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="progress__bar__animate"
      ></motion.div>
      <motion.section
        className="blog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <BlogHeader />
        <div className="welcome">
          <h1>
            <SiHey className="hey__icon" />
            WELCOME TO ARY HOMES BLOG
          </h1>
          <div className="menu__icon" onClick={() => setShowMenu(true)}>
            <IoMdMenu />
          </div>
          {showMenu && (
            <div className="layerr" onClick={() => setShowMenu(false)} />
          )}
          <div className={showMenu ? "menu__items show" : "menu__items"}>
            <div className="close__menu" onClick={() => setShowMenu(false)}>
              <IoCloseSharp />
            </div>

            <h3>
              <BiCategory />
              CATEGORIES
            </h3>
            {postsCategories.map((c, index) => (
              <ul key={index} className="category__li">
                <li
                  onClick={() => handleChangeCategory(c)}
                  className={`${cgr}` === c ? "cat__active__alt" : null}
                >
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
            {!user && (
              <div className="blog__auth">
                <Link to="/user/login">
                  <button>LOGIN</button>
                </Link>
                <Link to="/user/signup">
                  <button>SIGN UP</button>
                </Link>
              </div>
            )}
            <div className="add__blog__post" onClick={handleRedirect}>
              <button>ADD BLOG POST</button>
            </div>
          </div>
        </div>
        <div className="blog__contents">
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
              becoming a contributor. All you have to do is sign in, and you can
              add posts.
            </p>
            <div className="add__blog__post_p" onClick={handleRedirect}>
              <button>Add Blog Post</button>
            </div>
            Alternatively you can send details of the blog post to us and we
            would post it in your name. If you are interested in becoming a
            contributor, click on the button below to proceed.
            {display && (
              <motion.button
                onClick={handleShowLines}
                className="contributor__btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.01 }}
              >
                I want to become a contributor
              </motion.button>
            )}
            {showLines && (
              <motion.div
                className="con__buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.07 }}
              >
                <BsArrowLeft onClick={handleBack} />
                {/* <ReactWhatsapp
                number="234-905-201-4239"
                message="Hi, i am from Ary Homes website, i want to become a contributor so i can add blog posts..."
                className="blog__chat"
              >
                <span>Message line 1</span>
              </ReactWhatsapp> */}
                <ReactWhatsapp
                  number="234-810-733-9039"
                  message="Hi, i am from Ary Homes website, i want to become a contributor and add blog posts, sending the details of the blog posts now..."
                  className="blog__chat"
                >
                  <span>Send a message</span>
                </ReactWhatsapp>
              </motion.div>
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
                    {currentItems.map((post) => {
                      const {
                        id,
                        imageUrl,
                        title,
                        addedAt,
                        category,
                        likes,
                        comments,
                        uploader,
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
                            <div className="blog__buttons">
                              <Link to={`/blog/${id}`}>
                                <button
                                  className="read__more__post"
                                  onClick={() => increaseRead(id)}
                                >
                                  <GiSemiClosedEye />
                                  READ MORE
                                </button>
                              </Link>
                              <SavedBlog
                                post={post}
                                id={id}
                                setError={setError}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              {postsArray.length ? (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="Prev"
                  renderOnZeroPageCount={null}
                  containerClassName="pagination"
                  pageLinkClassName="page-num"
                  previousLinkClassName="page-num"
                  nextLinkClassName="page-num"
                  activeLinkClassName="activePage"
                />
              ) : null}
            </div>
          </div>
        </div>
        <BlogFooter />
      </motion.section>
    </>
  );
}
