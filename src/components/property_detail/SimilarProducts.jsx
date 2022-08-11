import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCustomAlert } from "../../contexts/AlertContext";
import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../utilities/Loader";
import { WiStars } from "react-icons/wi";
import "./similarProducts.scss";

export default function SimilarProducts() {
  const { id } = useParams();
  const [properties, setProperties] = useState([]);
  const { data, loading } = useFetchCollection("properties");
  const { formatCurrency } = useCustomAlert();
  console.log(properties);

  useEffect(() => {
    setProperties(data);
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="similar__properties">
      <div className="similar__properties__contents">
        <h3>Similar Properties</h3>

        {properties.slice(7, 10)?.map((property) => {
          const { id, name, imagesUrl, price, features } = property;
          return (
            <Link to={`/property/${id}`}>
              <div key={id} className="similar__properties__details">
                <div className="similar__images">
                  <img src={imagesUrl[1]} alt={name} />
                </div>
                <h2>{name}</h2>
                <p className="similar__list">
                  {features.slice(0, 4)?.map((feature, index) => (
                    <ul key={index}>
                      <li>
                        <WiStars />
                        {feature}
                      </li>
                    </ul>
                  ))}
                </p>
                <p className="similar__price">NGN {formatCurrency(price)}</p>
                <br />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
