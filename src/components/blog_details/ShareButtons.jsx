import React from "react";
import {
  FacebookButton,
  TwitterButton,
  LinkedInButton,
  RedditButton,
} from "react-social";
import {
  FaLinkedin,
  FaTwitterSquare,
  FaFacebookSquare,
  FaRedditSquare,
} from "react-icons/fa";
import "./shareButtons.scss";
import { useLocation } from "react-router-dom";

export default function ShareButtons({ id, title, heading, name }) {
  const location = useLocation();

  const url = location.pathname.includes("blog")
    ? `https://aryhomes.netlify.app/blog${id}`
    : `https://aryhomes.netlify.app/property/${name}/${id}`;

  return (
    <div className="share__buttons">
      <h3>{heading}</h3>
      <FacebookButton
        url={url}
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        className="share__btn facebook"
      >
        <FaFacebookSquare />
      </FacebookButton>
      <TwitterButton url={url} className="share__btn twitter">
        <FaTwitterSquare />
      </TwitterButton>
      <LinkedInButton url={url} className="share__btn linkedin">
        <FaLinkedin />
      </LinkedInButton>
      <RedditButton url={url} title={title} className="share__btn reddit">
        <FaRedditSquare />
      </RedditButton>
    </div>
  );
}
