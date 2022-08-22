import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchCollection from "../../hooks/useFetchCollection";
import "./trends.scss";

export default function Trends() {
  const { data } = useFetchCollection("blog");
  const [blogPost, setBlogPost] = useState(null);
  const [firstPost, setFirstPost] = useState(null);

  useEffect(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const newArr = shuffle(data);
    setBlogPost(newArr);
  }, [data]);

  useEffect(() => {
    setFirstPost(blogPost && blogPost[0]);
  }, [blogPost]);

  return (
    <section
      className="trends__wrapper"
      style={{ background: `url(${firstPost?.imageUrl})` }}
    >
      <div className="trends__contents">
        <p>Recent Blog Post</p>
        <div>
          <h2>{firstPost?.title}</h2>
          <Link to={`/blog/${firstPost?.id}`}>
            <button className="trends__read__button">Read More</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
