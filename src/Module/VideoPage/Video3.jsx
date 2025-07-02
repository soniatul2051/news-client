import React, { useEffect } from "react";
import "./style/index.css";
import videoPlayer from "../../assets/video2.mp4";
import img7 from "../../assets/Rectangle 67.png";
import img8 from "../../assets/video3img.png";
import RelatedNewsCard from "../../Components/DetailsPage";
import { FaUser } from "react-icons/fa6";
import { AiOutlineCalendar } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import { RiMessage2Fill } from "react-icons/ri";
import { IoIosShareAlt } from "react-icons/io";
import { GrShareOption } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
import AdCard from "../../Components/Global/AdCard";
import { useLocation } from "react-router-dom";
import { WhatsappShareButton } from "react-share";
import { useTranslation } from "react-i18next";
import SubNewsCard from "../../Components/ItemPage/SubNewsCard";

const VideoPage3 = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="detail-page-top-container container2 container3">
      <div className="container-detail-page-left-side">
        <h1 className="details-page-main-heading">
          100 Hours On, Forces Locked In Jungle Warfare With Terrorists In
          Kashmir
        </h1>
        <div className="details-page-top-items">
          <div className="details-page-top-item1">
            <FaUser style={{ marginRight: "10px" }} />
            India
          </div>
          <div className="details-page-top-item2">
            <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
            {data ? newFormatDate(data.createdAt) : "12|08|2023 12:15"}
          </div>
          <div className="details-page-top-item3">
            <TiHeartOutline style={{ marginRight: "18px" }} />
            <RiMessage2Fill style={{ marginRight: "18px" }} />
            <GrShareOption style={{ marginRight: "18px" }} />
            <WhatsappShareButton url="https://api.whatsapp.com/send/?phone=923052507015">
              <BsWhatsapp style={{ marginRight: "18px" }} />
            </WhatsappShareButton>
          </div>
        </div>
        <div className="video3-news-cards-area">
          <div style={{ position: "relative" }}>
            <img src={img8} alt="" />
            <div>
              3/11
              <IoIosShareAlt style={{ marginLeft: "5px", cursor: "pointer" }} />
            </div>
          </div>
          <div className="video3-news-cards-area-text">
            India will play the first ODI against Australia at the Punjab
            Cricket Association Stadium on September 22. The second ODI will be
            played at the Holkar Stadium, Madhya Pradesh on September 24. The
            series will conclude at the Saurashtra Cricket Association Stadium,
            Gujarat on September 27.{" "}
          </div>
        </div>
        <div className="video3-news-cards-area">
          <div style={{ position: "relative" }}>
            <img src={img8} alt="" />
            <div>
              3/11
              <IoIosShareAlt style={{ marginLeft: "5px", cursor: "pointer" }} />
            </div>
          </div>
          <div className="video3-news-cards-area-text">
            India will play the first ODI against Australia at the Punjab
            Cricket Association Stadium on September 22. The second ODI will be
            played at the Holkar Stadium, Madhya Pradesh on September 24. The
            series will conclude at the Saurashtra Cricket Association Stadium,
            Gujarat on September 27.{" "}
          </div>
        </div>
        <div className="video3-news-cards-area">
          <div style={{ position: "relative" }}>
            <img src={img8} alt="" />
            <div>
              3/11
              <IoIosShareAlt style={{ marginLeft: "5px", cursor: "pointer" }} />
            </div>
          </div>
          <div className="video3-news-cards-area-text">
            India will play the first ODI against Australia at the Punjab
            Cricket Association Stadium on September 22. The second ODI will be
            played at the Holkar Stadium, Madhya Pradesh on September 24. The
            series will conclude at the Saurashtra Cricket Association Stadium,
            Gujarat on September 27.{" "}
          </div>
        </div>
        <div className="video-comment-area1">
          <div
            className="details-comment-area"
            style={{ justifyContent: "flex-start" }}
          >
            <div className="comment-button">
              <FaRegComment style={{ marginRight: "10px" }} /> Comment
            </div>
          </div>
        </div>
      </div>
      <div className="container-detail-page-rigth-side">
        <div className="details-page-latest-news">
          <div className="details-main-related-new-area-heading">{t("ln")}</div>
          <div className="itempage-main-sub-news-area">
            <SubNewsCard />
            <SubNewsCard />
            <SubNewsCard />
            <SubNewsCard isVideo={true} />
          </div>
        </div>
        <div className="video-page-ad-section">
          <img src={img7} alt="" />
        </div>
        <div className="details-page-latest-news">
          <div className="details-main-related-new-area-heading">{t("ln")}</div>
          <div className="details-page-video-cards">
            <DetailsVideoCard />
            <DetailsVideoCard />
          </div>
        </div>
        <div className="video-bootm-area">
          <div
            className="video-ad-card-section"
            style={{ flexDirection: "column" }}
          >
            <AdCard />
            <AdCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage3;
