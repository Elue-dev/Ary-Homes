import React, { useRef, useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useCustomAlert } from "../../../contexts/AlertContext";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import "./addBlogPost.scss";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { database, storage } from "../../../firebase/firebase";
import { BeatLoader } from "react-spinners";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useEffect } from "react";
import { motion } from "framer-motion";

const initialState = {
  heading: "",
  imageUrl: "",
  category: "",
  uploader: "",
  likes: "",
  read: 0,
  readTime: 0,
  comments: [],
  description: "",
};

export default function AddBlogPost() {
  const [blogPost, setBlogPost] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);

  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const tagsInput = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogPost({ ...blogPost, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `AryHomesBlog/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        window.alert(
          "Image not added, only Elue Wisdom can add images to the database"
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBlogPost({ ...blogPost, imageUrl: downloadURL });
        });
      }
    );
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const t = newTag.trim();

    if (t && !tags.includes(t)) {
      setTags((prevTags) => [...prevTags, t]);
    }
    setNewTag("");
    tagsInput.current.focus();
  };

  const addBlogToDatabase = (e) => {
    e.preventDefault();

    if (tags.length < 1) {
      setError("please add at least 1 tag");
      window.setTimeout(() => setError(""), 6000);
      return;
    }

    if (blogPost.readTime <= 0) {
      setShowAlert(true);
      setAlertMessage(
        `Your input for read time cannot be 0 or less, it has to be at least 2, or more`
      );
      setAlertType("error");
      window.scrollTo(0, 0);
      return;
    }

    window.scrollTo(0, 0);
    const today = new Date();
    const date = today.toDateString();
    try {
      const collectionRef = collection(database, "blog");
      addDoc(collectionRef, {
        title: blogPost.heading,
        imageUrl: blogPost.imageUrl,
        tags,
        read: blogPost.read,
        comments: blogPost.comments,
        likes: Number(blogPost.likes),
        uploader: blogPost.uploader,
        category: blogPost.category,
        readTime: Number(blogPost.readTime),
        description: blogPost.description,
        addedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
      setShowAlert(true);
      setAlertMessage(`Blog Post added successfully`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      setLoading(false);
      setBlogPost({ ...initialState });
      setUploadProgress(0);
      navigate("/admin/home");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="add__blog__post"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h2>
        <GrFormAdd /> Add New Blog Post
      </h2>
      <form onSubmit={addBlogToDatabase}>
        {error && <p className="alert error">{error}</p>}
        <label>
          <span>Blog Post Heading:</span>
          <input
            type="text"
            name="heading"
            value={blogPost && blogPost.heading}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: It is Better to Buy than to Build a House"
            required
          />
        </label>
        <br />
        <label>
          <span>Blog Post Image:</span>
          {uploadProgress === 0 ? null : (
            <div className={"progress"}>
              <div
                className={"progress-bar"}
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress < 100
                  ? `Uploading ${uploadProgress}%`
                  : `Upload Complete ${uploadProgress}%`}
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            onChange={(e) => handleImageChange(e)}
            placeholder="Thumbnail image of blog post"
            required
          />
        </label>
        <br />
        <label>
          <span>Blog Category:</span>
          <input
            type="text"
            name="category"
            value={blogPost && blogPost.category}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Real estate, Lifestyle, Personnal development"
            required
          />
        </label>
        <br />
        <label>
          <span>Blog Post Uploader:</span>
          <input
            type="text"
            name="uploader"
            value={blogPost && blogPost.uploader}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Ary Homes, Idowu Folasade"
            required
          />
        </label>
        <br />
        <label>
          <span>Read Time:</span>
          <input
            type="number"
            name="readTime"
            value={blogPost && blogPost.readTime}
            onChange={(e) => handleInputChange(e)}
            placeholder="Must be a number eg 1, 2, 3"
            required
          />
        </label>
        <br />
        <label>
          <span>Blog Tags:</span>
          <p className="feature__info">
            <IoInformationCircleOutline />
            At least one
          </p>
          <div className="features">
            <input
              type="text"
              name="tags"
              value={newTag}
              ref={tagsInput}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="ENTER ONE, THEN CLICK ADD BUTTON"
            />
            <button onClick={handleAddTag} className="features__btn">
              Add
            </button>
          </div>
          <div className="features__list">
            <b>Tags:</b>{" "}
            {tags.map((t, index) => (
              <li>
                <em key={index}>{t}.</em>
              </li>
            ))}
          </div>
        </label>
        <br />
        <label>
          <span>Blog Post Description:</span>
          <textarea
            type="text"
            name="description"
            value={blogPost && blogPost.description}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: A beautiful 4 bedroom apartment with all en-suite private rooms, with 2 living room and a kitchen available for guests use. Apartment is in the centre of Abuja close to banks, Malls, shopping complex. It’s at a no distance from all key areas of... "
            rerquiredcols="30"
            rows="10"
            required
          />
        </label>
        {loading && (
          <button type="submit" className="submit__property__btn">
            <BeatLoader loading={loading} size={10} color={"#fff"} />
          </button>
        )}
        {!loading && (
          <button type="submit" className="submit__property__btn">
            Submit Post
          </button>
        )}
      </form>
    </motion.div>
  );
}
