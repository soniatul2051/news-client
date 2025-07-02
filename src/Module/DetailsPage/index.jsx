import React, { useEffect } from "react";
import "./style/index.css";
import DetailImg from "../../assets/detailsPage.png";
import RelatedNewsCard from "../../Components/DetailsPage";
import { FaUser } from "react-icons/fa6";
import { AiOutlineCalendar, AiFillHeart } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import { RiMessage2Fill } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
import AdCard from "../../Components/Global/AdCard";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Col, Input, Modal, Row, Spin, message } from "antd";
import { Loading } from "../../Context";
import { useContext } from "react";
import { API_URL } from "../../../API";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import RelatedNewsSection from "../../Components/SharedComponents/RelatedNewSection";
import { InstagramFilled } from "@ant-design/icons";
import AdCardPopup from "../../Components/DetailsPage/AdCardPopup";
import StoriesCard from "../../Components/MainPage/StoriesCard";

const { TextArea } = Input;

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

// In your URL generation (where you create links):
const generateShareUrl = (id, title) => {
  const slug = title.replace(/[/\%.?]/g, "").split(" ").join("-");
  const encodedId = encodeURIComponent(id); // Properly encode the entire ID
  return `${window.location.origin}/details/${slug}?id=${encodedId}`;
};

// Babloo In your URL parsing (where you read the ID):
function findStoryIdFromUrl(pathname) {
  const idRegex = /id=([^&]+)/;
  const idMatch = pathname.match(idRegex);

  if (idMatch) {
    try {
      // Decode the entire ID parameter
      return decodeURIComponent(idMatch[1]);
    } catch (e) {
      console.error("Error decoding ID:", e);
      return idMatch[1]; // Return raw if decoding fails
    }
  } else {
    console.log("ID parameter not found in the URL.");
    return null;
  }
}


// function findStoryIdFromUrl(pathname) {
//   // Regular expression to find the 'id' parameter and its value
//   const idRegex = /id=([^&]+)/;

//   // Match the 'id' parameter in the URL
//   const idMatch = pathname.match(idRegex);

//   if (idMatch) {
//     // Extract the value of the 'id' parameter
//     const id = idMatch[1];

//     return id;

//     // You can now use the 'id' variable for further processing
//   } else {
//     console.log("ID parameter not found in the URL.");
//   }
// }

const DetailsPage = () => {
  const { pathname, search } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [data, setData] = useState(null);
  const [article, setArticle] = useState(null);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState([]);
  const { t, i18n } = useTranslation();
  const navigation = useNavigate();
  const { loading, setLoading, effect } = useContext(Loading);
  const storyId = findStoryIdFromUrl(search);
  const query = new URLSearchParams(search);

  const [topStories, settopStories] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);

  // console.log("data in details page : ", data);
  useEffect(() => {
    const href = window.location.href;
    axios
      .get(`${API_URL}/article?id=${storyId}&url=${href}`)
      .then(async (article) => {
        // console.log("news detail api response : ", article);
        setArticle(article);
        // let title = article?.data[0].title.split(" ").join("-");
        // console.log(article?.data[0], "art");
        setLoading(false);
        setData(article?.data[0]);
        // navigation(`/details/${title}`);
        document.getElementById("mob_parar").innerHTML =
          article?.data[0].discription;
        document.getElementById("parar").innerHTML =
          article?.data[0].discription;
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [storyId]);
  // console.log("article : ", article);
  const [data2, setData2] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/comment?id=${query.get("id")}`).then((res) => {
      // console.log("article from api : ", res.data);
      setData2(res.data);
    });
  }, []);
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

  useEffect(() => {
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=7&type=img&newsType=topStories&status=online`
      )
      .then((data) => {
        settopStories(data.data);
      })
      .catch(() => {});
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=7&type=img&newsType=breakingNews&status=online`
      )
      .then((data) => {
        setBreakingNews(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data.keyWord) || data.keyWord.length === 0) {
      console.error("Invalid `data` or `keyWord` is missing or empty:", data);
      setRelatedNews([]); // Clear related news if data is invalid
      return;
    }

    // Combine breakingNews and topStories into one array
    const combinedNews = [...breakingNews, ...topStories];
    // console.log("Combined news:", combinedNews);

    // Step 1: Filter by keywords
    let filteredNews = combinedNews.filter(
      (newsItem) =>
        newsItem.keyWord?.some((keyword) => data.keyWord.includes(keyword)) && // Matches any keyword
        newsItem._id !== data._id // Exclude the current data
    );

    // console.log("Filtered news by keywords:", filteredNews);

    // Step 2: If no keyword matches, fallback to newsType
    if (filteredNews.length < 1) {
      console.warn("No news matched keywords. Falling back to newsType match.");
      filteredNews = combinedNews.filter(
        (newsItem) =>
          newsItem.topic === data.topic && // Matches the news type
          newsItem._id !== data._id // Exclude the current data
      );
    }

    // console.log("Final filtered news (after fallback):", filteredNews);

    // Step 3: Update relatedNews state
    setRelatedNews([...filteredNews]); // Ensure a new reference to trigger state updates
  }, [data, breakingNews, topStories]);
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

  const newFormatDate = (datetimeStr) => {
    // console.log("newFormatDate", i18n.language);

    // Create a Date object from the input string
    const date = new Date(datetimeStr);

    // Set up options for date and time
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    // Format the date and time separately
    const formattedDate = date.toLocaleDateString(
      i18n.language === "ur"
        ? "ur-PK"
        : i18n.language === "hi"
        ? "hi-IN"
        : "en-GB",
      dateOptions
    );
    const formattedTime = date.toLocaleTimeString(
      i18n.language === "ur"
        ? "ur-PK"
        : i18n.language === "hi"
        ? "hi-IN"
        : "en-GB",
      timeOptions
    );

    // Combine date and time for output
    let formattedDateTime;
    if (i18n.language === "ur") {
      formattedDateTime = `${formattedTime} ${formattedDate}`;
    } else {
      formattedDateTime = `${formattedDate}, ${formattedTime}`;
    }

    return formattedDateTime;
  };

  // Twitter Embed 
// Add this useEffect hook to your component
useEffect(() => {
  // Function to load Twitter widgets
  const loadTwitterWidgets = () => {
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  };

  // Load Twitter widgets when component mounts
  loadTwitterWidgets();

  // Also load widgets when content changes (if you're using dynamic content)
  const observer = new MutationObserver(() => {
    loadTwitterWidgets();
  });

  // Observe changes to the content container
  const contentContainer = document.getElementById('parar');
  if (contentContainer) {
    observer.observe(contentContainer, {
      childList: true,
      subtree: true
    });
  }

  return () => {
    observer.disconnect();
  };
}, [data]); // Add dependencies as needed
// Replace your current content setting code with this:
useEffect(() => {
  if (data?.discription) {
    // Process the description to ensure Twitter embeds work
    const processedHtml = data.discription
      .replace(/<blockquote class="twitter-tweet">/g, 
        '<blockquote class="twitter-tweet" data-lang="hi" data-theme="light">')
      .replace(/<script async="" src="https:\/\/platform\.twitter\.com\/widgets\.js" charset="utf-8"><\/script>/g, '');

    // Set the processed HTML
    document.getElementById("mob_parar").innerHTML = processedHtml;
    document.getElementById("parar").innerHTML = processedHtml;

    // Manually load Twitter widgets after content is set
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }
}, [data?.discription]);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (window.twttr) {
          window.twttr.widgets.load(entry.target);
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.twitter-tweet').forEach(tweet => {
    observer.observe(tweet);
  });

  return () => observer.disconnect();
}, [data?.discription]);

  // console.log("this is coming from the new article", article);

  const shareurl = article?.data[0].shareUrl;
  const title = "Loksatya News App";
  const imgUrl = data?.image;
  const description = data?.discription;
  const [adPopup, setAdPopup] = useState(false);

  useEffect(() => {
    setAdPopup(true);
  }, [data]);

  // console.log("detail article data : ", data);

  return (
    <div className=" relative">
      <>
        {/* Ad Popup */}
        {adPopup && (
          <AdCardPopup type={"top"} adPopup={adPopup} setAdPopup={setAdPopup} />
        )}
      </>

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="url" content={shareurl} />
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imgUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imgUrl} />
      </Helmet>

      {/* mobile version  */}
      <div className="mobileDetailsPage ">
        <div className="">
          <AdCard type={"mid"} />
        </div>
        <div className="p-2">
          <h1
            style={{ fontSize: "20px", fontWeight: "bold" }}
            className="details-page-main-heading"
          >
            {data?.title}
          </h1>
          <p>
            <span className="font-bold">Reported By: </span>
            {data?.reportedBy}
          </p>
          {/* <p>
            <span className="font-bold">Date: </span>
            {data?.date}
          </p> */}
          <p>
            <span className="font-bold">Date & Time: </span>
            {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
          </p>
          {/* <p>
            <span className="font-bold">Time: </span>
            {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
          </p> */}
        </div>

        <div className="details-page-top-item3 -mt-2  px-2 pb-2">
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
              <FacebookShareButton url={shareurl} quote={title} hashtag="#news">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareurl}
                title={title}
                className="Demo__some-network__share-button"
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <EmailShareButton
                url={shareurl}
                subject={title}
                body={`Check this out: ${title} \n ${shareurl} \n ${imgUrl}`}
                className="Demo__some-network__share-button"
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <InstagramShareButton url={window.location.href} />
            </div>
          </div>
          {/* whatsapp share */}
          <div>
            <WhatsappShareButton
              url={shareurl}
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} round style={{ marginTop: "10px" }} />
            </WhatsappShareButton>
          </div>
        </div>
        <div className="mobileDetailsMainImage ">
          <img
            src={data ? data?.image : DetailImg}
            alt=""
            className="details-page-main-img"
          />
        </div>
        <div className="container3">
          <div className="deatils-main-para-area " id="mob_parar"></div>

          <div className="container-detail-page-rigth-side mt-3 ">
            {relatedNews && (
              <div className="details-page-related-news">
                <div className="details-page-related-news-heading">
                  {t("rn")}
                </div>
              </div>
            )}
            <div className="detail-page-relate-new-cards">
              {relatedNews?.slice(0, 5)?.map((data, index) => {
                let title = data.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (data.slug) {
                  title = data.slug;
                }
                if (data._id === storyId) return;
                const OnPress = () => {
                  navigation(`/details2/${title}?id=${encodeURIComponent(data?._id)}`);
                };
                const text = data?.title.substring(0, 45) + "...";
                const image = data?.image;

                // return (
                //   <div
                //     className="related-news-card mobile-related-news-card"
                //     onClick={OnPress}
                //   >
                //     <img src={image ? image : img} alt="" />
                //     <div
                //       style={{
                //         margin: "0px",
                //         flexGrow: "1",
                //         justifyContent: "space-between",
                //       }}
                //       className="related-news-card-text "
                //     >
                //       <span className=" stories-card-text w-full font-bold">
                //         {text
                //           ? text
                //           : "The e-Sanjeevani platform is ensuring healthcare to the last mile, by facilitat..."}
                //       </span>
                //     </div>
                //   </div>
                // );
                return (
                  <StoriesCard
                    data={data}
                    key={index}
                    OnPress={() =>
                      navigation(`/details2/${title}?id=${encodeURIComponent(data?._id)}`)
                    }
                    wid="w-[45%] h-[110px]"
                    image={data?.image}
                    text={data?.title}
                  />
                );
              })}
            </div>
            <LatesetNewsSection />
            <div className="w-full ">
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
      </div>

      {/* Laptop version  */}
      <div className="detail-page-top-container container2 container3 webDetailsContainer ">
        <div className="container-detail-page-left-side ">
          <h1 className="details-page-main-heading">{data?.title}</h1>
          <div className="details-page-top-items">
            <div className="details-page-top-item1">
              <FaUser style={{ marginRight: "10px" }} />
              {data?.reportedBy}
              {/* {console.log(data)} */}
            </div>
            <div className="details-page-top-item2">
              <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
              {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
            </div>

            <div className="details-page-top-item3 ">
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
                  <FacebookShareButton
                    url={shareurl}
                    quote={title}
                    hashtag="#news"
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareurl}
                    title={title}
                    className="Demo__some-network__share-button"
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={shareurl}
                    subject={title}
                    body={`Check this out: ${title} \n ${shareurl} \n ${imgUrl}`}
                    className="Demo__some-network__share-button"
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>

                  <InstagramShareButton url={window.location.href} />
                </div>
              </div>
              {/* whatsapp share */}
              <div>
                <WhatsappShareButton
                  url={shareurl}
                  className="Demo__some-network__share-button"
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </div>
            </div>
          </div>
          <img
            src={data ? data?.image : null}
            alt=""
            className="details-page-main-img"
          />
          <div className="details-main-text-area">
            {/* <div className="details-main-text-area-heading">{data?.title}</div> */}
            <div className="deatils-main-para-area" id="parar"></div>
          </div>
          <RelatedNewsSection currentNewId={storyId} />
          <div className="detalis-page-commment-area1">
            <div className=" bg-gradient-to-r text-red-500 p-3 from-white text-2xl to-transparents font-bold">
              <span className="text-black">{t("to")} :</span> {data?.topic}
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
          <div className="w-full mt-4">
            <AdCard type={"bottom"} />
          </div>
        </div>
        <div className="container-detail-page-rigth-side ">
          <LatesetNewsSection />
          <div className="w-full">
            <AdCard type={"mid"} />
          </div>
          {topStories && (
            <div className="details-page-related-news">
              <div className="details-page-related-news-heading">{t("ln")}</div>
            </div>
          )}
          <div className="detail-page-relate-new-cards">
            {breakingNews?.slice(0, 6)?.map((data, index) => {
              let title = data.title
                .replace(/[/\%.?]/g, "")
                .split(" ")
                .join("-");
              if (data.slug) {
                title = data.slug;
              }
              if (data._id === storyId) return;

              // return (
              //   <RelatedNewsCard
              //     data={data}
              //     key={data._id}
              //     OnPress={() =>
              //       navigation(`/details2/${title}?id=${data?._id}`)
              //     }
              //     image={data?.image}
              //     text={data?.title.substring(0, 82) + "..."}
              //   />
              // );
              return (
                <StoriesCard
                  data={data}
                  key={index}
                  OnPress={() =>
                    navigation(`/details2/${title}?id=${encodeURIComponent(data?._id)}`)
                  }
                  wid="w-[45%] h-[110px]"
                  image={data?.image}
                  text={data?.title}
                />
              );
            })}
          </div>
        </div>

        <div className="detalis-page-commment-area2 ">
          <div className=" bg-gradient-to-r text-red-500 p-3 from-white text-2xl to-transparents font-bold">
            <span className="text-black">{t("to")} :</span> {data?.topic}
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
          <div>
            <div>{data2 && data2[0]?.name}</div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default DetailsPage;
