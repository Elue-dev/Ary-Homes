import React from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import { TiWarning } from "react-icons/ti";
import { useCustomAlert } from "../../contexts/AlertContext";
import "./alert.scss";

export default function Alert() {
  const { alertMessage, alertType } = useCustomAlert();

  let background;
  let color;
  let icon;

  if (alertType === "error") {
    background = "crimson";
    color = "white";
    icon = <MdError />;
  }
  if (alertType === "warning") {
    background = "#c1b464";
    color = "white";
    icon = <TiWarning />;
  }
  if (alertType === "success") {
    background = "rgb(11, 152, 11)";
    color = "white";
    icon = <BsFillCheckCircleFill />;
  }

  return (
    <div
      style={{
        background: background,
        color: color
      }}
      className="custom__alert"
    >
      <p>
        {icon} {alertMessage}
      </p>
    </div>
  );
}
