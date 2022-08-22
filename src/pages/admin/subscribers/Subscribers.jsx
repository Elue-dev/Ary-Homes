import React, { useEffect, useState } from "react";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { motion } from "framer-motion";
import "./subscribers.scss";
import Loader from "../../../components/utilities/Loader";

export default function Subscribers() {
  const { data, loading } = useFetchCollection("subscribers");
  const [subscribers, setSubscribers] = useState(null);
  console.log(subscribers);

  useEffect(() => {
    setSubscribers(data);
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.section
      className="subscribers__admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="subscribers__admin__contents">
        <h2>Subscribers</h2>
        <br />
        <>
          <div className="table">
            {subscribers?.length === 0 ? (
              <p>You have no subscribers at the moment</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Email</th>
                    <th>Date Subscribed</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers?.map((subs, index) => {
                    const { id, email, subscribedAt, name } = subs;
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{email}</td>
                        <td>{subscribedAt}</td>
                        <td>
                          <p style={{ fontWeight: "500" }}>{name}</p>
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
