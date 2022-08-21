import { useState } from "react";
import { motion } from "framer-motion";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProperties,
  STORE_PROPERTIES,
} from "../../../redux/slice/propertySlice";
import { useEffect } from "react";
import {
  FILTER_BY_SEARCH,
  selectFilteredProperties,
} from "../../../redux/slice/filterSlice";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import Loader from "../../../components/utilities/Loader";
import { useCustomAlert } from "../../../contexts/AlertContext";
import { deleteDoc, doc } from "firebase/firestore";
import { database, storage } from "../../../firebase/firebase";
import { deleteObject, ref } from "firebase/storage";

import "./viewProperties.scss";
import Pagination from "../../../components/pagination/Pagination";

export default function ViewProperties() {
  const { data, loading } = useFetchCollection("properties");
  const [search, setSearch] = useState("");
  const properties = useSelector(selectProperties);
  const filteredProperties = useSelector(selectFilteredProperties);
  const { setShowAlert, setAlertMessage, setAlertType, formatCurrency } =
    useCustomAlert();
  const dispatch = useDispatch();

  // ========pagination==========
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setpropertiesPerPage] = useState(5);

  //get current products
  const indexOfLastProduct = currentPage * propertiesPerPage;
  const indexOfFirstProduct = indexOfLastProduct - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    dispatch(
      STORE_PROPERTIES({
        properties: data,
      })
    );
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        properties,
        search,
      })
    );
  }, [dispatch, properties, search]);

  const deleteProduct = async (id, imagesUrl) => {
    try {
      await deleteDoc(doc(database, "properties", id));
      const storageRef = ref(storage, imagesUrl);
      await deleteObject(storageRef)
        .then(() => {
          "";
        })
        .catch((error) => {
          setShowAlert(true);
          setAlertMessage(error.message);
          setAlertType("error");
          window.setTimeout(() => {
            setShowAlert(false);
            setAlertMessage(null);
            setAlertType(null);
          }, 6000);
        });
    } catch (error) {
      if (error.message === "Missing or insufficient permissions.") {
        setShowAlert(true);
        setAlertMessage(
          "Missing or insufficient permissions. Contact the developer of this application"
        );
        setAlertType("error");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
      }
    }
  };

  const confirmDelete = (id, name, imageUrl) => {
    Notiflix.Confirm.show(
      "Delete Property",
      `Are you sure you want to delete ${name} from your bookmarks?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteProduct(id, imageUrl);
        setShowAlert(true);
        setAlertMessage(` ${name} has been deleted successfully`);
        setAlertType("info");
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="view__prop__admin"
    >
      <label>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Property location or name"
        />
      </label>
      {search && (
        <>
          <h3>
            Property locations including{" "}
            <b>
              <em>'{search}'</em>
            </b>{" "}
          </h3>
          {filteredProperties.length !== 0 && (
            <h3>
              <>
                ({filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "RESULT" : "RESULTS"})
              </>
            </h3>
          )}
        </>
      )}
      <div className="table">
        {filteredProperties.length === 0 ? (
          <h2>
            <b>No Product(s) Found.</b>
          </h2>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Reference ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Date Added</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProperties?.map((property, index) => {
                const { id, name, price, imagesUrl, addedAt, location } =
                  property;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{id}</td>
                    <td>
                      <img
                        src={imagesUrl[0]}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{location}</td>
                    <td>{addedAt}</td>
                    <td>NGN {formatCurrency(price)}</td>
                    <td className="icons">
                      <Link to={`/admin/add-property/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id, name, imagesUrl)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          propertiesPerPage={propertiesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProducts={filteredProperties.length}
        />
      </div>
    </motion.div>
  );
}
