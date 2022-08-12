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
        <div className="md__property__grid">
        {properties.slice(6, 10)?.map((property) => {
          const { id, name, imagesUrl, price, features } = property;
          return (
            <Link to={`/property/${id}`} key={id} >
              <div className="similar__properties__details">
                <div className="similar__images">
                  <img src={imagesUrl[0]} alt={name} />
                </div>
                <h2>{name}</h2>
                <div className="similar__list">
                  {features.slice(0, 4)?.map((feature, index) => (
                    <ul key={index}>
                      <li>
                        <WiStars />
                        {feature}
                      </li>
                    </ul>
                  ))}
                </div>
                <p className="similar__price">NGN {formatCurrency(price)}</p>
                <br />
              </div>
            </Link>
          );
        })}
        </div>
       
      </div>
    </div>
  );
}
