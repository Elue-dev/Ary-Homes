import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCustomAlert } from "../../contexts/AlertContext";
import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../utilities/Loader";
import { WiStars } from "react-icons/wi";
import { IoLocation } from "react-icons/io5";
import "./similarProducts.scss";

export default function SimilarProducts() {
  const [properties, setProperties] = useState([]);
  const { data, loading } = useFetchCollection("properties");
  const { formatCurrency } = useCustomAlert();

  useEffect(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const newArr = shuffle(data);
    setProperties(newArr);
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="similar__properties">
      <div className="similar__properties__contents">
        <h3>Similar Properties</h3>
        <div className="md__property__grid">
          {properties &&
            properties.slice(0, 3)?.map((property) => {
              const { id, name, imagesUrl, price, location } = property;
              return (
                <Link to={`/property/${id}`} key={id}>
                  <div className="similar__properties__details">
                    <div className="similar__images">
                      <img src={imagesUrl && imagesUrl[0]} alt={name} />
                    </div>
                    <h2>{name}</h2>
                    <div className="similar__list">
                      {/* {features?.slice(0, 4)?.map((feature, index) => (
                        <ul key={index}>
                          <li>
                            <WiStars />
                            {feature}
                          </li>
                        </ul>
                      ))} */}
                      <p>
                        <IoLocation />
                        {location}
                      </p>
                    </div>
                    <p className="similar__price">
                      NGN {formatCurrency(price)}/night
                    </p>
                    <br />
                  </div>
                </Link>
              );
            })}
          <Link to="/all-properties">
            <div className="view__all">
              <button>View All Properties</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
