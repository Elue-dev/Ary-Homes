import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchCollection from "../../hooks/useFetchCollection";
import "./trends.scss";

export default function Trends() {
  const { data } = useFetchCollection("blog");
  const [blogPost, setBlogPost] = useState(null);

  useEffect(() => {
    setBlogPost(data);
  }, [data]);

  return (
    <section className="trends__wrapper">
      <div className="trends__contents">
        <p>Trends</p>
        <div>
          <h2>
            Why your work space must look refreshing and clean, and how it
            affects performance
          </h2>
          <Link to="/blog/jbKYMwc3jhRMvrNRwpxc">
            <button className="trends__read__button">Read More</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
