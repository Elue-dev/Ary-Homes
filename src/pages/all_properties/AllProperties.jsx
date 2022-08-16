import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./allProperties.scss";
import useFetchCollection from "../../hooks/useFetchCollection";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_LOCATION,
  FILTER_BY_SEARCH,
  selectFilteredProperties,
  SORT_PROPERTIES,
} from "../../redux/slice/filterSlice";
import Loader from "../../components/utilities/Loader";
import { Link } from "react-router-dom";
import { CgEyeAlt } from "react-icons/cg";
import { TbHomeOff } from "react-icons/tb";
import { useCustomAlert } from "../../contexts/AlertContext";
import { IoClose } from "react-icons/io5";
import { ImMenu2 } from "react-icons/im";
import { FaHome } from "react-icons/fa";

export default function AllProperties() {
  const { data } = useFetchCollection("properties");
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [showFilter, setShowFilter] = useState(false);
  const [scrollPage, setScrollpage] = useState(false);
  const dispatch = useDispatch();
  const { formatCurrency } = useCustomAlert();
  const filteredProperties = useSelector(selectFilteredProperties);

  const fixNavbar = () => {
    if (window.scrollY > 150) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  const allLocations = [
    "All",
    ...new Set(properties.map((property) => property.location)),
  ];

  useEffect(() => {
    setProperties(data);
  }, [data]);

  useEffect(() => {
    dispatch(FILTER_BY_LOCATION({ properties, location: locations }));
  }, [dispatch, properties, locations]);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        properties,
        search,
      })
    );
  }, [dispatch, properties, search]);

  useEffect(() => {
    dispatch(
      SORT_PROPERTIES({
        properties,
        sort,
      })
    );
  }, [dispatch, properties, sort]);

  const clearFilters = () => {
    setLocations("All");
    setSearch("");
    setSort("latest");
    setShowFilter(false);
  };

  const filterByLocation = (loc) => {
    setLocations(loc);
    window.scrollTo(0, 0);
    dispatch(FILTER_BY_LOCATION({ properties, location: loc }));
    setShowFilter(false);
  };

  if (properties.length === 0) {
    return <Loader />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="all__properties"
    >
      {showFilter && (
        <div className="layer" onClick={() => setShowFilter(false)} />
      )}
      <div
        className={showFilter ? "property__filters show" : "property__filters"}
      >
        <div className="close__filter">
          <IoClose onClick={() => setShowFilter(false)} />
        </div>

        <div className="locations__list">
          <h2>Filter by location</h2>
          {allLocations.map((loc, index) => (
            <button
              key={index}
              className={`${locations}` === loc ? `active` : null}
              type="button"
              onClick={() => filterByLocation(loc)}
            >
              &#8250; {loc}
            </button>
          ))}
        </div>
        <button onClick={clearFilters} className="clear__filters">
          CLEAR ALL FILTERS
        </button>
      </div>
      <h2 className="heading_p">
        <FaHome />
        Our Properties
      </h2>
      <div className="all__properties__wrapper">
        <div className={scrollPage ? "menu__filter fix_menu" : "menu__filter"}>
          <ImMenu2 onClick={() => setShowFilter(true)} />
        </div>
        <div className="properties__">
          <label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location..."
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="highest-price">Highest Price</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </label>
          {search && (
            <>
              <h3>
                Property locations including{" "}
                <b>
                  <em>'{search}'</em>
                </b>{" "}
              </h3>
              <h3>
                <>
                  ({filteredProperties.length}{" "}
                  {filteredProperties.length === 1 ? "RESULT" : "RESULTS"})
                </>
              </h3>
            </>
          )}
          <motion.div
            className="prop__grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {filteredProperties.length === 0 && (
              <div className="no__property">
                <TbHomeOff className="empty__icon" />
                <h2>
                  No properties match your search (<i>'{search}'</i> )
                </h2>
              </div>
            )}
            {filteredProperties?.map((property) => {
              const {
                id,
                name,
                location,
                description,
                price,
                imagesUrl,
                availability,
              } = property;
              return (
                <div className="wrap_p" key={id}>
                  <div className="image_">
                    <img src={imagesUrl[0]} alt={name} />
                    <p
                      className="p_availability"
                      style={{
                        background:
                          availability === "Available"
                            ? "rgba(136, 229, 29, 0.575)"
                            : "rgba(243, 90, 52, 0.411)",
                      }}
                    >
                      {availability}
                    </p>
                    <p className="p_location">{location}</p>
                  </div>
                  <div className="inner_c">
                    <div className="name_">
                      <h2>{name}</h2>
                    </div>
                    <div className="desc_">
                      <p>{description.substring(0, 60)}...</p>
                    </div>
                    <div className="price_">
                      <p>
                        NGN {formatCurrency(price)}
                        <span>/night</span>
                      </p>
                    </div>
                    <Link to={`/property/${id}`}>
                      <button className="more_">
                        <CgEyeAlt />
                        More Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
