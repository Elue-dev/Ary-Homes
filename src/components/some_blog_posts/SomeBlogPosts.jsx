import { useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { BsFileEarmarkPost } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import useFetchCollection from "../../hooks/useFetchCollection";
import "./someBlogPosts.scss";

export default function SomeBlogPosts() {
  const { data } = useFetchCollection("blog");
  const [blogPosts, setBlogPosts] = useState(null);

  useEffect(() => {
    setBlogPosts(data);
  }, [data]);

  return (
    <div className="some__blog__posts">
      {blogPosts && (
        <h1>
          <BsFileEarmarkPost />
          Posts from our blog
        </h1>
      )}
      <div className="p_grid">
        {blogPosts?.slice(0, 5).map((post) => {
          const { id, addedAt, readTime, title, imageUrl, category } = post;
          return (
            <Link key={id} to={`/blog/${id}`}>
              <div className="some__posts__det">
                <div className="s_img">
                  <img src={imageUrl} alt={title} />
                  <p>{category}</p>
                  <b>
                    <FaRegEye />
                  </b>
                </div>
                <div className="s_content">
                  <h3>{title}</h3>
                  <div className="b_content">
                    <p>
                      {" "}
                      <MdOutlineDateRange />
                      {addedAt}
                    </p>
                    <p>
                      {" "}
                      <BiTimeFive />
                      {readTime} mins read
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
