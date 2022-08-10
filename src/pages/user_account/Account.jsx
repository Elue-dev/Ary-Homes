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
import { IoIosCreate } from "react-icons/io";
import { RiUserShared2Line } from "react-icons/ri";
import { GiBackwardTime } from "react-icons/gi";
import { MdOutlinePersonPin, MdOutlineAlternateEmail } from "react-icons/md";
import { HiPhoneIncoming } from "react-icons/hi";
import "./account.scss";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useEffect } from "react";
import { useCustomAlert } from "../../contexts/AlertContext";
import { database } from "../../firebase/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { data, loading } = useFetchCollection("users");
  const usersList = useSelector(selectUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateMail, setUpRecaptcha } = useAuth();
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
    info.userInfo?.signedInUserL ||
      "Unavailable. Enter your last name and save"
  );
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(
    info.userInfo?.signedInUserP ||
      "Unavailable. Enter your phone number and save"
  );
  const userName = useSelector(selectUserName);
  const userID = useSelector(selectUserId);

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

  console.log(user);

  return (
    <section className="user__account__info">
      <div className="user__account__info__contents">
        <div className="account__info__desc">
          <h2><RiUserShared2Line />{userName}</h2>
          <h3>Account information</h3>
          <p>
            <IoIosCreate />
            <b>Date created:</b> {createdAt}
          </p>
          <p>
            <GiBackwardTime />
            <b>Last log in:</b> {lastLogin}
          </p>
          <div>
            <b>Email verification status:</b>{" "}
            {user.emailVerified ? (
              <span style={{ color: "green" }}>Verified</span>
            ) : (
              <span style={{ color: "crimson" }}>Not Verified</span>
            )}
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
      </div>
    </section>
  );
}
