import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../hooks/useFetchCollection";
import {
  selectProperties,
  STORE_PROPERTIES,
} from "../../redux/slice/propertySlice";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsExclude } from "react-icons/bs";
import { BsCamera } from "react-icons/bs";
import "./properties.scss";
import { useCustomAlert } from "../../contexts/AlertContext";

export default function Recommended() {
  const [like, setLike] = useState(false);
  const { data, loading } = useFetchCollection("properties");
  const properties = useSelector(selectProperties);
  const { formatCurrency } = useCustomAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PROPERTIES({
        properties: data,
      })
    );
  }, [dispatch, data]);

  return (
    <section className="properties">
      <h2 style={{ marginBottom: ".5rem" }}>
        <BsExclude />
        Exclusive homes for you
      </h2>
      <div className="properties__contents exclusive__contents">
        {properties.slice(5, 9)?.map((property) => {
          const {
            id,
            name,
            price,
            addedAt,
            availability,
            location,
            imagesUrl,
            features,
          } = property;
          return (
            <div key={id} className="properties__details">
              <Link to={`/property/${id}`} style={{ textDecoration: "none" }}>
                <div className="properties__details__image exclusive">
                  <img src={imagesUrl[0]} alt={name} />
                  <p
                    className="property__availability"
                    style={{
                      background:
                        availability === "Available"
                          ? "rgba(136, 229, 29, 0.575)"
                          : "rgba(243, 90, 52, 0.411)",
                    }}
                  >
                    {" "}
                    {availability}
                  </p>
                  <div>
                    {like ? (
                      <FaHeart className="like__property" color="crimson" />
                    ) : (
                      <FaRegHeart className="like__property" />
                    )}
                  </div>
                </div>
                <div className="properties__details__texts">
                  <p className="property__name exclusive">
                    <span>{name}</span>
                  </p>

                  <p className="property__id">{addedAt}</p>
                  <p className="property__location">{location}</p>
                  <p className="property__price">
                    <span>NGN{formatCurrency(price)}</span>/night
                  </p>
                  <p>
                    {features.map((feature, index) => {
                      <li key={index}>{feature}</li>;
                    })}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
