import React from "react";
import "./style/index.css";
import img from "../../assets/Rectangle 28.png";

const ItemPageNewsCard = ({ data, OnPress, text, image }) => {
  return (
    <>
      <div className="ItemPageNewsCard-main" onClick={OnPress}>
        <div className="">
          <img src={image ? image : img} alt="" />
        </div>
        <div className="ttxxtt ">
          {text
            ? text
            : "Conference leader Mohd Akbar Lone, there are only two highly debatable issues"}{" "}
        </div>
      </div>
    </>
  );
};

export default ItemPageNewsCard;
