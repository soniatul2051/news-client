import React from "react";
import "./style/index.css";
import img from "../../assets/details-img-1.png";

const RelatedNewsCard = ({ data, OnPress, image, text }) => {
  return (
    <div className="related-news-card" onClick={OnPress}>
      <img src={image ? image : img} alt="" />
      <div className="related-news-card-text">
        {text
          ? text.slice(0, 58)
          : "The e-Sanjeevani platform is ensuring healthcare to the last mile, by facilitat..."}
        ...
      </div>
    </div>
  );
};

export default RelatedNewsCard;
