import React from "react";
import img from "../../assets/Rectangle 73.png";

const NewsCard = ({ data, onPress }) => {
  return (
    <div
      className="news-card-mian-area h-[230px] overflow-hidden rounded"
      onClick={onPress}
    >
      <img
        src={data ? data?.image : img}
        className="w-full h-full rounded object-cover"
        alt=""
      />
      <div className="news-card-main-area-text stories-card-text w-full">
        {data
          ? data?.title
          : "Nternational Aid Arrives In Flood-Hit Libya As More Bodies Wash Ashore"}
      </div>
    </div>
  );
};

export default NewsCard;
