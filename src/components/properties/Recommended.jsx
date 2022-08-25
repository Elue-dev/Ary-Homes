import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../hooks/useFetchCollection";
import {
  selectProperties,
  STORE_PROPERTIES,
} from "../../redux/slice/propertySlice";
import { FaGlasses } from "react-icons/fa";
import { BsExclude } from "react-icons/bs";
import "./properties.scss";
import { useCustomAlert } from "../../contexts/AlertContext";
import { ImLocation2 } from "react-icons/im";

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
    <section className="properties exclusives">
      {properties ? (
        <h2 style={{ marginBottom: ".5rem" }}>
          <BsExclude />
          Exclusive homes for you
        </h2>
      ) : null}
      <div className="properties__contents exclusive__contents">
        {properties.slice(0, 4)?.map((property) => {
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
              <div className="properties__details__image exclusive">
                <div>
                  <Link
                    to={`/property/${name}/${id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="exclusive__image__wrapper">
                      <img src={imagesUrl[0]} alt={name} />
                    </div>
                    <FaGlasses className="view__in__detail" />
                  </Link>
                </div>

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
              </div>
              <div className="properties__details__texts">
                <p className="property__name exclusive">
                  <span>{name}</span>
                </p>

                {/* <p className="property__id">Ref: {id}</p> */}
                <p className="property__location">
                  <ImLocation2 />
                  {location}
                </p>
                <p className="property__price">
                  <span>NGN{formatCurrency(price)}</span>/night
                </p>
                <p>
                  {features.map((feature, index) => {
                    <li key={index}>{feature}</li>;
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
