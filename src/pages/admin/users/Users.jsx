import { useEffect } from "react";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { useDispatch, useSelector } from "react-redux";
import "./users.scss";
import { FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import { selectUsers, STORE_USERS } from "../../../redux/slice/authSlice";
import { database } from "../../../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useCustomAlert } from "../../../contexts/AlertContext";
import Loader from "../../../components/utilities/Loader";
import { motion } from "framer-motion";

export default function Users() {
  const { data, loading } = useFetchCollection("users");
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  useEffect(() => {
    dispatch(STORE_USERS(data));
  }, [dispatch, data]);

  const deleteUserFromDatabase = async (id) => {
    try {
      await deleteDoc(doc(database, "users", id));
    } catch (error) {
      setAlertMessage(error.message);
      setAlertType("error");
      window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage(null);
        setAlertType(null);
      }, 6000);
    }
  };

  const confirmDelete = (id, username) => {
    Notiflix.Confirm.show(
      "Delete User",
      `Are you sure you want to delete ${username} from the users list?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteUserFromDatabase(id);
        setAlertMessage(`You have deleted user`);
        setAlertType("success");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#ae8625",
        okButtonBackground: "#ae8625",
        cssAnimationStyle: "zoom",
      }
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.section
      className="users__admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="users__admin__contents">
        <h2>Users</h2>
        <br />
        <>
          <div className="table">
            {users.length === 0 ? (
              <p>You have no users at the moment</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Assigned ID</th>
                    <th>Date Joined</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Delete User</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user, index) => {
                    const { id, email, joinedAt, firstName, lastName } = user;
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{id}</td>
                        <td>{joinedAt}</td>
                        <td>{email}</td>
                        <td>
                          <p style={{ fontWeight: "500" }}>
                            {firstName + " " + lastName}
                          </p>
                        </td>
                        <td>
                          <FaTrashAlt
                            size={18}
                            color="#ae8625"
                            onClick={() => confirmDelete(id, firstName)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </motion.section>
  );
}
