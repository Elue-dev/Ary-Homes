import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import {
  BsBookmarkPlus,
  BsInfoCircle,
  BsInfoLg,
  BsPatchCheckFill,
  BsTelephoneForwardFill,
} from "react-icons/bs";
import { AiOutlineCalendar, AiFillTags } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { RiAdminLine } from "react-icons/ri";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  MdBookmarkAdd,
  MdOutlineAlternateEmail,
  MdOutlineSubject,
} from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { MdMoreTime, MdSwipe } from "react-icons/md";
import { FaUser, FaRegEdit } from "react-icons/fa";
import "./propertyDetail.scss";
import { useCustomAlert } from "../../contexts/AlertContext";
import GoBack from "../utilities/GoBack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SimilarProducts from "./SimilarProducts";
import ReactWhatsapp from "react-whatsapp";
import useFetchCollection from "../../hooks/useFetchCollection";
import Comments from "./Comments";
import admin1 from "../../assets/sade.jpeg";
import admin2 from "../../assets/logo.jpg";
import Slider from "./Slider";
import Footer from "../footer/Footer";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { ADD_TO_BOOKMARKS } from "../../redux/slice/propertySlice";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { BeatLoader } from "react-spinners";
import Spinner from "../../components/utilities/Spinner";
import { SAVE_URL } from "../../redux/slice/authSlice";
import emailjs from "@emailjs/browser";
import ShareButtons from "../blog_details/ShareButtons";

export default function PropertyDetail() {
  const { id } = useParams();
  const { document } = useFetchDocuments("properties", id);
  const [property, setProperty] = useState(null);
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setShowAlert, setAlertMessage, setAlertType, formatCurrency } =
    useCustomAlert();
  const { user } = useAuth();
  const form = useRef();
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { data } = useFetchCollection("users");
  const bookmarks = useFetchCollection("bookmarks");
  const [storedBookmarks, setStoredBookmarks] = useState(null);
  const [fixPropName, setFixPropName] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminUserOne = users?.filter(
    (u) => u.email === process.env.REACT_APP_ADMIN_EMAIL
  );
  const adminUserTwo = users?.filter(
    (u) => u.email === process.env.REACT_APP_ADMIN_EMAIL_TWO
  );

  const matchBookmarks = bookmarks.data.find(
    (bm) => bm.user_email === user?.email
  );

  const matchBookmarkId = bookmarks.data.find((bm) => bm.property.id === id);

  useEffect(() => {
    setMessage(
      `I am interested in ${property?.name} with Reference ID of ${
        property?.id
      }, which goes for NGN${formatCurrency(property?.price)}/night...`
    );
  }, [property?.name, property?.id, property?.price, formatCurrency]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  useEffect(() => {
    setStoredBookmarks(bookmarks?.data);
  }, [bookmarks]);

  useEffect(() => {
    setProperty(document);
  }, [document]);

  // const fixPropertyName = () => {
  //   if (window.scrollY > 450) {
  //     setFixPropName(true);
  //   } else {
  //     setFixPropName(false);
  //   }
  // };
  // window.addEventListener("scroll", fixPropertyName);

  useEffect(() => {
    if (copied) {
      setAlert("Reference ID copied to clipboard");
      window.setTimeout(() => {
        setAlert("");
      }, 4000);
    }
  }, [copied]);

  const url = window.location.href;
  const addToBookmarks = async (p) => {
    setLoading(true);

    if (!user) {
      dispatch(SAVE_URL(url));
      navigate("/user/login");
      setLoading(false);
      setShowAlert(true);
      setAlertMessage(`You have to be logged in to bookmark properties`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      return;
    }

    if (matchBookmarks && matchBookmarkId) {
      setAlert("This property is already in your bookmarks");
      window.setTimeout(() => setAlert(null), 4000);
      setLoading(false);
      return;
    }

    dispatch(ADD_TO_BOOKMARKS(p));
    setLoading(false);
    setShowAlert(true);
    window.scrollTo(0, 0);
    setAlertMessage(`${p.name} added to your bookmarks`);
    setAlertType("success");
    window.setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
      setAlertType(null);
    }, 6000);

    // ===store bookmark in database as well====
    const today = new Date();
    const date = today.toDateString();
    try {
      const docRef = collection(database, "bookmarks");
      await addDoc(docRef, {
        property: p,
        user_email: user.email,
        bookmarkedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    setLoading(true);

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAIJS_SERVICE_ID,
        "template_fv6c1c2",
        form.current,
        "rzn_FYgukUIewDy1s"
      )
      .then(
        (result) => {
          setLoading(false);
          setShowAlert(true);
          window.scrollTo(0, 0);
          setAlertMessage(
            `Your message was sent successfully, we'll keep in touch.`
          );
          setAlertType("success");
          window.setTimeout(() => {
            setShowAlert(false);
            setAlertMessage(null);
            setAlertType(null);
          }, 6000);
        },
        (error) => {
          setLoading(false);
          setShowAlert(true);
          window.scrollTo(0, 0);
          setAlertMessage(error.text);
          setAlertType("error");
          window.setTimeout(() => {
            setShowAlert(false);
            setAlertMessage(null);
            setAlertType(null);
          }, 6000);
        }
      );
    e.target.reset();
  };

  if (!property) {
    return <Spinner />;
  }

  return (
    <>
      <div className="popup">
        {showSlider && (
          <div>
            <Slider property={property} setShowSlider={setShowSlider} />
          </div>
        )}
      </div>
      <motion.section
        className="property__details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GoBack />
        <div className="contacts__bottom__wrapper">
          <div className="contacts__bottom">
            <div className="single__item">
              <img src={admin2} alt={adminUserTwo[0]?.lastName} />
              <ReactWhatsapp
                number="234-905-201-4239"
                message={`Hi, i am from Ary Homes website, i want to make an inquiry about ${property.name}...`}
                className="whatsapp"
              >
                <span>MESSAGE</span>
              </ReactWhatsapp>
            </div>
            <div className="single__item">
              <img src={admin1} alt={adminUserOne[0]?.lastName} />
              <ReactWhatsapp
                number="234-816-894-5509"
                message={`Hi, i am from Ary Homes website, i want to make an inquiry about ${property.name}...`}
                className="whatsapp"
              >
                <span>MESSAGE</span>
              </ReactWhatsapp>
            </div>
          </div>
        </div>

        <p className="details__links">
          <Link to="/">Home</Link>
          <BiChevronsRight /> <span>{property?.name}</span>
        </p>

        <div className="property__details__contents">
          <div className="left__contents">
            <div className="property__details__images">
              {property.imagesUrl.map((image, index) => (
                //i removed this onclick from the div below...onClick={() => setShowSlider(true)}
                <div ??adskey={index}>
                  <p className="image__length">
                    {property.imagesUrl.indexOf(image) + 1} /{" "}
                    {property.imagesUrl.length}{" "}
                  </p>
                  <img src={image} alt={property.name} />
                </div>
              ))}
            </div>
            <h3
              // onClick={() => setShowSlider(true)}
              style={{ cursor: "pointer", fontSize: ".9rem" }}
            >
              <MdSwipe />
              &nbsp; <b>Swipe to see all {property.imagesUrl.length} images</b>
            </h3>
            <div
              className={
                fixPropName
                  ? "left__contents__card fix"
                  : "left__contents__card"
              }
            >
              <div className="card__name">
                {property && <h2>{property.name}</h2>}
                <p className="property__location">
                  <IoLocation />
                  {property.location}
                </p>
              </div>
              <h3>NGN {formatCurrency(property.price)}/night</h3>
            </div>
            <div className="other__details">
              <p className="availability__texts">
                <MdBookmarkAdd />
                <b>Availability status:</b>
                <span
                  style={{
                    color:
                      property.availability === "Available"
                        ? "green"
                        : "crimson",
                  }}
                >
                  {property.availability}
                </span>
              </p>
              <p>
                <AiOutlineCalendar />
                <b>Date Added:</b> {property.addedAt}
              </p>
              <p>
                <MdMoreTime />
                <b>Minimum stay:</b>{" "}
                {property.minumum_stay === "N/A" ? (
                  <p>N/A</p>
                ) : (
                  <>
                    {property.minumum_stay}{" "}
                    {property.minumum_stay === "1" ? "Night" : "Nights"}
                  </>
                )}
              </p>
              {property.editedAt ? (
                <p>
                  <FaRegEdit />
                  <b>Last Edited:</b> {property.editedAt}
                </p>
              ) : null}
              <span>
                <AiFillTags />
                <b>Ref. ID:</b> {id}
              </span>
              {alert && (
                <p
                  className="alert message"
                  style={{ width: "fit-content", height: "1.6rem" }}
                >
                  {alert}
                </p>
              )}
              <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
                <button className="copy__btn">
                  Copy Reference ID to clipboard
                </button>
              </CopyToClipboard>
              {property.availability === "Not Available" && (
                <p className="details__warning">
                  <BsInfoCircle />
                  Properties like this that are unavilable can be available at
                  later dates, ensure to keep checking.
                </p>
              )}
            </div>

            <div className="property__features">
              <h2>What does this property offer?</h2>
              <div className="flex__features">
                {property.features.map((feature, index) => (
                  <ul key={index}>
                    <li>
                      {/* <TiArrowForwardOutline /> */}
                      <AiFillCheckCircle />
                      {feature}.
                    </li>
                  </ul>
                ))}
              </div>
            </div>
            <div className="property__description">
              <h2>
                <TbListDetails />
                Description
              </h2>
              <p>{property.description}</p>
            </div>
            <div className="contact__info">
              <div className="contact__info__details">
                <h2>
                  <RiAdminLine style={{ color: "#888" }} />
                  Contact the administrators
                </h2>
                {property.availability === "Not Available" ? (
                  <p style={{ marginTop: ".5rem" }}>
                    Contacts of the administrators will be provided when this
                    property is avilable.
                  </p>
                ) : (
                  <div className="admins">
                    <div className="admin__two">
                      <img src={admin2} alt={adminUserTwo[0]?.lastName} />
                      <BsPatchCheckFill className="verified__icon" />
                      <a href="tel:+2349052014239">
                        <BsTelephoneForwardFill />
                        09052014239
                      </a>
                      {/* <ReactWhatsapp
                        number="234-905-201-4239"
                        message={`Hi, i am from Ary Homes website, i want to make an inquiry about ${property.name}...`}
                        className="whatsapp"
                      >
                        <TbBrandWhatsapp />
                        <span>MESSAGE</span>
                      </ReactWhatsapp> */}
                    </div>
                    <div className="admin__one">
                      <div className="admin__image__wrapper">
                        <img src={admin1} alt={adminUserOne[0]?.lastName} />
                        <BsPatchCheckFill className="verified__icon" />
                      </div>
                      <a href="tel:+2348168945509">
                        <BsTelephoneForwardFill />
                        08168945509
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Comments id={id} />
            <div className="save__for__later">
              {alert && (
                <p
                  className="alert"
                  style={{
                    width: "fit-content",
                    fontSize: ".9rem",
                    color: "#ae8625",
                  }}
                >
                  <BsInfoLg />
                  {alert}
                </p>
              )}
              <h3>
                {" "}
                <BsBookmarkPlus />
                Bookmark Property
              </h3>
              <p>
                {" "}
                Wish to save this property to your bookmarks to view later?
                click on the button below...
              </p>
              {loading ? (
                <button className="bookmark__btn" disabled>
                  <BeatLoader loading={loading} size={10} color={"#fff"} />
                </button>
              ) : (
                <button
                  onClick={() => addToBookmarks(property)}
                  className="bookmark__btn"
                >
                  Add to bookmarks
                </button>
              )}
            </div>
            <ShareButtons property_id={id} heading="Share this property" />
          </div>
          <div className="right__contents">
            <div>
              <h3>Need to reach out?</h3>
              <form ref={form} onSubmit={sendEmail}>
                <label>
                  <FaUser />
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Full Name"
                    required
                  />
                </label>
                <label>
                  <MdOutlineAlternateEmail />
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Your email"
                    required
                  />
                </label>
                <label>
                  <MdOutlineSubject />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject, e.g Enquiry about a property"
                    required
                  />
                </label>
                <label>
                  <textarea
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    cols=""
                    rows="6"
                    required
                  ></textarea>
                </label>
                {loading ? (
                  <button
                    type="button"
                    disabled
                    className="property__message__btn"
                  >
                    <BeatLoader loading={loading} size={10} color={"#fff"} />
                  </button>
                ) : (
                  <button type="submit" className="property__message__btn">
                    SEND MESSAGE
                  </button>
                )}
              </form>
              <p>
                By proceeding, you consent to receive texts at the email you
                provided. We promise not to spam you.
              </p>
            </div>
            <SimilarProducts />
          </div>
        </div>
        <Footer />
      </motion.section>
    </>
  );
}
