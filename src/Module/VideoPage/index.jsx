import React, { useEffect } from "react";
import "./style/index.css";
import videoPlayer from "../../assets/video2.mp4";
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

const VideoPage = () => {
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
  const navigation = useNavigate();

  const [topStories, settopStories] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setData(state);
  }, []);
  useEffect(() => {
    axios.get(`${API_URL}/comment?id=${query.get("id")}`).then((res) => {
      // console.log("api data from video2 routes : ", res.data);
      setData2(res.data);
    });
  }, []);
  // console.log("vdo data in vdo2 file : ", data);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const onAdd = () => {
    setLoading2(true);
    // console.log(
    //   { email: Email, name, message: comment, postId: data._id },
    //   "dd"
    // );
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
        message.success("Successfully Added");
      });
  };
  async function fetchLatestVidData() {
    const response = await axios.get(
      `${API_URL}/article?pagenation=true&limit=10&type=vid&newsType=breakingNews&status=online`
    );
    const data = response.data;
    setLatestVidData(data);
  }

  useEffect(() => {
    fetchLatestVidData();
  }, []);

  return (
    <>
      {/* mobile version */}

      <div className="mobileDetailsPage">
        <div className="mobileDetailsMainImage">
          {data?.image ? (
            <video
              style={{ height: "200px", objectFit: "cover" }}
              className="details-page-main-video"
              controls
              src={data?.image}
              muted
            />
          ) : (
            <iframe
              className="video"
              title="Youtube player"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
              src={data?.link}
              style={{ height: "200px", objectFit: "cover" }}
            ></iframe>
          )}
        </div>
        <div className="container3">
          <h1
            style={{ fontSize: "20px" }}
            className="details-page-main-heading"
          >
            {data?.title}
          </h1>
        </div>
        <div
          style={{
            margin: " 15px 0px",
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
          <div className="detail-page-relate-new-cards ">
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
                navigation(`/videos/${title}?id=${data?._id}`);
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
          <h1 className="details-page-main-heading">{data?.title}</h1>
          {/* <div className="details-page-top-items">
          <div className="details-page-top-item1">
            <FaUser style={{ marginRight: "10px" }} />
            India
          </div>
          <div className="details-page-top-item2">
            <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
            { data?data.updatedAt:"12|05|2024"}
          </div>
          <div className="details-page-top-item3">
            <TiHeartOutline style={{ marginRight: "18px" }} />
            <RiMessage2Fill style={{ marginRight: "18px" }} />
            <GrShareOption style={{ marginRight: "18px" }} />
            <WhatsappShareButton url="https://api.whatsapp.com/send/?phone=923052507015">
            <BsWhatsapp style={{ marginRight: "18px" }} />
            </WhatsappShareButton>
          </div>
        </div> */}
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
          {/* {console.log("data bideo : ",data)} */}
          {data?.image ? (
            <video
              className="details-page-main-video"
              controls
              src={data?.image}
              muted
            />
          ) : (
            <iframe
              className="video details-page-main-video"
              title="Youtube player"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
              src={data?.link}
              style={{ height: "400px", objectFit: "cover" }}
            ></iframe>
          )}

          <div className="details-main-text-area">
            <div className="details-main-text-area-heading">{data?.title}</div>
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
      {/* <div className="detalis-page-commment-area1 webDetailsContainer">
          <div className="details-main-related-new-area-heading">
            <span>{t("to")}asdf :</span> {data?.topic}
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
        </div> */}
      {/* testing ended */}
      {/* <Modal
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
  </Modal> */}
    </>
  );
};

export default VideoPage;

// import React, { useEffect } from "react";
// import "./style/index.css";
// // import videoPlayer from "../../assets/video.mp4";
// import img7 from "../../assets/Rectangle 67.png";
// import RelatedNewsCard from "../../Components/DetailsPage";
// import { FaUser } from "react-icons/fa6";
// import { AiOutlineCalendar } from "react-icons/ai";
// import { TiHeartOutline } from "react-icons/ti";
// import { RiMessage2Fill } from "react-icons/ri";
// import { GrShareOption } from "react-icons/gr";
// import { BsWhatsapp } from "react-icons/bs";
// import { FaRegComment } from "react-icons/fa";
// import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
// import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
// import AdCard from "../../Components/Global/AdCard";
// import { useLocation } from "react-router-dom";
// import { WhatsappShareButton } from "react-share";
// import { useTranslation } from "react-i18next";

// const VideoPage = () => {
//   const { pathname } = useLocation();
//   const { t } = useTranslation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);
//   return (
//     <div className="detail-page-top-container container2 container3">
//       <div className="container-detail-page-left-side">
//         <h1 className="details-page-main-heading">
//           100 Hours On, Forces Locked In Jungle Warfare With Terrorists In
//           Kashmir
//         </h1>
//         <div className="details-page-top-items">
//           <div className="details-page-top-item1">
//             <FaUser style={{ marginRight: "10px" }} />
//             India
//           </div>
//           <div className="details-page-top-item2">
//             <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
//             12|08|2023 12:15
//           </div>
//           <div className="details-page-top-item3">
//             <TiHeartOutline style={{ marginRight: "18px" }} />
//             <RiMessage2Fill style={{ marginRight: "18px" }} />
//             <GrShareOption style={{ marginRight: "18px" }} />
//             <WhatsappShareButton url="https://api.whatsapp.com/send/?phone=923052507015">
//             <BsWhatsapp style={{ marginRight: "18px" }} />
//             </WhatsappShareButton>
//           </div>
//         </div>
//         <video className="details-page-main-video" controls>
//           {/* <source src={videoPlayer} type="video/mp4" /> */}
//         </video>
//         <div className="details-main-text-area">
//           <div className="details-main-text-area-heading">
//             War Of Words Between Babar Azam And Shaheen Afridi After Pakistan's
//             Asia Cup 2023 Exit: Report
//           </div>
//           <div className="deatils-main-para-area">
//             <div>
//               <span>Gadol, Anantnag : </span>
//               The encounter with terrorists in Jammu and Kashmir's Anantnag has
//               stretched to the fifth day, with thousands of troops including
//               para commandos locked in an endless gunfight deep inside the dense
//               forests of Gadol. Trained in jungle warfare, the terrorists are
//               making use of the treacherous terrain and forest cover to keep the
//               forces at bay and prolong the encounter. <br /> The faceoff that
//               continues for over 100 hours now began Wednesday and three
//               officers, including two from the Army and a policeman, were killed
//               in action in an attempt to neutralise the terrorists. <br /> The
//               heavily armed terrorists, believed to be two-three in number, are
//               hiding in a tactically favourable location in the dense and steep
//               forest. This indicates a new pattern being used by the terrorists
//               to take on the security structure in Kashmir. <br /> These 100
//               hours, the troops fired hundreds of motor shells and rockets, and
//               targeted suspected terrorist hideouts with hi-tech equipment and
//               dropped explosives using advanced drones. <br /> Loud explosions
//               and heavy gunfire echo in the serene alpine forests time to time.{" "}
//               <br />
//               Army's Northern Command chief Lt General Upendra Dwivedi visited
//               the encounter site on Saturday where he was briefed about how
//               troops are using the advanced equipment including drones and
//               firepower against the terrorists. <br /> OP
//               GAROL#LtGenUpendraDwivedi#ArmyCdr, Northern Command reviewed the
//               operational situation on the ongoing operations at #Kokernag
//               forest area in #Anantnag. He was briefed by the ground commanders
//               on the High Intensity Operations in which Hi-tech Equipment is
//               being used for…
//             </div>
//           </div>
//         </div>
//         <div className="details-main-related-new-area">
//           <div className="details-main-related-new-area-heading">
//             {t("rn")}
//           </div>
//           <div className="details-main-related-new-area-cards">
//             <DetailsNewsCard />
//             <DetailsNewsCard />
//             <DetailsNewsCard />
//           </div>
//         </div>
//         <div className="video-comment-area1">
//           <div className="details-main-related-new-area-heading">
//             <span>{t("to")} :</span> War
//           </div>
//           <div className="details-comment-area">
//             <div className="comment-button">
//               <FaRegComment style={{ marginRight: "10px" }} /> Comment
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container-detail-page-rigth-side">
//         <div className="details-page-latest-news">
//           <div className="details-main-related-new-area-heading">
//             {t("ln")}
//           </div>
//           <div className="details-page-video-cards">
//             <DetailsVideoCard />
//             <DetailsVideoCard />
//           </div>
//         </div>
//         <div className="video-page-news-cards">
//           <RelatedNewsCard />
//           <RelatedNewsCard />
//           <RelatedNewsCard />
//           <RelatedNewsCard />
//         </div>
//         <div className="video-bootm-area">
//           <div className="video-ad-card-section">
//             <AdCard />
//           </div>
//           <div className="video-page-ad-section">
//             <img src={img7} alt="" />
//           </div>
//         </div>
//       </div>
//       <div className="video-comment-area2">
//         <div className="details-main-related-new-area-heading">
//           <span>{t("to")} :</span> War
//         </div>
//         <div className="details-comment-area">
//           <div className="comment-button">
//             <FaRegComment style={{ marginRight: "10px" }} /> Comment
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPage;
