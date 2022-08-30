import React from "react";
import { FaWpexplorer } from "react-icons/fa";
import { HiFilter } from "react-icons/hi";
import { MdOutlineContacts } from "react-icons/md";
import { Link } from "react-router-dom";
import "./briefing.scss";

export default function Briefing() {
  const data = [
    {
      icon: <FaWpexplorer />,
      heading: "Explore Our Properties",
      description:
        "Ary Homes provides the best shortlet apartments you can find at various locations.",
    },
    {
      icon: <HiFilter />,
      heading: "Filter As Needed",
      description:
        "Refine your search and get what you want faster by filtering and sorting properties according to your needs.",
    },
    {
      icon: <MdOutlineContacts />,
      heading: "Contact Our Adminitrators",
      description:
        "Reach out as regards to a property or any other requests, we waste no time in responding.",
    },
  ];

  return (
    <div className="briefing">
      <div className="briefing__grid">
        {data.map((d, index) => {
          const { icon, heading, description } = d;
          return (
            <Link key={index}>
              <div>
                <p className="icon_b">{icon}</p>
                <h3>{heading}</h3>
                <p>{description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
