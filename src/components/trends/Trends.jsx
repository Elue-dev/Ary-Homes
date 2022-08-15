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
        {blogPost?.slice(0, 1).map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <Link to={`/blog/${post.id}`}>
              <button className="trends__read__button">Read More</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
