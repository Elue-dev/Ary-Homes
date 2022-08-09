import { useRef } from "react";
import { useState } from "react";
import { GrFormAdd } from "react-icons/gr";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { IoInformationCircleOutline } from "react-icons/io5";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./addProperty.scss";
import { database, storage } from "../../../firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  imagesUrl: "",
  price: "",
  location: "",
  availability: "",
  description: "",
};

export default function AddProperty() {
  const [property, setProperty] = useState(initialState);
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const featuresInput = useRef(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const imageRef = useRef(null);
  const navigate = useNavigate();

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
    e.preventDefault()

    

    try {
      const collectionRef = collection(database, "properties");
      addDoc(collectionRef, {
        name: property.name,
        imagesUrl,
        features,
        price: Number(property.price),
        location: property.location,
        availability: property.availability,
        description: property.description,
        createdAt: Timestamp.now().toDate(),
      });
      setLoading(false);
      setProperty({ ...initialState });
      setImgUploadProgress(0);
      navigate("/admin/all-propertys");
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="add__property">
      <h2>
        <GrFormAdd /> Add New Property
      </h2>
      <form onSubmit={addPropertyToDatabase}>
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
            Enter as many images as possible, Let the rooms be the last set of
            images
          </p>
          {error && <p className="alert error">{error}</p>}
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
          <select
            name="availability"
            value={property.availability}
            onChange={(e) => handleInputChange(e)}
          >
            <option value="" disabled>
              ---Choose availability status---
            </option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
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
            Enter the features one after the other, start with a capital letter
          </p>
          <div className="features">
            <input
              type="text"
              name="features"
              value={newFeature}
              ref={featuresInput}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="ENTER ONE, THEN ADD, e.g: 24hrs Electricity"
              required
            />
            <button onClick={handleAdd} className="features__btn">
              Add
            </button>
          </div>
          <div className="features__list">
            <b>Features:</b>{" "}
            {features.map((i) => (
              <em key={i}>{i}, </em>
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
        <button type="submit" className="submit__property__btn">
          Submit
        </button>
      </form>
    </div>
  );
}
