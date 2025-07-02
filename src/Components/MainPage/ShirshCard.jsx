import React from "react";
import img from "../../assets/img-1.png";

const ShirshCard = ({ text, image, OnPress, id, wid, date }) => {
  return (
    <>
      <div
        onClick={OnPress}
        className="stories-card mobileMainPageStroyCard h-[105.8px] flex w-full"
        id={id}
        style={{ cursor: "pointer" }}
      >
        <div className={`${wid}`}>
          <img
            src={image ? image : img}
            alt=""
            className="w-full h-full object-fill"
          />
        </div>
        <div className=" flex flex-col  w-[55%]  ">
          <span className="shirsh-card-text-4-line font-bold w-full">
            {text ||
              '"India Have Better...": Sri Lanka Captain Honest World Cup Admission'}
          </span>
          <span className="text-red-600 pl-[10px]">{date ? date : ""}</span>
        </div>
      </div>
    </>
  );
};

export default ShirshCard;
