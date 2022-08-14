import React, { useEffect } from "react";
import { useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { MdOutlineDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import useFetchCollection from "../../../hooks/useFetchCollection";
import "./otherPosts.scss";

export default function OtherPosts() {
  const { data } = useFetchCollection("blog");
  const [post, setPost] = useState(null);
  const [newPost, setNewPost] = useState([]);

  useEffect(() => {
    setPost(data);
  }, [data]);

  return (
    <div className="related__blogs">
      <h2>You would love to read:</h2>
      <div className="post_det">
        {post?.map((p) => {
          const { imageUrl, readTime, addedAt, title, id } = p;
          return (
            <Link to={`/blog/${id}`}>
              <div key={id} className="post_c">
                <div className="post_Iurl">
                  <img src={imageUrl} alt={title} />
                </div>
                <h4>{title}</h4>
                <div className="post_con">
                  <div className="addedAt">
                    <p>
                      <MdOutlineDateRange />
                      {addedAt}
                    </p>
                  </div>
                  <div className="readTime">
                    <p>
                      <BiTimeFive />
                      {readTime}
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
