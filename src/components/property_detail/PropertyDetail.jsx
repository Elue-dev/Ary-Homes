import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import { BsArrow90DegLeft, BsArrow90DegRight } from "react-icons/bs";
import { AiOutlineCalendar, AiFillTags } from "react-icons/ai";
import { TiArrowForwardOutline } from "react-icons/ti";
import { IoLocation } from "react-icons/io5";
import { ImSortAmountDesc } from "react-icons/im";
import {
  MdBookmarkAdd,
  MdOutlineAlternateEmail,
  MdOutlineSubject,
} from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import "./propertyDetail.scss";
import Loader from "../utilities/Loader";
import { useCustomAlert } from "../../contexts/AlertContext";
import GoBack from "../utilities/GoBack";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function PropertyDetail() {
  const { id } = useParams();
  const { document } = useFetchDocuments("properties", id);
  const [property, setProperty] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = property && property.imagesUrl.length;
  const { formatCurrency } = useCustomAlert();
  const form = useRef();
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  // slide length = 1 2 3...
  // currentSlide = 0 1 2 3...

  useEffect(() => {
    setMessage(`I am interested in ${property?.name}...`);
  }, [property?.name]);

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
          <div className="left__contents__card">
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
            <span>
              <AiFillTags />
              <b>Ref. ID:</b> {id}
            </span>
            <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
              <button className="copy__btn">Copy Ref ID to clipboard</button>
            </CopyToClipboard>
            <p>
              <AiOutlineCalendar />
              <b>Date Added:</b> {property.addedAt}
            </p>
            <p>
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
        </div>
        <div className="right__contents">
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
      </div>
    </section>
  );
}
