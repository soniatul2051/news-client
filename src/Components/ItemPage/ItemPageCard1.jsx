import React from "react";
import img from "../../assets/Rectangle 28.png";
import "./style/index.css";
import { useState } from "react";
import { useEffect } from "react";

const ItemPageCard1 = ({ title, discription, date, image, onPress, type }) => {
  const [desc, SetDesc] = useState(discription);

  // useEffect(() => {
  //   if (discription?.length > 100) {
  //     // Truncate and add "..." if description is too long
  //     SetDesc(discription.substring(0, 100) + "...");
  //   } else {
  //     // Keep the original description if it's short
  //     SetDesc(discription);
  //   }
  // }, [discription]);
  return (
    <div style={{ padding: "3px" }} className="">
      <div className="line"></div>
      <div
        className="item-page-card-main-conatiner flex py-2  h-fit sm:h-[245px] "
        onClick={onPress ? onPress : () => {}}
      >
        <div className=" w-[350px] h-full overflow-hidden">
          <img
            src={image}
            alt=""
            className=" h-full w-full box-border object-fill"
          />
        </div>

        <div className="item-page-card-main-conatiner-text ">
          <div className="heading-item-page-card-main-conatiner-text mt-0">
            {title}
            {/* New Health Campaign, ‘Ayushman Bhava’ To Reach Out 7 Crore Families:
            All You Need To Know About The Initiative */}
          </div>
          <div className="date-item-page-card-main-conatiner-text">
            {date}
            {/* 15 august 2023 */}
          </div>
          <div
            className="text-item-page-card-main-conatiner-text text-sm  py-2 text-gray-500 itempage-desc"
            dangerouslySetInnerHTML={{ __html: desc }}
          >
            {/* {desc} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPageCard1;
