import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../hooks/useFetchCollection";
import {
  selectProperties,
  STORE_PROPERTIES,
} from "../../redux/slice/propertySlice";
import "./properties.scss";

export default function Properties() {
  const { data, loading } = useFetchCollection("properties");
  const properties = useSelector(selectProperties);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PROPERTIES({
        properties: data,
      })
    );
  }, [dispatch, data]);

  return (
    <div className="properties">
      {/* {properties?.map((property) => {
        const {
          id,
          name,
          price,
          availability,
          location,
          description,
          imagesUrl,
          features,
        } = property;
        return (
          <div key={id}>
            <img src={imagesUrl[0]} alt={name} />
            <h3>{name}</h3>
            <p>
              <b>Price: {price}</b>
            </p>
            <p>
              <b>Location: {location}</b>
            </p>
            <p>
              <b>Availability: {availability}</b>
            </p>
            <p>
              {features.map((feature, index) => {
                <li key={index}>{feature}</li>;
              })}
            </p>
            <p>Description: {description}</p>
          </div>
        );
      })} */}
    </div>
  );
}
