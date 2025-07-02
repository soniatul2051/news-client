import React, { useEffect } from "react";
import "./style/index.css";
import videoPlayer from "../../assets/video2.mp4";
import img7 from "../../assets/Rectangle 67.png";
import RelatedNewsCard from "../../Components/DetailsPage";
import { FaUser } from "react-icons/fa6";
import ReactPlayer from "react-player";
import { AiFillHeart, AiOutlineCalendar } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import { RiMessage2Fill } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
import AdCard from "../../Components/Global/AdCard";

import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import SubNewsCard from "../../Components/ItemPage/SubNewsCard";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../API";
const { TextArea } = Input;

import { Col, Input, Modal, Row, Spin, message } from "antd";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import RelatedNewsSection from "../../Components/SharedComponents/RelatedNewSection";
import SubCardSection from "../../Components/SharedComponents/SubCardSection";
import { InstagramFilled } from "@ant-design/icons";

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

function findStoryIdFromUrl(pathname) {
  // Regular expression to find the 'id' parameter and its value
  const idRegex = /id=([^&]+)/;

  // Match the 'id' parameter in the URL
  const idMatch = pathname.match(idRegex);

  // Check if the 'id' parameter is found
  if (idMatch) {
    // Extract the value of the 'id' parameter
    const id = idMatch[1];

    return id;

    // You can now use the 'id' variable for further processing
  } else {
    console.log("ID parameter not found in the URL.");
  }
}

const VideoPage2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pathname, search, state } = useLocation();
  const { t } = useTranslation();
  const query1 = new URLSearchParams(search);
  const [loading2, setLoading2] = useState(false);
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState([]);
  const [data2, setData2] = useState([]); //comments
  const videoId = query1.get("id");
  const [isFav, setIsFav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [latestVidData, setLatestVidData] = useState();
  const storyId = findStoryIdFromUrl(search);
  const query = new URLSearchParams(search);
  const [vdoData, setVideoData] = useState("");
  const navigation = useNavigate();
  // console.log("data in videos page : ", data);
  // const formatDatetime = (datetimeStr) => {
  //   if (!datetimeStr) return "12|08|2023 12:15"; // Default date if no datetime string is provided

  //   const dateObj = new Date(datetimeStr);

  //   const formattedDatetimeStr = `
  //     ${String(dateObj.getDate()).padStart(2, "0")}|
  //     ${String(dateObj.getMonth() + 1).padStart(2, "0")}|
  //     ${dateObj.getFullYear()}
  //     ${String(dateObj.getHours()).padStart(2, "0")}:
  //     ${String(dateObj.getMinutes()).padStart(2, "0")}
  //   `
  //     .replace(/\s+/g, " ")
  //     .trim(); // Replace multiple spaces with a single space and trim

  //   return formattedDatetimeStr;
  // };
  // Function to format the date as required
  const formatDatetime = (dateString) => {
    if (!dateString) {
      return "Invalid Date"; // Handle undefined or null input
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Handle invalid date strings
    }

    // Define options for formatting
    const optionsDate = {
      weekday: "long", // Full weekday name (e.g., 'मंगलवार')
      year: "numeric",
      month: "long", // Full month name (e.g., 'अक्तूबर')
      day: "numeric", // Day of the month
    };

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // 12-hour format
    };

    // Create a formatter for Hindi locale
    const formatterDate = new Intl.DateTimeFormat("hi-IN", optionsDate);
    const formatterTime = new Intl.DateTimeFormat("hi-IN", optionsTime);

    // Format the date and time
    const formattedDate = formatterDate.format(date);
    const formattedTime = formatterTime.format(date);

    // Combine them in the desired format
    return `${formattedDate}, ${formattedTime}`;
  };

  const [topStories, settopStories] = useState();

  // console.log("data", storyId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (storyId) {
      axios
        .get(`${API_URL}/article?id=${storyId}`)
        .then(async (article) => {
          setData(article.data[0]);
        })
        .catch((err) => console.log(err));
    }
  }, [storyId]);

  useEffect(() => {
    axios.get(`${API_URL}/comment?id=${query.get("id")}`).then((res) => {
      // console.log(res.data);
      setData2(res.data);
    });
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onAdd = () => {
    if (!data) {
      message.error("Post data not found.");
      return;
    }
    setLoading2(true);
    axios
      .post(`${API_URL}/comment`, {
        email: Email,
        name,
        message: comment,
        postId: data._id,
      })
      .then((users) => {
        setUserData(users.data.data);
        message.success("Successfully Added");
        handleCancel();
        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Successfully Not Added");
        setLoading2(false);
      });
  };

  async function fetchLatestVidData() {
    const response = await axios.get(
      `${API_URL}/article?pagenation=true&limit=10&type=vid&newsType=breakingNews&status=online`
    );
    const data = response.data;
    setLatestVidData(data);
  }

  // fetch video details

  // console.log("vdo data m : ", vdoData);

  const location = useLocation();
  useEffect(() => {
    const fetchVideoData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("id");
      // console.log("id from params : ", id);
      try {
        const res = await axios.get(`${API_URL}/video/${id}`);
        // console.log("video find by id res : ", res.data.data);
        const videoData = res.data.data;
        if (videoData.status === false) {
          setVideoData({
            ...videoData,
            image: "",
            link: "",
            reportedBy: "",
            title: "No Data Found",
            createdAt: "",
            updatedAt: "",
          });
        } else {
          setVideoData(videoData);
        }
      } catch (error) {
        console.log("error in vdo detail page : ", error);
      }
    };
    fetchVideoData();
  }, [location.search]);

  useEffect(() => {
    fetchLatestVidData();
  }, []);

  return (
    <>
      {/* mobile version */}

      <div className="mobileDetailsPage" style={{ marginTop: "5px" }}>
        {/* <div className="mobileDetailsMainImage">
          <video
            style={{ height: "200px", objectFit: "cover" }}
            className="details-page-main-video"
            controls
            src={data?.image}
            muted
          />
        </div> */}
        <h1 style={{ fontSize: "20px" }} className="details-page-main-heading">
          {/* {vdoData?.title} */}
        </h1>
        {/* video player */}
        <div
          className="mobileDetailsMainImage video-container"
          style={{
            height: "200px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <ReactPlayer
            className="details-page-main-video"
            url={vdoData?.link}
            controls={true} // Enable video controls
          />
        </div>

        <div className="container3">
          <h1
            style={{ fontSize: "20px" }}
            className="details-page-main-heading"
          >
            {vdoData?.title}
          </h1>
          {/* <div className="details-page-top-item1">
            <FaUser style={{ marginRight: "10px" }} />
            {data?.reportedBy}
              {console.log(data?.reportedBy)}
            {vdoData?.reportedBy}
            {console.log(data?.reportedBy)}
          </div> */}
          <div className="details-page-top-item2">
            <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
            {/* {data ? formatDatetime(data.updatedAt) : "12|08|2023 12:15"} */}
            {vdoData ? formatDatetime(vdoData?.createdAt) : "12|08|2023 12:15"}
            {/* { data?data.updatedAt:"12|05|2024"} */}
          </div>
        </div>
        <div
          style={{
            margin: " 15px 10px",
            padding: "5px 0",
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
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
          {data ? (
            data.comment ? (
              <RiMessage2Fill
                style={{ marginRight: "18px" }}
                onClick={() => {
                  showModal();
                }}
              />
            ) : null
          ) : null}
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

        <div className="container-detail-page-rigth-side">
          {latestVidData && (
            <div className="details-page-related-news">
              <div className="details-page-related-news-heading">
                {/* {t("ln")} */} Related Videos
              </div>
            </div>
          )}
          <div className="detail-page-relate-new-cards">
            {latestVidData?.map((data, index) => {
              let title = data.title
                .replace(/[/\%.?]/g, "")
                .split(" ")
                .join("-");
              if (data.slug) {
                title = data.slug;
              }
              if (data._id === storyId) return;
              const OnPress = () => {
                navigation(`/videos/${title}?id=${data?._id}`, false);
              };
              const text = data?.title.substring(0, 45) + "...";
              const image = data?.image;

              return (
                <div
                  className="related-news-card mobile-related-news-card"
                  onClick={OnPress}
                >
                  <video key={storyId} src={image ? image : ""} alt="" />
                  <div
                    style={{
                      margin: "0px",
                      flexGrow: "1",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    className="related-news-card-text"
                  >
                    {text
                      ? text
                      : "The e-Sanjeevani platform is ensuring healthcare to the last mile, by facilitat..."}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="container-detail-page-rigth-side">
          <div className="details-main-ad-cards">
            <AdCard type={"bottom"} />
          </div>
          {data?.comment ? (
            <div className="details-comment-area">
              <div
                className="comment-button"
                style={{ cursor: "pointer" }}
                onClick={showModal}
              >
                <FaRegComment style={{ marginRight: "10px" }} /> Comment
              </div>
            </div>
          ) : (
            <></>
          )}
          {data2.map(({ name, message }) => {
            return (
              <div style={{ display: "flex", marginTop: "10px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "25px",
                      fontFamily: "Poppins",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      padding: "10px 20px",
                      display: "flex",
                      height: 30,
                    }}
                  >
                    {data2 && name[0].toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    padding: "5px 10px",
                    width: "200px",
                    display: "flex",
                    marginLeft: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: "600",
                      }}
                    >
                      {data2 && name.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontFamily: "Poppins",
                      }}
                    >
                      {data2 && message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* mobile version */}
      <div className="detail-page-top-container container2 container3 webDetailsContainer">
        <div className="container-detail-page-left-side">
          {/* <h1 className="details-page-main-heading">{vdoData?.title}</h1> */}
          <h1 className="details-page-main-heading">{vdoData?.title}</h1>
          <div className="details-page-top-items">
            {/* <div
              className="details-page-top-item1"
              style={{ backgroundColor: "red" }}
            >
              <FaUser style={{ marginRight: "10px" }} />
              {data?.reportedBy}
              {console.log(data?.reportedBy)}
              {vdoData?.reportedBy}
              {console.log(data?.reportedBy)}
            </div> */}
            {/* {start data} */}
            <div className="details-page-top-item2">
              <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
              {/* {data ? newFormatDate(data.createdAt) : "12|08|2023 12:15"} */}
              {vdoData
                ? formatDatetime(vdoData?.createdAt)
                : "12|08|2023 12:15"}
              {/* { data?data.updatedAt:"12|05|2024"} */}
            </div>
            <div className="details-page-top-item3">
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
              {data ? (
                data.comment ? (
                  <RiMessage2Fill
                    style={{ marginRight: "18px" }}
                    onClick={() => {
                      showModal();
                    }}
                  />
                ) : null
              ) : null}
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
          {/* <video
            className="details-page-main-video"
            controls
            src={data?.image}
            muted
            
          /> */}

          {/* video player */}
          <div className="details-page-main-video">
            <ReactPlayer
              url={vdoData?.link}
              controls={true} // Enable video controlsht
            />
          </div>
          <div className="details-main-text-area">
            <div className="details-main-text-area-heading details-page-main-heading">
              {data?.title}
            </div>
            <div className="deatils-main-para-area">
              <div id="pararvideo"></div>
            </div>
          </div>
          <RelatedNewsSection />
          {/* <div className="video-comment-area1">
          <div className="details-main-related-new-area-heading">
            <span>{t("to")} :</span> {data?.topic}
          </div>
          <div className="details-comment-area">
            <div className="comment-button">
              <FaRegComment style={{ marginRight: "10px" }} /> Comment
            </div>
          </div>
        </div> */}
        </div>
        <div className="container-detail-page-rigth-side">
          <LatesetNewsSection currentVideoId={videoId} />
          <SubCardSection />

          <div className="video-bootm-area">
            <div className="video-ad-card-section">
              <AdCard type={"mid"} />
            </div>
            <div className="video-page-ad-section">
              <AdCard type={"bottom"} />
            </div>
          </div>
        </div>
        {/* <div className="video-comment-area2">
        <div className="details-main-related-new-area-heading">
          <span>{t("to")} :</span> War
        </div>
        
        <div className="details-comment-area">
          <div className="comment-button">
            <FaRegComment style={{ marginRight: "10px" }} /> Comment
          </div>
        </div>

       
      </div> */}
      </div>
      {/* testing started */}
      <div className="detalis-page-commment-area1 webDetailsContainer">
        <div className="details-main-related-new-area-heading">
          <span>{t("to")} :</span> {data?.topic}
        </div>
        {data?.comment ? (
          <div className="details-comment-area">
            <div
              className="comment-button"
              style={{ cursor: "pointer" }}
              onClick={showModal}
            >
              <FaRegComment style={{ marginRight: "10px" }} /> Comment
            </div>
          </div>
        ) : (
          <></>
        )}
        {data2.map(({ name, message }) => {
          return (
            <div style={{ display: "flex", marginTop: "10px" }}>
              <div>
                <div
                  style={{
                    fontSize: "25px",
                    fontFamily: "Poppins",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    padding: "10px 20px",
                    display: "flex",
                    height: 30,
                  }}
                >
                  {data2 && name[0].toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  padding: "5px 10px",
                  width: "200px",
                  display: "flex",
                  marginLeft: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                    }}
                  >
                    {data2 && name.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                    }}
                  >
                    {data2 && message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* testing ended */}
      <Modal
        title="Comment"
        open={isModalOpen}
        onOk={onAdd}
        onCancel={() => (loading2 ? () => {} : handleCancel())}
        okText="Let`s Comment"
        confirmLoading={loading2}
      >
        <Row gutter={12} style={{ marginTop: "10px" }}>
          <Col span={12}>
            <Input
              size="large"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Input
              size="large"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col span={24} style={{ marginTop: "20px" }}>
            <TextArea
              style={{ resize: "none" }}
              rows={5}
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default VideoPage2;
