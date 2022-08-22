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

  useEffect(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const newArr = shuffle(data);
    setPost(newArr);
  }, [data]);

  return (
    <div className="related__blogs">
      <h2>You would love to read:</h2>
      <div className="post_det">
        {post?.slice(2, 6).map((p) => {
          const { imageUrl, readTime, addedAt, title, id } = p;
          return (
            <Link to={`/blog/$${id}`} key={id}>
              <div className="post_c">
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
