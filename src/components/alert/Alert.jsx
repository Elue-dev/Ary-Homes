import React from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import { useAuth } from "../../contexts/AuthContext";
import './alert.scss'

export default function Alert() {
  const { alertMessage, alertType } = useAuth();

  let background;
  let color;
  let icon;

  if (alertType === "error") {
    background = "crimson";
    color = "white";
    icon = <MdError />;
  }
  if (alertType === "warning") {
    background = "pink";
    color = "white";
    icon = <TiWarning />;
  }
  if (alertType === "success") {
    background = "green";
    color = "white";
    icon = <BsFillCheckCircleFill />;
  }

  return (
    <div
      style={{
        background: background,
        color: color,
        height: "auto",
        zIndex: 3000000000,
        fontSize: "1.3rem",
        textAlign: "center",
      }}
      className='custom__alert'
    >
      <h4>
        {icon} {alertMessage}
      </h4>
    </div>
  );
}
