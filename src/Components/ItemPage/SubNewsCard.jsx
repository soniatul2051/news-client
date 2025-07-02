import React from "react";
import img from "../../assets/SubNewsImg.png";
import "./style/index.css";
import { BsPlayCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SubNewsCard = ({ isVideo, data }) => {
  const navigation = useNavigate();
  let title = data?.title
    .replace(/[/\%.?]/g, "")
    .split(" ")
    .join("-");
  if (data && data.slug) {
    title = data.slug;
  }
  return (
    <div
      onClick={() => {
        navigation(`/details/${title}?id=${data?._id}`);
      }}
      className="sub-News-area-1-img-main"
      style={{ width: "100%", height: "100px" }}
    >
      <div className="sub-News-area-1-img">
        <img src={data ? data.image : img} />
        <div>
          {isVideo ? (
            <>
              {" "}
              <div className="item-video-card-length">
                <BsPlayCircle style={{ marginRight: "3px" }} /> 8:15
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="sub-News-area-1-text">
        {title
          ? data.title.slice(0, 80)
          : "The high court upheld a trial court's judgement which had declared the Muslim According to the"}
        ...
      </div>
    </div>
  );
};

export default SubNewsCard;
