import { useRef } from "react";
import { useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { IoInformationCircleOutline, IoOptionsOutline } from "react-icons/io5";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./addProperty.scss";
import { database, storage } from "../../../firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import Select from "react-select";
import { useCustomAlert } from "../../../contexts/AlertContext";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { motion } from "framer-motion";

const initialState = {
  name: "",
  imagesUrl: "",
  price: "",
  location: "",
  availability: "",
  description: "",
};

const status = [
  { value: "Available", label: "Available" },
  { value: "Not Available", label: "Not Available" },
];

export default function AddProperty() {
  const [property, setProperty] = useState(initialState);
  const [option, setOption] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const featuresInput = useRef(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const { data } = useFetchCollection("blogComments");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const feat = newFeature.trim();

    if (feat && !features.includes(feat)) {
      setFeatures((prevFeatures) => [...prevFeatures, feat]);
    }
    setNewFeature("");
    featuresInput.current.focus();
  };

  const handleImageChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = () => {
    if (images.length === 0) {
      setError("You cannot leave this blank");
      window.setTimeout(() => setError(""), 6000);
      return;
    }
    if (images.length === 1) {
      setError("Images must be more than 1, please add more.");
      return;
    }

    images.map((image) => {
      const storageRef = ref(storage, `Ary Homes/${Date.now()}${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgUploadProgress(progress);
        },
        (error) => {
          alert(error.message);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImagesUrl((prevState) => [...prevState, downloadURL]);
          });
        }
      );
    });
  };

  const addPropertyToDatabase = (e) => {
    e.preventDefault();

    if (features.length <= 4) {
      setError("please add at least 5 features of this property");
      window.setTimeout(() => setError(""), 6000);
      return;
    }

    if (imagesUrl.length === 0) {
      setError("please add images");
      window.setTimeout(() => setError(""), 6000);
      return;
    }

    if (!option) {
      setError("please select the availability status for this property");
      window.setTimeout(() => setError(""), 6000);
      return;
    }
    window.scrollTo(0, 0);
    const today = new Date();
    const date = today.toDateString();
    try {
      const collectionRef = collection(database, "properties");
      addDoc(collectionRef, {
        name: property.name,
        imagesUrl,
        features,
        price: Number(property.price),
        location: property.location,
        availability: option.label,
        description: property.description,
        addedAt: date,
        createdAt: Timestamp.now().toDate(),
      });
      setShowAlert(true);
      setAlertMessage(`Product added successfully`);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      setLoading(false);
      setProperty({ ...initialState });
      setImgUploadProgress(0);
      navigate("/user/admin/home");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="add__property"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h2>
        <GrFormAdd /> Add New Property
      </h2>

      <form onSubmit={addPropertyToDatabase}>
        {error && <p className="alert error">{error}</p>}
        <label>
          <span>Property Name:</span>
          <input
            type="text"
            name="name"
            value={property && property.name}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: 3 Bedroom Duplex For rent"
            required
          />
        </label>
        <br />
        <label>
          <span>Property Images:</span>
          <p className="images__info">
            <IoInformationCircleOutline />
            Enter as many images as possible(6 at least), Let the rooms be the
            last set of images
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={imageRef}
            onChange={(e) => handleImageChange(e)}
            placeholder="Images of the property"
            required
          />

          {imageRef.current && (
            <>
              {imgUploadProgress === 100 ? (
                <p className="success__msg">
                  <BsFillCheckCircleFill /> Images uploaded successfully
                </p>
              ) : (
                <button
                  onClick={handleUpload}
                  type="button"
                  style={{ width: "50%", fontSize: ".8rem" }}
                  className="upload__btn"
                >
                  Click to upload images
                </button>
              )}
            </>
          )}
        </label>
        <br />
        <label>
          <span>Property Price (per night):</span>
          <input
            type="text"
            name="price"
            value={property && property.price}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: 70000 not 70,000 (DON'T PUT COMMAS)"
            required
          />
        </label>
        <br />
        <label>
          <span>Availability of property</span>
          {/* <select
            name="availability"
            value={property.availability}
            onChange={(e) => handleInputChange(e)}
          >
            <option value="" disabled>
              ---Choose availability status---
            </option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select> */}
          <Select
            options={status}
            onChange={(option) => setOption(option)}
            placeholder="Choose one"
            className="select__input"
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "rgb(193, 180, 100)",
                primary: "rgb(193, 180, 100)",
              },
            })}
          />
        </label>

        <br />
        <label>
          <span>Property Location:</span>
          <input
            type="text"
            name="location"
            value={property && property.location}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Victoria Island"
            required
          />
        </label>
        <br />
        <label>
          <span>Property Features:</span>
          <p className="feature__info">
            <IoInformationCircleOutline />
            Must not be less than 5. Enter the features one after the other,
            start each with a capital letter (e.g: 24hrs Electricity, WiFi
            access, Great security)
          </p>
          <div className="features">
            <input
              type="text"
              name="features"
              value={newFeature}
              ref={featuresInput}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="ENTER ONE, THEN CLICK ADD BUTTON"
            />
            <button onClick={handleAdd} className="features__btn">
              Add
            </button>
          </div>
          <div className="features__list">
            <b>Features:</b>{" "}
            {features.map((i) => (
              <li>
                <em key={i}>{i}.</em>
              </li>
            ))}
          </div>
        </label>
        <br />
        <label>
          <span>Property Description:</span>
          <textarea
            type="text"
            name="description"
            value={property && property.description}
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
            Submit
          </button>
        )}
      </form>
    </motion.section>
  );
}
