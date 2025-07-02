import React, { useEffect } from "react";
import "./style/index.css";
import img7 from "../../assets/Rectangle 67.png";
import RelatedNewsCard from "../../Components/DetailsPage";
import { FaUser } from "react-icons/fa6";
import { AiFillHeart, AiOutlineCalendar } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import { RiMessage2Fill } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
import AdCard from "../../Components/Global/AdCard";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../../API";
import RelatedNewsSection from "../../Components/SharedComponents/RelatedNewSection";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import YouTube from "react-youtube";
import { InstagramFilled } from "@ant-design/icons";
import VideoPlayer from "../../Components/common/LiveVideoPlayer";

// Instagram share button (custom implementation)
const InstagramShareButton = ({ url }) => {
  const handleInstagramShare = () => {
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(
      url
    )}`;
    window.open(instagramUrl, "_blank");
  };

  return (
    <button
      onClick={handleInstagramShare}
      style={{
        backgroundColor: "#C02A50",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        padding: "4px",
        marginTop: "-8px",
      }}
    >
      <InstagramFilled style={{ fontSize: "20px" }} />
    </button>
  );
};

const LivePage = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [Data, setData] = useState({});
  const [isFav, setIsFav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useNavigate();
  const [topStories, settopStories] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=4&type=img&newsType=topStories&status=online`
      )
      .then((data) => {
        settopStories(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    axios.get(`${API_URL}/live`).then((data) => {
      // console.log("data", data.data);
      const reverseArr = data.data.reverse();
      setData(reverseArr[0]);
      document.getElementById("pararvideo").innerHTML =
        reverseArr[0]?.discription;
    });
  }, []);
  const formatDatetime = (datetimeStr) => {
    if (!datetimeStr) return "12|08|2023 12:15"; // Default date if no datetime string is provided

    const dateObj = new Date(datetimeStr);

    const formattedDatetimeStr = `
      ${String(dateObj.getDate()).padStart(2, "0")}|
      ${String(dateObj.getMonth() + 1).padStart(2, "0")}|
      ${dateObj.getFullYear()} 
      ${String(dateObj.getHours()).padStart(2, "0")}:
      ${String(dateObj.getMinutes()).padStart(2, "0")}
    `
      .replace(/\s+/g, " ")
      .trim(); // Replace multiple spaces with a single space and trim

    return formattedDatetimeStr;
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  // Helper function to make iframes responsive
  const makeIframeResponsive = (iframeHtml) => {
    if (!iframeHtml) return "";
    return iframeHtml.replace(
      /width="[^"]+" height="[^"]+"/,
      'width="100%" height="100%"'
    );
  };
  // Helper: Extract Video ID from Standard YouTube Links
  const extractVideoId = (link) => {
    try {
      const embedMatch = link.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) return embedMatch[1];
      const url = new URL(link);
      return url.searchParams.get("v") || null;
    } catch {
      return null;
    }
  };

  const videoId = extractVideoId(Data?.link);
  const isIframe = isIframeContent(Data?.link);

  return (
    <>
      {/* mobile version  */}
      <div className="mobileDetailsPage">
        <h1
          style={{ fontSize: "16px" }}
          className="details-page-main-heading font-bold  px-2"
        >
          {Data?.title
            ? Data?.title
            : "100 Hours On, Forces Locked In Jungle Warfare With Terrorists InKashmir"}
        </h1>
        <div className="details-page-top-items px-2">
          <div
            style={{
              margin: " 0px 0px",
              padding: "5px 0",
              // borderTop: "1px solid grey",
              // borderBottom: "1px solid grey",
            }}
            className="details-page-top-item3"
          >
            {isFav ? (
              <>
                <AiFillHeart
                  style={{ marginRight: "18px" }}
                  color="red"
                  onClick={() => setIsFav(!isFav)}
                />
              </>
            ) : (
              <TiHeartOutline
                style={{ marginRight: "18px" }}
                onClick={() => setIsFav(!isFav)}
              />
            )}
            {/* {data?(data.comment)?<RiMessage2Fill style={{ marginRight: "18px" }} onClick={()=>{
                showModal()
              }} />:null:null} */}
            <div style={{ position: "relative" }}>
              <GrShareOption
                style={{ marginRight: "18px", cursor: "pointer" }}
                onClick={() => setIsOpen(!isOpen)}
              />
              <div
                style={{
                  position: "absolute",
                  height: "30px",
                  width: "150px",
                  backgroundColor: "#5a5a5a",
                  borderRadius: 100,
                  bottom: -40,
                  left: -20,
                  alignItems: "center",
                  justifyContent: "space-around",
                  display: isOpen ? "flex" : "none",
                  paddingTop: 10,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
              >
                <FacebookMessengerShareButton url={window.location.href}>
                  <FacebookIcon size={25} />
                </FacebookMessengerShareButton>
                <EmailShareButton url={window.location.href}>
                  <EmailIcon size={25} />
                </EmailShareButton>
                <InstagramShareButton url={window.location.href} />
                <TwitterShareButton url={window.location.href}>
                  <TwitterIcon size={25} />
                </TwitterShareButton>
              </div>
            </div>
            <WhatsappShareButton url={window.location.href}>
              <BsWhatsapp style={{ marginRight: "18px" }} />
            </WhatsappShareButton>
          </div>
        </div>
        <div className="mobileDetailsMainImage  mb-7 p-1">
          <YouTube
            videoId={videoId}
            opts={{
              height: "250px",
              width: "100%",
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
              },
            }}
          />
        </div>

        <div className="container3">
          <div className="container-detail-page-rigth-side">
            <div className="details-main-ad-cards">
              <AdCard type={"mid"} />
            </div>

            <LatesetNewsSection />
          </div>
        </div>
      </div>

      {/* Laptop version  */}
      <div className="detail-page-top-container container2 container3 webDetailsContainer">
        <div className="container-detail-page-left-side">
          <h1 className="details-page-main-heading font-bold">
            {Data?.title
              ? Data?.title
              : "100 Hours On, Forces Locked In Jungle Warfare With Terrorists InKashmir"}
          </h1>
          <div className="details-page-top-items">
            <div className="details-page-top-item1">
              <FaUser style={{ marginRight: "10px" }} />
              India
            </div>
            {/* {console.log("Data in Live : ", Data)} */}
            <div className="details-page-top-item2">
              <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
              {Data ? formatDatetime(new Date()) : "12|08|2023 12:15"}
              {/* {console.log("data.updatedAt",data?.updatedAt)} */}
              {/* {data ? newFormatDate(data.createdAt) : "12|08|2023 12:15"} */}
            </div>

            <div
              style={{ margin: " 15px 0px", padding: "5px 0" }}
              className="details-page-top-item3"
            >
              {isFav ? (
                <>
                  <AiFillHeart
                    style={{ marginRight: "18px" }}
                    color="red"
                    onClick={() => setIsFav(!isFav)}
                  />
                </>
              ) : (
                <TiHeartOutline
                  style={{ marginRight: "18px" }}
                  onClick={() => setIsFav(!isFav)}
                />
              )}
              {/* {data?(data.comment)?<RiMessage2Fill style={{ marginRight: "18px" }} onClick={()=>{
                showModal()
              }} />:null:null} */}
              <div style={{ position: "relative" }}>
                <GrShareOption
                  style={{ marginRight: "18px", cursor: "pointer" }}
                  onClick={() => setIsOpen(!isOpen)}
                />
                <div
                  style={{
                    position: "absolute",
                    height: "30px",
                    width: "150px",
                    backgroundColor: "#5a5a5a",
                    borderRadius: 100,
                    bottom: -40,
                    left: -20,
                    alignItems: "center",
                    justifyContent: "space-around",
                    display: isOpen ? "flex" : "none",
                    paddingTop: 10,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  <FacebookMessengerShareButton url={window.location.href}>
                    <FacebookIcon size={25} />
                  </FacebookMessengerShareButton>
                  <EmailShareButton url={window.location.href}>
                    <EmailIcon size={25} />
                  </EmailShareButton>
                  <InstagramShareButton url={window.location.href} />
                  <TwitterShareButton url={window.location.href}>
                    <TwitterIcon size={25} />
                  </TwitterShareButton>
                </div>
              </div>
              <WhatsappShareButton url={window.location.href}>
                <BsWhatsapp style={{ marginRight: "18px" }} />
              </WhatsappShareButton>
            </div>
          </div>

          {/* <YouTube videoId={videoId} opts={opts} /> */}
          {isIframe ? (
            <div
              className="w-full h-[390px]"
              dangerouslySetInnerHTML={{
                __html: makeIframeResponsive(Data?.link),
              }}
            />
          ) : videoId ? (
            <YouTube className="w-full h-full" videoId={videoId} opts={opts} />
          ) : (
            <p>Video not available</p>
          )}
          <div className="deatils-main-para-area text-lg my-1">
            <div id="pararvideo"></div>
          </div>

          <RelatedNewsSection />
        </div>
        <div className="container-detail-page-rigth-side">
          <LatesetNewsSection />
        </div>
      </div>
    </>
  );
};
const isIframeContent = (content) =>
  /<iframe.*src=".*youtube\.com/.test(content);
export default LivePage;
