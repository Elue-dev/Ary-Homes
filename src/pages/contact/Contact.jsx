import { useState, useRef } from "react";
import { BsInstagram } from "react-icons/bs";
import { FaPhoneSquareAlt, FaUser } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { GrMail } from "react-icons/gr";
import { MdOutlineAlternateEmail, MdOutlineSubject } from "react-icons/md";
import { SiRocketdotchat, SiFacebook } from "react-icons/si";
import ReactWhatsapp from "react-whatsapp";
import "./contact.scss";
import Footer from "../../components/footer/Footer";
import { motion } from "framer-motion";
import facebook from "../../assets/facebook.svg";

export default function Contact() {
  const form = useRef();
  const [message, setMessage] = useState("");

  return (
    <motion.section
      className="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="contact__hero">
        <div className="head__contact">
          <h2>CONTACT US</h2>
        </div>
      </div>

      <div className="socials">
        <a href="mailto: aryhomes1@gmail.com">
          <GrMail className="c_icon" />
          {/* <img src={facebook} alt="" className="c_icon" /> */}
        </a>
        <a href="https://www.facebook.com/aryhomes">
          <SiFacebook className="c_icon" />
          {/* <img src={facebook} alt="" className="c_icon" /> */}
        </a>
        <a href="https://www.instagram.com/aryhomes">
          <BsInstagram className="c_icon" />
        </a>
      </div>
      <div className="contact__contents">
        <div className="flex__cards">
          <div className="left__info">
            <div className="phone__contact">
              <FaPhoneSquareAlt className="phone__contact__icon" />
              <p>Talk to administrators</p>
              <p>
                If you are interested in our property or have questions, talk to
                us directly
              </p>
              <p>
                <b style={{ fontSize: "1.1rem" }}>Line 1:</b>
                &nbsp;&nbsp;<a href="tel:2349052014239">+234 905 201 4239</a>
              </p>
              <p>
                <b style={{ fontSize: "1.1rem" }}>Line 2:</b>
                &nbsp;&nbsp;<a href="tel:348168945509">+234 816 894 5509</a>
              </p>
            </div>
            <br />
            <div className="message__contact">
              <IoChatbubbles className="message__contact__icon" />
              <p>Have a private chat</p>
              <p>
                Prefer chats to phone calls? you can also talk to us via chat
              </p>
              <ReactWhatsapp
                number="234-905-201-4239"
                message="Hi, i am from Ary Homes website, i want to make an inquiry..."
                className="chat"
              >
                <SiRocketdotchat />
                &nbsp; <span>Chat line 1</span>
              </ReactWhatsapp>
              <ReactWhatsapp
                number="234-816-894-5509"
                message="Hi, i am from Ary Homes website, i want to make an inquiry..."
                className="chat"
              >
                <SiRocketdotchat />
                &nbsp; <span>Chat line 2</span>
              </ReactWhatsapp>
            </div>
          </div>
          <div className="right__info">
            <p>
              {" "}
              Fill this form with inquiries and get to us. We respond within 24
              hrs.
            </p>
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
                  placeholder="Enter your message"
                ></textarea>
              </label>
              <button type="submit" className="property__message__btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932730206!2d3.1438721683089748!3d6.548376809037112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1660353745009!5m2!1sen!2sng"
          width="100%"
          height="450"
          style={{ border: 0, paddingTop: "2rem" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <Footer />
    </motion.section>
  );
}
