import React from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdError } from "react-icons/md";
import { FaInfo } from "react-icons/fa";
import { useCustomAlert } from "../../contexts/AlertContext";
import "./alert.scss";

export default function Alert() {
  const { alertMessage, alertType } = useCustomAlert();

  let background;
  let color;
  let border;
  let icon;

  if (alertType === "error") {
    // background = "rgb(239, 58, 94)";
    background = "#fff";
    color = "crimson";
    border = ".3px solid #ae8625";
    icon = <MdError />;
  }
  if (alertType === "info") {
    background = "#fff";
    // color = "#c1b464";
    color = "#333";
    border = ".3px solid #ae8625";
    icon = <FaInfo />;
  }
  if (alertType === "success") {
    background = "#fff";
    color = "rgb(11, 152, 11)";
    border = ".3px solid #ae8625";
    icon = <BsFillCheckCircleFill />;
  }

  return (
    <div
      style={{
        background: background,
        color: color,
        border: border,
      }}
      className="custom__alert"
    >
      <p>
        {icon} {alertMessage}
      </p>
    </div>
  );
}
