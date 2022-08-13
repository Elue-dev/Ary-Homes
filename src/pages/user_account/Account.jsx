import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";
import {
  selectUserId,
  selectUserInfo,
  selectUserName,
  selectUsers,
  STORE_USERS,
  STORE_USER_ID,
  STORE_USER_INFO,
} from "../../redux/slice/authSlice";
import { IoIosClose, IoIosCreate } from "react-icons/io";
import { RiUserShared2Line } from "react-icons/ri";
import { GiBackwardTime } from "react-icons/gi";
import { MdOutlinePersonPin, MdOutlineAlternateEmail } from "react-icons/md";
import { HiPhoneIncoming } from "react-icons/hi";
import "./account.scss";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useEffect } from "react";
import { useCustomAlert } from "../../contexts/AlertContext";
import { auth, database, storage } from "../../firebase/firebase";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import userFallback from "../../assets/user.png";
import { uuidv4 } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/utilities/GoBack";
import Notiflix from "notiflix";
import BeatLoader from "react-spinners/BeatLoader";

export default function Account() {
  const [photo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFields, setShowFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = useFetchCollection("users");
  const usersList = useSelector(selectUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateMail, updatePP, logout } = useAuth();
  const lastLogin = user.metadata.lastSignInTime;
  const createdAt = user.metadata.creationTime;
  const signedInUser = usersList.users?.find((u) => u.email === user.email);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();
  const info = useSelector(selectUserInfo);
  const [firstName, setFirstName] = useState(
    info.userInfo?.signedInUserF ||
      "Unavailable. Enter your first name and save"
  );
  const [lastName, setLastName] = useState(
    info.userInfo?.signedInUserL || "Unavailable. Enter your last name and save"
  );
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(
    info.userInfo?.signedInUserP ||
      "Unavailable. Enter your phone number and save"
  );
  const userName = useSelector(selectUserName);
  const userID = useSelector(selectUserId);

  const browser = auth.clientVersion.substring(
    0,
    auth.clientVersion.indexOf("/")
  );

  const getUser = data.find((d) => d.email === user.email);

  useEffect(() => {
    setFirstName(info.userInfo?.signedInUserF);
    setLastName(info.userInfo?.signedInUserL);
    setPhone(info.userInfo?.signedInUserP);
  }, [
    info.userInfo?.signedInUserF,
    info.userInfo?.signedInUserL,
    info.userInfo?.signedInUserP,
  ]);

  useEffect(() => {
    dispatch(
      STORE_USER_ID({
        userId: signedInUser?.id,
      })
    );
  }, [dispatch, signedInUser?.id]);

  const logUserOut = async () => {
    await logout();
    navigate("/");
    setShowAlert(true);
    setAlertMessage(`You have logged out of your account, ${user.displayName}`);
    setAlertType("info");
    window.setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
      setAlertType(null);
    }, 6000);
  };

  const updateUserEmail = async () => {
    try {
      await updateMail(email);
      setEmail(email);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(error.message);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `Ary Homes/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const confirmLogOut = () => {
    Notiflix.Confirm.show(
      "You are about to log out",
      "Are you sure you want to log out?",
      "PROCEED",
      "CANCEL",
      function okCb() {
        logUserOut();
      },
      function cancelCb() {
        console.log("Deleted");
      },
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#ae8625",
        okButtonBackground: "#ae8625",
        cssAnimationStyle: "zoom",
        //other styles can be added
      }
    );
  };

  //functionality for updating the avatar when the user changes their avatar, this code is to get the logged in users firestore collection id to link it to the document
  const getColID = data.filter((u) => u.email === user.email);
  const [updateId, setUpdateId] = useState("");

  useEffect(() => {
    setUpdateId(getColID[0]?.id);
  }, [getColID]);

  const updateUserProfilePhoto = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await updatePP(imageUrl);
      //as they are updating their PP, the avatar field in users is changing as well
      const docRef = doc(database, "users", updateId);
      await updateDoc(docRef, {
        avatar: imageUrl,
      });
      setLoading(false);
      setShowAlert(true);
      setAlertMessage("Profile picture updated successfully!");
      setShowFields(false);
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      setAlertMessage(error.message);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  };

  const updateUserAccountInfo = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);

    try {
      updateUserEmail();
      const docRef = doc(database, "users", userID.userId);
      setDoc(docRef, {
        assignedID: uuidv4(),
        firstName,
        lastName,
        phone,
        avatar: "",
        joinedAt: getUser.joinedAt,
        email: email || user.email,
        editedAt: Timestamp.now().toDate(),
        createdAt: user.metadata.creationTime,
      });
      setShowAlert(true);
      setAlertMessage(
        `Your account credentials have been successfully updated`
      );
      setAlertType("success");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage("An unexpected error occured");
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
      console.log(error.message);
    }
  };

  useEffect(() => {
    dispatch(
      STORE_USERS({
        users: data,
      })
    );
  }, [dispatch, data]);

  //store user info in redux (then get it back later) so that you dont loose the data when the page refreshes.
  useEffect(() => {
    dispatch(
      STORE_USER_INFO({
        userInfo: {
          signedInUserF: signedInUser?.firstName,
          signedInUserL: signedInUser?.lastName,
          signedInUserP: signedInUser?.phone,
        },
      })
    );
  }, [
    dispatch,
    signedInUser?.firstName,
    signedInUser?.lastName,
    signedInUser?.phone,
  ]);

  return (
    <section className="user__account__info">
      <GoBack />
      <div className="user__account__info__contents">
        <div className="account__info__desc">
          <div className="account__info__flex">
            <>
              <h2>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="user"
                    className="user__profile__img"
                  />
                ) : (
                  <RiUserShared2Line />
                )}
                {userName}
              </h2>
              <p
                className="click__to__change"
                onClick={() => setShowFields(true)}
                style={{ display: showFields ? "none" : "inline-block" }}
              >
                {user.photoURL
                  ? "   Update your profile picture"
                  : "  Add a profile picture"}
              </p>
            </>
          </div>

          <div
            className="user__img__details"
            style={{ display: showFields ? "block" : "none" }}
          >
            <div className="user__img__wrapper">
              {imageUrl !== "" ? (
                <img src={imageUrl} alt="profile" className="uploaded__image" />
              ) : (
                <div className="flex__wrapper">
                  <img
                    src={userFallback}
                    alt="user"
                    className="fallback__image"
                  />
                  <IoIosClose
                    onClick={() => setShowFields(false)}
                    className="close__upload"
                  />
                </div>
              )}
            </div>
            {uploadProgress === 0 ? null : (
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress < 100
                    ? `Uploading ${uploadProgress}%`
                    : `Upload Complete ${uploadProgress}%`}
                </div>
              </div>
            )}
            <form onSubmit={updateUserProfilePhoto}>
              {imageUrl === "" ? (
                <input
                  type="file"
                  value={photo}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="pp__upload__input"
                />
              ) : null}
              &nbsp;
              {imageUrl !== "" && (
                <>
                  {loading ? (
                    <button className="pp__upload__btn">
                      <BeatLoader loading={loading} size={10} color={"#fff"} />
                    </button>
                  ) : (
                    <button className="pp__upload__btn">
                      Set as profile picture
                    </button>
                  )}
                </>
              )}
            </form>
          </div>
          <br />
          <h3>Account information</h3>
          <div className="account__info__details">
            <p>
              <IoIosCreate />
              <b>Date created:</b> {createdAt}
            </p>
            <p className="last__login">
              <GiBackwardTime />
              <b>Last log in:</b> {lastLogin}
            </p>
            <i>(login was via {browser} browser)</i>
            <div>
              <b>Email verification status:</b>{" "}
              {user.emailVerified ? (
                <span style={{ color: "green" }}>Verified</span>
              ) : (
                <span style={{ color: "crimson" }}>Not Verified</span>
              )}
            </div>
          </div>
        </div>
        <hr />
        <form onSubmit={updateUserAccountInfo}>
          <h3>Account credentials</h3>
          <div className="form__inputs">
            <label>
              <span>
                <MdOutlinePersonPin />
                First Name
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label>
              <span>
                <MdOutlinePersonPin />
                Last Name
              </span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label>
              <span>
                <MdOutlineAlternateEmail />
                Email
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <span>
                <HiPhoneIncoming />
                Phone Number
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="user__profile__btn">
            Save
          </button>
        </form>
        <div>
          <button onClick={confirmLogOut} className="account__info__logout">
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
}
