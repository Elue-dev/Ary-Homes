import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import "./comments.scss";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { selectUserID } from "../../redux/slice/authSlice";
import { useCustomAlert } from "../../contexts/AlertContext";
import useFetchCollection from "../../hooks/useFetchCollection";

export default function Comments({ id }) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const userID = useSelector(selectUserID);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const { data } = useFetchCollection("comments");
  const filteredComments = data.filter((comment) => comment.propertyID === id);

  const wrapper = showComments
    ? "comments__section__details"
    : "comments__section__details reduce__height";
  const contents = showComments ? null : "hide";

  const hanndleShowComments = () => {
    setShowComments(!showComments);
    setShowCommentForm(false);
  };

  const handleCommentForm = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowCommentForm(!showCommentForm);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment) {
      window.scrollTo(0, 0);
      setComment("");
      setShowAlert(true);
      setAlertMessage(`Add a comment before submiting`);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      return;
    }

    const today = new Date();
    const date = today.toDateString();
    const commentsConfig = {
      userID,
      name: user.displayName,
      comment,
      propertyID: id,
      commentDate: date,
      createdAt: Timestamp.now().toDate(),
    };
    await addDoc(collection(database, "comments"), commentsConfig);
    setShowComments(false);
    setShowCommentForm(false);
    window.scrollTo(0, 0);
    setComment("");
    setShowAlert(true);
    setAlertMessage(`Your comment has been added successfully`);
    setAlertType("success");
    window.setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
      setAlertType(null);
    }, 6000);
  };

  return (
    <div className="comments__section">
      <div className={wrapper}>
        <h1 onClick={hanndleShowComments}>
          <span>
            <GoCommentDiscussion />
            Comments ({filteredComments.length})
          </span>

          <div onClick={hanndleShowComments} className="toggle__icon">
            {showComments ? <BsChevronUp /> : <BsChevronDown />}
          </div>
        </h1>
        {filteredComments.length === 0 ? (
          <>
            <p className={`no__comments ${contents}`}>
              There are no comments for this property yet.
            </p>
            <button
              className={`add__comment__btn__none ${contents}`}
              onClick={handleCommentForm}
            >
              Add a comment
            </button>
          </>
        ) : (
          filteredComments.map((com, index) => {
            const { comment, name, commentDate } = com;
            return (
              <ul key={index} className={contents}>
                <li>
                  <p>&rarr; {comment}</p>
                  <br />
                  <div className="comment__name">
                    <FaUserEdit /> {name}
                  </div>
                  <div className="comment__date">
                    <MdOutlineDateRange />
                    {commentDate}
                  </div>
                </li>
                <button
                  className="add__comment__btn"
                  onClick={handleCommentForm}
                >
                  Add a comment
                </button>
              </ul>
            );
          })
        )}
        <form onSubmit={addComment} className={showCommentForm ? null : "hide"}>
          <textarea
            name=""
            id=""
            cols=""
            rows="4"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
          />
          <button type="submit" className="submit__comment__btn">
            Submit comment
          </button>
          <button
            onClick={() => setShowCommentForm(false)}
            type="button"
            className="close__comment__btn"
          >
            Close comment
          </button>
        </form>
      </div>
    </div>
  );
}
