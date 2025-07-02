import React, { useContext, useEffect } from "react";
import "./style/index.css";
import ItemPageCard1 from "../../Components/ItemPage/ItemPageCard1";
import { useTranslation } from "react-i18next";
import ItemPageNewsCard from "../../Components/ItemPage/ItemPageNewsCard";
import ImageCard from "../../Components/MainPage/ImageCard";
import img7 from "../../assets/Rectangle 67.png";
import img6 from "../../assets/Group 50.png";
import SubNewsCard from "../../Components/ItemPage/SubNewsCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Empty, Skeleton, Space } from "antd";
import { Loading } from "../../Context";
import axios from "axios";
import { API_URL } from "../../../API";
import SubCardSection from "../../Components/SharedComponents/SubCardSection";
import RelatedNewsCard from "../../Components/DetailsPage";
import { data } from "autoprefixer";
import StoriesCard from "../../Components/MainPage/StoriesCard";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import AdCard from "../../Components/Global/AdCard";

const ItemPage = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [topStories, settopStories] = useState();
  const [stories, setStories] = useState(null);
  const [bottomAd, setBottomAd] = useState({});
  const [imageUrl, setImageUrl] = useState(
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145"
  );

  useEffect(() => {
    axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
      const activeAds = data.data.filter((data) => data.active);

      setBottomAd(activeAds.reverse()[0]);
    });
  }, []);

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

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

  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      // console.log("updated Ad", response);
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  const { search } = useLocation();
  const [Data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const [isChange, setIsChange] = useState(true);
  const { loading, setLoading, effect } = useContext(Loading);
  const [videos, setVideos] = useState([]);
  const query = new URLSearchParams(search);
  const navigation = useNavigate();
  // console.log(query.get("item"));
  const queryParams = new URLSearchParams(window.location.search);
  const newsType = queryParams.get("newsType"); // 'video' or another value
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  // console.log("data in itemconcat page : ", Data);
  // console.log("newstype in itemconcat page : ", newsType);
  useEffect(() => {
    if (newsType === "videos") {
      // Function to extract video ID from YouTube URL
    }
  }, [newsType]);
  useEffect(() => {
    setIsLoad(true);
    setTimeout(() => {
      if (newsType === "videos") {
        axios
          .get(`${API_URL}/video`)
          .then((data) => {
            // console.log("video res in itempage : ", data);
            const activeVdos = data.data.filter((data) => data.status);
            // console.log("active videos : ", activeVdos);
            setData(activeVdos);
            setIsLoad(false);
          })
          .catch(() => {
            setIsLoad(false);
          });
      } else {
        axios
          // .get(`${API_URL}/article?newsType=${query.get("newsType")}`)
          // .then((data) => {
          //   console.log("data res in itempage : ", data);
          //   setData(data.data);
          //   setIsLoad(false);
          .get(`${API_URL}/article?newsType=${query.get("newsType")}`)
          .then((data) => {
            // console.log("data res in itempage: ", data);

            // Filter to ensure only articles with status 'online'
            const onlineArticles = data?.data.filter(
              (article) => article.status === "online"
            );

            // Set the filtered data
            setData(onlineArticles);
            setIsLoad(false);
          })
          .catch(() => {
            setIsLoad(false);
          });
      }
    }, 2000);
  }, [newsType]);
  // console.log("news type itempage2 : ", newsType);

  return (
    <>
      <div className="container2 container3">
        <div className="item-page-heading details-main-related-new-area-heading ">
          {query ? (
            <>
              {query.get("newsType") && query.get("newsType") === "topStories"
                ? "Top Stories"
                : null}
              {query.get("newsType") && query.get("newsType") === "upload"
                ? "ताजा खबर"
                : null}
              {query.get("newsType") && query.get("newsType") === "videos"
                ? "videos"
                : null}
              {query.get("newsType") && query.get("newsType") === "breakingNews"
                ? "बड़ी खबर"
                : null}
            </>
          ) : null}
        </div>
        <div className="item-page-main-area">
          <div
            className="item-page-main-area-1"
            // style={{ backgroundColor: "red" }}
          >
            {isLoad ? (
              <>
                <div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Skeleton.Image
                      style={{ height: "180px", width: "260px" }}
                      active={true}
                    />
                    <Skeleton style={{ marginLeft: 10 }} active={isLoad} />
                  </div>
                </div>
              </>
            ) : Data.length > 0 ? (
              Data?.map((item, index) => {
                // Format the date
                let date = new Date(item.date ? item.date : item.createdAt);
                date = JSON.stringify(date).split("T")[0].split('"')[1];

                // Generate the title or use slug if available
                let title = item.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (item.slug) {
                  title = item.slug;
                }

                // Log the item data for debugging
                // console.log("data in mapped item: ", item);

                // Helper function to format date
                const formatDate = (dateString) => {
                  const date = new Date(dateString);
                  return date.toISOString().split("T")[0];
                };

                // Extract video ID from a YouTube URL
                const extractVideoId = (link) => {
                  const regex =
                    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
                  const match = link?.match(regex); // Updated to use `link` variable
                  return match ? match[1] : null;
                };

                // Generate the thumbnail URL using the video ID
                const generateThumbnailUrl = (videoId) => {
                  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                };

                // Check if the link is a YouTube video, and extract the thumbnail if so
                const videoId = extractVideoId(item?.link);
                const videoThumbnail = videoId
                  ? generateThumbnailUrl(videoId)
                  : null;

                return (
                  <>
                    <div className="hidden sm:block">
                      <ItemPageCard1
                        key={index}
                        onPress={() => {
                          if (item.type === "img") {
                            navigation(`/details/${title}?id=${item._id}`);
                          } else {
                            navigation(`/videos/${title}?id=${item._id}`);
                          }
                        }}
                        title={item?.title}
                        discription={item?.discription}
                        image={
                          newsType === "videos" ? videoThumbnail : item?.image
                        }
                        date={date}
                        type={item.type}
                      />
                    </div>
                    <div className="block sm:hidden">
                      <StoriesCard
                        data={data}
                        key={index}
                        OnPress={() => {
                          if (item.type === "img") {
                            navigation(`/details/${title}?id=${item._id}`);
                          } else {
                            navigation(`/videos/${title}?id=${item._id}`);
                          }
                        }}
                        wid="w-[45%] h-[110px]"
                        image={
                          newsType === "videos" ? videoThumbnail : item?.image
                        }
                        text={item?.title}
                        date={date}
                      />
                    </div>
                  </>
                );
              })
            ) : (
              <div style={{ marginTop: 50 }}>
                <Empty />
              </div>
            )}
          </div>
          <div className="w-full md:hidden">
            <AdCard type={"mid"} />
          </div>
          <div className="item-page-main-area-2 pt-0 -mt-4 lg:-mt-0">
            <div className="item-page-main-area-2-news-cards w-full">
              {newsType === "topStories" ? (
                <div>
                  {topStories && (
                    <div className="details-page-related-news mt-3">
                      <div className="details-page-related-news-heading">
                        {t("rn")}
                      </div>
                    </div>
                  )}
                  <div className="detail-page-relate-new-cards">
                    {topStories?.map((data, index) => {
                      let title = data.title
                        .replace(/[/\%.?]/g, "")
                        .split(" ")
                        .join("-");
                      if (data.slug) {
                        title = data.slug;
                      }
                      // if (data._id === storyId) return;

                      return (
                        // <RelatedNewsCard
                        //   data={data}
                        //   key={data._id}
                        //   OnPress={() =>
                        //     navigation(`/details2/${title}?id=${data?._id}`)
                        //   }
                        //   image={data?.image}
                        //   text={data?.title.substring(0, 82) + "..."}
                        // />
                        <StoriesCard
                          data={data}
                          key={index}
                          OnPress={() =>
                            navigation(`/details2/${title}?id=${data?._id}`)
                          }
                          wid="w-[45%] h-[110px]"
                          image={data?.image}
                          text={data?.title}
                        />
                      );
                    })}
                  </div>{" "}
                </div>
              ) : (
                <LatesetNewsSection />
              )}
            </div>
            {/* <SubCardSection/> */}
          </div>
        </div>
      </div>
      {stories && stories.length > 0 && (
        <div className="visual-stories-main-container container2 container3">
          <div className="main-page-technology-heading">{t("vs")}</div>

          <div className="main-page-visual-story-Ad-container">
            <div className="main-page-visual-story-container">
              {stories.map((story) => {
                return (
                  <a href={`/stories?id=${story._id}`} target="_blank">
                    <div key={story._id} className="visual-story-card">
                      <ImageCard
                        style={{
                          fontSize: "15px",
                          fontWeight: 400,
                          height: "80px",
                          borderRadius: 0,
                        }}
                        fromVStrories={true}
                        height="300px"
                        width="100"
                        img={story.images[0]?.img}
                        id={story._id}
                        title={story.title}
                        text={story.title}
                      />
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="main-page-Ad-container-visualStory">
              {/* {console.log(bottomAd)} */}
              {bottomAd && (
                <a
                  href={bottomAd.link}
                  target="_blank"
                  onClick={() => {
                    onClickAd(bottomAd._id);
                  }}
                >
                  <img
                    src={bottomAd.imgLink}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                    {bottomAd.slugName}
                  </p>
                </a>
              )}
            </div>
          </div>

          {/* <div className="visual-stories-main-container2 container3">
            <div className="visual-stories-main-container-part1">
              <div
                className="visual-stories-main-container-main-area"
                style={{
                  display: "flex", // Set display to flex
                  flexWrap: "wrap", // Allow wrapping to the next line
                }}
              >
                {console.log("***************storues",stories)}
                {stories &&
                  stories.length > 0 &&
                  stories.map((story) => (
                    <Col span={8} key={story._id}>
                      <Card
                        hoverable
                        style={{ marginBottom: 16, flex: 1 }}
                        cover={<img alt={story.title} src={story.image} />}
                      >
                        <Meta
                          title={story.title}
                          description="www.instagram.com"
                        />
                      </Card>
                    </Col>
                  ))}
              </div>
            </div>
          </div> */}
          {/* ... (your existing JSX code) */}
        </div>
      )}
    </>
  );
};

export default ItemPage;
