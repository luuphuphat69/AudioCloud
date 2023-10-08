import React from "react";
import {TailSpin} from "react-loader-spinner";
const Popup = ({ isVisible }) => {
  return (
    <div className={`popup ${isVisible ? "visible" : ""}`}>
      <div className="popup-content">
        {/* Loader component goes here */}
        <TailSpin type="TailSpin" height={80} width={80} />
      </div>
    </div>
  );
};

export default Popup;
