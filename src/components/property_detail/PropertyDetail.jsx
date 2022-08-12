import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import {
  BsArrow90DegLeft,
  BsArrow90DegRight,
  BsInfoCircle,
  BsPatchCheckFill,
  BsTelephoneForwardFill,
} from "react-icons/bs";
import { TbBrandWhatsapp } from "react-icons/tb";
import { AiOutlineCalendar, AiFillTags } from "react-icons/ai";
import { TiArrowForwardOutline } from "react-icons/ti";
import { IoLocation } from "react-icons/io5";
import { ImSortAmountDesc } from "react-icons/im";
import { GrUserAdmin } from "react-icons/gr";
import {
  MdBookmarkAdd,
  MdOutlineAlternateEmail,
  MdOutlineSubject,
} from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { FaProductHunt, FaUser } from "react-icons/fa";
import "./propertyDetail.scss";
import Loader from "../utilities/Loader";
import { useCustomAlert } from "../../contexts/AlertContext";
import GoBack from "../utilities/GoBack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SimilarProducts from "./SimilarProducts";
import ReactWhatsapp from "react-whatsapp";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useAuth } from "../../contexts/AuthContext";
import Comments from "./Comments";
import admin1 from "../../assets/wisdom.jpeg";
import admin2 from "../../assets/admin2.jpeg";

export default function PropertyDetail() {
  const { id } = useParams();
  const { document } = useFetchDocuments("properties", id);
  const [property, setProperty] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = property && property.imagesUrl.length;
  const { formatCurrency } = useCustomAlert();
  const form = useRef();
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const { data } = useFetchCollection("users");
  const [fixPropName, setFixPropName] = useState(false);

  const adminUserOne = users?.filter(
    (u) => u.email === process.env.REACT_APP_ADMIN_EMAIL
  );
  const adminUserTwo = users?.filter(
    (u) => u.email === process.env.REACT_APP_ADMIN_EMAIL_TWO
  );

  useEffect(() => {
    setMessage(`I am interested in ${property?.name}...`);
  }, [property?.name]);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  useEffect(() => {
    setProperty(document);
  }, [document]);

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  const nextSlide = () => {
    //ternary: if we are on the last slide, set current slide to 0 (the beginning), else add one to the current slide
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  const fixPropertyName = () => {
    if (window.scrollY > 300) {
      setFixPropName(true);
    } else {
      setFixPropName(false);
    }
  };
  window.addEventListener("scroll", fixPropertyName);

  useEffect(() => {
    if (copied) {
      setShowAlert(true);
      setAlertMessage(`Reference ID copied to clipboard`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  }, [copied]);

  if (!property) {
    return <Loader />;
  }

  if (!property.imagesUrl) {
    return <Loader />;
  }

  return (
    <section className="property__details">
      <GoBack />
      <p className="details__links">
        <Link to="/">Home</Link>
        <BiChevronsRight /> <span>{property?.name}</span>
      </p>
      <div className="property__details__contents">
        <div className="left__contents">
          <div
            className={
              fixPropName ? "left__contents__card fix" : "left__contents__card"
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
              <b>Availabiity status:</b>
              <span
                style={{
                  color:
                    property.availability === "Available" ? "green" : "crimson",
                }}
              >
                {property.availability}
              </span>
            </p>
            <p>
              <AiOutlineCalendar />
              <b>Date Added:</b> {property.addedAt}
            </p>
            <span>
              <AiFillTags />
              <b>Ref. ID:</b> {id}
            </span>
            <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
              <button className="copy__btn">
                Copy Reference ID to clipboard
              </button>
            </CopyToClipboard>
            {property.availability === "Not Available" && (
              <p className="details__warning">
                <BsInfoCircle />
                Properties like this that are unavilable can be available at later dates,
                ensure to keep checking.
              </p>
            )}
          </div>
          <div className="property__details__images">
            {property.imagesUrl.slice(0, 6)?.map((image, index) => (
              <div key={index}>
                <img src={image} alt={property.name} />
              </div>
            ))}
          </div>
          <div className="property__features">
            <h2>What does this property offer?</h2>
            <div className="flex__features">
              {property.features.map((feature, index) => (
                <ul key={index}>
                  <li>
                    <TiArrowForwardOutline />
                    {feature}.
                  </li>
                </ul>
              ))}
            </div>
          </div>
          <div className="property__description">
            <h2>
              <ImSortAmountDesc />
              Description
            </h2>
            <p>{property.description}</p>
          </div>
          <div className="contact__info">
            <div className="contact__info__details">
              <h2>
                <GrUserAdmin />
                Contact the administrators
              </h2>
              {property.availability === "Not Available" ? (
                <p style={{ marginTop: ".5rem" }}>
                  Contacts of the administrators will be provided when this
                  product is avilable.
                </p>
              ) : (
                <div className="admins">
                  <div className="admin__one">
                    <div className="admin__image__wrapper">
                      <img src={admin1} alt={adminUserOne[0]?.lastName} />
                      <BsPatchCheckFill className="verified__icon" />
                    </div>
                    <a href="tel:+2348107339039">
                      <BsTelephoneForwardFill />
                      {adminUserOne[0]?.phone}
                    </a>
                    <ReactWhatsapp
                      number="234-810-733-9039"
                      message="Hi, i am from Ary Homes website, i want to make an inquiry about a property.."
                      className="whatsapp"
                    >
                      <TbBrandWhatsapp />
                      &nbsp; <span>Message</span>
                    </ReactWhatsapp>
                  </div>
                  <div className="admin__two">
                    <img src={admin2} alt={adminUserTwo[0]?.lastName} />
                    <BsPatchCheckFill className="verified__icon" />
                    <a href="tel:+2348125258449">
                      <BsTelephoneForwardFill />
                      {adminUserTwo[0]?.phone}
                    </a>
                    <ReactWhatsapp
                      number="234-812-525-8449"
                      message="Hi, i am from Ary Homes website, i want to make an inquiry about a property.."
                      className="whatsapp"
                    >
                      <TbBrandWhatsapp />
                      &nbsp; <span>Message</span>
                    </ReactWhatsapp>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Comments id={id} />
        </div>
        <div className="right__contents">
          <div>
            <h3>Need to reach out?</h3>
            <form ref={form}>
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
                  placeholder="Subject"
                  required
                />
              </label>
              <label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  cols=""
                  rows="3"
                ></textarea>
              </label>
              <button type="submit" className="property__message__btn">
                Send Message
              </button>
            </form>
            <p>
              By proceeding, you consent to receive texts at the email you
              provided. We promise not to spam you.
            </p>
          </div>
          <SimilarProducts />
        </div>
      </div>
    </section>
  );
}
