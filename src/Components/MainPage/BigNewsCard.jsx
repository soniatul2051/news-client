import React from "react";
import img from "../../assets/img-1.png";

const BigNewsCard = ({ text, image, OnPress, id, wid, date }) => {
  return (
    <div className=" w-full">
      <div
        onClick={OnPress}
        className="stories-card mobileMainPageStroyCard  flex w-full"
        id={id}
        style={{ cursor: "pointer" }}
      >
        <div className={`${wid}`}>
          <img
            src={image ? image : img}
            alt=""
            className="w-full h-[100px] object-fill"
          />
        </div>
        <div className=" flex flex-col w-full font-bold h-full">
          <span className="stories-card-text  w-full">
            {text.length > 21
              ? text.substring(0, 22) + "..."
              : text ||
                '"India Have Better...": Sri Lanka Captain Honest World Cup Admission'}
          </span>
          <span className="text-red-600 pl-[10px]">{date ? date : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default BigNewsCard;
