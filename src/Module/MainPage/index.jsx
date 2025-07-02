import { useEffect, useRef, useState } from "react";
import "./style/index.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa6";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import VideoCard from "../../Components/MainPage/VideoCard";
import ImageCard from "../../Components/MainPage/ImageCard";
import StoriesCard from "../../Components/MainPage/StoriesCard";
import NewsCard from "../../Components/MainPage/NewsCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  IoCameraSharp,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { Col, Progress, Radio, Row } from "antd";
import { API_URL } from "../../../API";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../../assets/img-main1.png";
import img2 from "../../assets/img-main-2.png";
import img3 from "../../assets/Rectangle 33.png";
import img4 from "../../assets/Rectangle 28.png";
import img5 from "../../assets/img-5.png";
import slider from "../../assets/slider (2).png";
import AllSectionArticle from "../../Components/MainPage/SectionArticle";
import { PlayCircleOutlined } from "@ant-design/icons";
import VdoThumb from "../../Components/common/VdoThumb";
import { useAd } from "../../Context/TopAdContext";
import AdCardPopup from "../../Components/DetailsPage/AdCardPopup";
import AdCard from "../../Components/Global/AdCard";
import BigNewsCard from "../../Components/MainPage/BigNewsCard";
import ShirshCard from "../../Components/MainPage/ShirshCard";

const MainPage = () => {
  const [sliderItem, setSliderItem] = useState(0);
  const [sliderItem2, setSliderItem2] = useState(1);
  const [imag1, setimag1] = useState();
  const [showItem, setShowItem] = useState(true);
  const [userData, setUserData] = useState([]);
  const [flashnews, setflashnews] = useState([]);
  const [Article, setArticle] = useState([]);
  const [video, setVideo] = useState([]);

  const [photo, setPhoto] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [ArticleTop, setArticleTop] = useState(null);
  const [isModal2Open, setIsModal2Open] = useState(true);
  const [breakingNews, setbreakingNews] = useState([]);
  const [breakingNewsSlider, setbreakingNewsSlider] = useState([]);
  const [sliderArticles, setSliderArticles] = useState([]);
  // console.log("Slider articles f: ", sliderArticles);
  // console.log("breaking news f: ", breakingNews);
  const [combinedNews, setCombinedNews] = useState([]);
  // console.log("combined news f: ", combinedNews);
  const [val, setVal] = useState("");
  const sliderItems = [slider, img1, img2, img4];
  const { t } = useTranslation();
  const [topAd, setTopAd] = useState({});
  const [midAd, setMidAd] = useState([]);
  const [bottomAd, setBottomAd] = useState({});
  const [topStories, settopStories] = useState([]);
  const navigation = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollOptions, setPollOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stories, setStories] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState(null);
  const [DisplayImageCrousal, setDisplayImageCrousal] = useState(false);
  const [technology, setTechnology] = useState([]);
  // Babloo 
  const [priorityArticles, setPriorityArticles] = useState([]);

  // console.log("topstriies in index: ", topStories);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const breakingNewsRef = useRef(null);
  const photosRef = useRef(null);
  const [customSlider, setCustomSlider] = useState([]);
  const [customBannerSlider, setCustomBannerSlider] = useState([]);

  const scrollLeft = (ref) => {
    const container = ref.current;
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };
  // console.log("all categories data in index page : ", allCategoriesData);
  const scrollRight = (ref) => {
    const container = ref.current;
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const updateScrollState = (ref, setLeft, setRight) => {
    const container = ref.current;
    if (container) {
      setLeft(container.scrollLeft > 0);
      setRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };
  useEffect(() => {
    const container = breakingNewsRef.current;
    if (container) {
      container.addEventListener("scroll", () =>
        updateScrollState(breakingNewsRef, setCanScrollLeft, setCanScrollRight)
      );
      updateScrollState(breakingNewsRef, setCanScrollLeft, setCanScrollRight);
      return () => container.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  useEffect(() => {
    const container = photosRef.current;
    if (container) {
      container.addEventListener("scroll", () =>
        updateScrollState(photosRef, setCanScrollLeft, setCanScrollRight)
      );
      updateScrollState(photosRef, setCanScrollLeft, setCanScrollRight);
      return () => container.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  useEffect(() => {
    const combinedArray = [
      ...breakingNews.slice(0, 2), // Take the first 2 items from breakingNews
      ...sliderArticles.slice(0, 8), // Take the first 8 items from articles
    ];
    setCombinedNews(combinedArray);
  }, [breakingNews, sliderArticles]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the list of categories
        const contentResponse = await axios.get(
          `${API_URL}/content?type=category`
        );
        const categories = contentResponse.data.sort((a, b) => {
          const seqA = a.sequence !== undefined ? a.sequence : Number.MAX_VALUE;
          const seqB = b.sequence !== undefined ? b.sequence : Number.MAX_VALUE;
          return seqA - seqB;
        });

        // Prepare category names
        const categoryNames = categories.map((category) => category.text);

        // Fetch articles for all categories
        const allCategoryData = await Promise.all(
          categoryNames.map(async (category) => {
            // Fetch both 'vid' and 'img' data concurrently
            const [vidResponse, imgResponse] = await Promise.all([
              axios.get(
                `${API_URL}/article?pagenation=true&limit=2&category=${category}&type=vid&priority=true&status=online`
              ),
              axios.get(
                `${API_URL}/article?pagenation=true&limit=7&category=${category}&type=img&priority=true&status=online`
                // `${API_URL}/article?pagenation=true&limit=7&category=${category}&type=img&newsType=breakingNews&status=online`
              ),
            ]);

            // Extract and filter data
            const vidData =
              vidResponse.data?.length > 0 ? vidResponse.data : null;
            const imgData =
              imgResponse.data?.length > 0 ? imgResponse.data : null;

            // Return category data only if there's valid data
            if (vidData || imgData) {
              return { category, vidData, imgData };
            }
            return null;
          })
        );

        // Filter out null entries
        const filteredData = allCategoryData.filter((data) => data !== null);

        // Set state with the final filtered data
        setAllCategoriesData(filteredData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Video handlers
  // Function to convert YouTube link to embed URL
  const convertToEmbedUrl = (url) => {
    const urlParts = url.split("watch?v=");
    if (urlParts?.length > 1) {
      return `https://www.youtube.com/embed/${urlParts[1].split("&")[0]}`;
    }
    return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
  };
  const navigate = useNavigate();
  // style for video

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story`);

        // Filter stories where status is true
        const filteredStories = response.data.filter(
          (story) => story.status === true
        );
        // Set the filtered stories in the state
        setStories(filteredStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch slider articles
        const sliderArticlesResponse = await axios.get(
          `${API_URL}/article?pagenation=true&limit=8&type=img&status=online&slider=true`
        );
        const sliderArticlesData = sliderArticlesResponse?.data || [];

        // Filter slider articles to include only online status
        const onlineArticles = sliderArticlesData.filter(
          (article) => article.status === "online"
        );
        setSliderArticles(onlineArticles);

        // Fetch breaking news, top stories, and latest news concurrently
        const [breakingResponse, topStoriesResponse, latestNewsResponse, priorityResponse] =
          await Promise.all([
            axios.get(
              `${API_URL}/article?pagenation=true&limit=12&type=img&newsType=breakingNews&status=online&priority=true`
            ),
            axios.get(
              `${API_URL}/article?pagenation=true&limit=10&type=img&newsType=topStories&status=online&priority=true`
            ),
            axios.get(
              `${API_URL}/article?pagenation=true&limit=14&type=img&newsType=upload&status=online&priority=true`
            ),
            // Babloo 
            axios.get(
              `${API_URL}/article?pagenation=true&limit=5&priority=true&status=online`
            )
          ]);

        // Extract data from responses
        const breakingNewsData = breakingResponse?.data || [];
        const topStoriesData = topStoriesResponse?.data || [];
        const latestNewsData = latestNewsResponse?.data || [];
        // babloo 
        const priorityData = priorityResponse?.data || [];


        // Set breaking news data
        setbreakingNews(breakingNewsData);

        // Filter top stories to exclude articles already in slider articles
        const uniqueTopStories = topStoriesData.filter(
          (article) =>
            !sliderArticlesData.some(
              (sliderArticle) => sliderArticle._id === article._id
            )
        );
        settopStories(uniqueTopStories);

        // Set priority articles
        setPriorityArticles(priorityData);


        // Set latest news data
        setLatestNews(latestNewsData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
    fetchArticlesSlider();
  }, []);

  // const fetchArticlesSlider = async () => {
  //   try {
  //     // Fetch slider articles with sequence
  //     const sliderResponse = await axios.get(
  //       `${API_URL}/article?slider=true&limit=2&status=online`
  //     );

  //     // Ensure we have exactly 2 articles for the slider
  //     let sliderArticlesData = sliderResponse.data;

  //     // If we don't have 2 sequenced articles, fetch priority articles
  //     if (sliderArticlesData.length < 2) {
  //       const priorityResponse = await axios.get(
  //         `${API_URL}/article?priority=true&limit=${2 - sliderArticlesData.length}&status=online`
  //       );
  //       sliderArticlesData = [...sliderArticlesData, ...priorityResponse.data];
  //     }

  //     setSliderArticles(sliderArticlesData);

  //     // Sort slider articles by sequence (1 first, then 2, then others)
  //     const sortedSliderArticles = [...sliderArticlesData].sort((a, b) => {
  //       // Handle null sequences by putting them after sequenced articles
  //       const aSeq = a.sequence || 999;
  //       const bSeq = b.sequence || 999;
  //       return aSeq - bSeq;
  //     });

  //     setbreakingNewsSlider(sortedSliderArticles);

  //     // Rest of your fetching logic...
  //   } catch (error) {
  //     console.error("Error fetching articles:", error);
  //   }
  // };

  // console.log("latest news on homepage : ", latestNews);
  // console.log("breaking news on homepage : ", breakingNews);
  useEffect(() => {
    axios
      .get(`${API_URL}/polls`)
      .then((response) => {
        const pollsData = response.data;
        const latestPoll =
          pollsData?.length > 0 ? pollsData.slice(-1)[0] : null;
        setCurrentPoll(latestPoll);
        setPollOptions(latestPoll ? latestPoll.options : []);
      })
      .catch((error) => {
        console.error("Error fetching polls:", error);
        // Handle error
      });
  }, []);

  const fetchArticlesSlider = async () => {
    try {
      // Fetch sequenced slider articles (1 and 2)
      const sequencedResponse = await axios.get(
        `${API_URL}/article?slider=true&status=online&sequence=1&sequence=2`
      );

      // Sort by sequence (1 first, then 2)
      const sequencedArticles = sequencedResponse.data.sort((a, b) => a.sequence - b.sequence);
      setbreakingNewsSlider(sequencedArticles);

      // Fetch regular slider articles (without sequence)
      const sliderResponse = await axios.get(
        `${API_URL}/article?slider=true&status=online&limit=8&sequence=0`
      );
      setSliderArticles(sliderResponse.data);
    } catch (error) {
      console.error("Error fetching slider articles:", error);
    }
  };

  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      // console.log("updated Ad", response);
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  const submitVote = async (pollId, optionIndex) => {
    try {
      // Call the backend API to update total votes
      const response = await axios.post(`${API_URL}/polls/${pollId}/vote`, {
        pollId,
        optionIndex,
      });

      // Handle the response if needed
    } catch (error) {
      // Handle errors if the API call fails
      console.error("Error submitting vote:", error);
    }
  };

  useEffect(() => {
    const trackAdClick = async (ad) => {
      try {
        if (ad && ad._id) {
          await axios.get(`${API_URL}/ads/click?id=${ad._id}`);
        }
      } catch (error) {
        console.error("Error tracking ad click:", error);
      }
    };

    // Track mid, bottom, and top ads click concurrently
    Promise.all([
      trackAdClick(midAd),
      trackAdClick(bottomAd),
      trackAdClick(topAd),
    ]).catch((error) => {
      console.error("Error in ad click tracking:", error);
    });
  }, [midAd, bottomAd, topAd]);

  useEffect(() => {
    const fetchAds = async (side) => {
      try {
        const { data } = await axios.get(
          `${API_URL}/ads?active=true&side=${side}`
        );
        const activeAds = data.filter((ad) => ad.active);
        return activeAds.reverse()[0]; // return the first ad after reversing
      } catch (error) {
        console.error(`Error fetching ${side} ads:`, error);
        return null;
      }
    };

    const fetchAdsData = async () => {
      try {
        // Fetch all ads concurrently
        const [topAdData, midAdData, bottomAdData] = await Promise.all([
          fetchAds("top"),
          fetchAds("mid"),
          fetchAds("bottom"),
        ]);

        // Set the respective ads in state
        setTopAd(topAdData);
        setMidAd(midAdData);
        setBottomAd(bottomAdData);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAdsData();
  }, []);

  // console.log("midads on homepage : ", midAd);
  const showModal2 = () => {
    setIsModal2Open(true);
  };
  const handleCancel2 = () => {
    setIsModal2Open(false);
  };
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/article?pagenation=true&limit=6&type=img`
        );
        setArticle(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/video`);

        // Filter videos where status is true
        const filteredVideos = response.data.filter(
          (video) => video.status === true
        );

        // Set the filtered videos in the state
        setVideo(filteredVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/photo`);

        // Filter and sort photos in one step
        const filteredPhotos = data
          .filter((item) => item.status === true) // Only photos with status: true
          .sort((a, b) => {
            // Sort by priority first (true first), then by createdAt (newest first)
            if (a.periority === b.periority) {
              return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
            }
            return b.periority ? 1 : 0 - (a.periority ? 1 : 0); // Higher priority first
          });

        setPhoto(filteredPhotos); // Update state with filtered and sorted photos
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleResponse, flashNewsResponse] = await Promise.all([
          axios.get(`${API_URL}/article?id=6524337309c3cf5a3cca172a`),
          axios.get(`${API_URL}/flashnews`),
        ]);

        setArticleTop(articleResponse.data[0]);

        const activeFlashNews = flashNewsResponse.data.filter(
          (item) => item.status === "active"
        );
        setflashnews(activeFlashNews);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchData();
  }, []); // The effect still runs only once, like the original

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashnews?.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === flashnews?.length - 1 ? 0 : prevIndex + 1
    );
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSliderItem((prevItem) => (prevItem + 1) % sliderArticles.length);
      if (flashnews.length) {
        handleNextClick();
      }
    }, 7000);
    return () => {
      clearInterval(intervalId);
    };
  }, [flashnews.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only auto-advance if there are slider articles
      if (sliderArticles.length > 0) {
        setSliderItem((prevItem) => (prevItem + 2) % sliderArticles.length);
        setSliderItem2((prevItem) => (prevItem + 2) % sliderArticles.length);
      }
    }, 7000);

    return () => {
      clearInterval(intervalId);
    };
  }, [sliderArticles.length]);

  // console.log("sliderArticles", sliderArticles);

  const { showAd } = useAd();
  // console.log("showtopad : ", showAd);
  const [adPopup, setAdPopup] = useState(false);
  useEffect(() => {
    setAdPopup(true);
    fetchSliderArticles();
  }, []);


  // Latest 01-07
  const fetchSliderArticles = async () => {
    try {
      // First fetch sequenced articles (1 and 2)
      const sequencedResponse = await axios.get(
        `${API_URL}/article?slider=true&status=online&sequence=1&sequence=2`
      );
      setCustomBannerSlider(sequencedResponse.data);

      // Then fetch other slider articles
      const sliderResponse = await axios.get(
        `${API_URL}/article?slider=true&status=online&limit=8`
      );
      setCustomSlider(sliderResponse.data);
    } catch (error) {
      console.error("Error fetching slider articles:", error);
    }
  };
  return (
    <div className="relative ">
      <div>
        {/* Ad Popup */}
        {adPopup && (
          <div className="absolute">
            <AdCardPopup
              type={"top"}
              adPopup={adPopup}
              setAdPopup={setAdPopup}
            />
          </div>
        )}
      </div>
      <div className="main-page-conatiner">
        <div className={`mobileMainPageContainer`}>
          {video?.map((item, index) => {
            let title = item.title
              .replace(/[/\%.?]/g, "")
              .split(" ")
              .join("-");
            if (item.slug) {
              title = item.slug;
            }
            if (index >= 1) return;

            return (
              <div
                key={index}
                onClick={() => {
                  navigation(`/videos2/${title}?id=${item?._id}`, {
                    state: item,
                  });
                }}
                style={{ position: "relative" }}
                className="mobile-main-page-videos-items"
              >
                <PlayCircleOutlined
                  style={{
                    borderRadius: "100%",
                    position: "absolute",
                    backgroundColor: "red",
                    top: "50%",
                    left: "50%",
                    fontSize: "50px",
                    color: "white",
                    translate: "-50% -50%",
                  }}
                />
                <video
                  onClick={() => {
                    navigation(`/videos2/${title}?id=${item?._id}`, {
                      state: item,
                    });
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={item.image}
                />
              </div>
            );
          })}
          <div className="container3">
            <div className="main-page-flash-news container">
              <div className="flash-news-2">
                <div className="flash-news-slider">
                  <div className="flash-news-2-text">
                    {flashnews?.length > 0 && (
                      <a
                        href={flashnews[currentIndex].link}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        {flashnews[currentIndex].slugName.substring(0, 45)}
                      </a>
                    )}
                  </div>
                  <div className="flash-news-2-icons">
                    <IoMdArrowDropleft size={25} onClick={handlePrevClick} />
                    <IoMdArrowDropright size={25} onClick={handleNextClick} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "3%",
              padding: "0 9px",
              overflow: "hidden",
            }}
          >
            <div className="main-page-slider-setting" style={{ width: "100%" }}>
              {combinedNews?.length > 0 ? (
                <Slide easing="ease" duration={3000} indicators={true}>
                  {combinedNews?.slice(0, 8)?.map((data) => (
                    <div key={data._id} className="each-slide">
                      <ImageCard
                        img={data.image}
                        text={data.title}
                        slug={data.slug}
                        title={data.title}
                        id={data._id}
                        width="100%"
                        height="32vh"
                      />
                    </div>
                  ))}
                </Slide>
              ) : (
                <div className="text-center">Loading...</div>
              )}
            </div>
          </div>

          {/* sheersh aalekh */}
          <div>
            <div className=" flex items-center justify-center my-2 mt-4">
              <>
                <div className="w-full">
                  <AdCard type={"mid"} />
                </div>
              </>
            </div>
          </div>
          <div
            className="webMainPagecomponent main-component-group flex gap-7"
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <div className="main-component-group-left" style={{ width: "70%" }}>
              <div className="image-conatiner">
                <div
                  className="main-conatiner-image-1"
                  style={{ position: "relative" }}
                >
                  <ImageCard
                    height="100%"
                    width="100%"
                    img={breakingNews?.[0]?.image}
                    text={breakingNews?.[0]?.title}
                    title={breakingNews?.[0]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    slug={breakingNews?.[0]?.slug}
                    id={breakingNews?.[0]?._id}
                  />
                </div>
                <div
                  className="main-conatiner-image-2"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <ImageCard
                    img={breakingNews?.[1]?.image}
                    text={breakingNews?.[1]?.title}
                    title={breakingNews?.[1]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    slug={breakingNews?.[1]?.slug}
                    id={breakingNews?.[1]?._id}
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>

              <div className="image-conatiner " style={{ marginTop: "5%" }}>
                <div className="main-conatiner-image-1">
                  <ImageCard
                    height="100%"
                    width="100%"
                    img={sliderArticles?.[0]?.image}
                    text={sliderArticles?.[0]?.title}
                    title={sliderArticles?.[0]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    id={sliderArticles?.[0]?._id}
                  />
                </div>
                <div
                  className="main-conatiner-image-2"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <ImageCard
                    img={sliderArticles?.[1]?.image}
                    text={sliderArticles?.[1]?.title}
                    title={sliderArticles?.[1]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    id={sliderArticles?.[1]?._id}
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>

              <div
                className="more-text"
                onClick={() => {
                  navigation(`/itempage2?newsType=topStories`);
                }}
              >
                {"और भी"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
            <div
              id="TopStories"
              className="main-component-group-right"
              style={{ width: "30%" }}
            >
              <div className="main-left-side-top ">
                <div className=" flex w-full pr-4 justify-between items-center">
                  <div className="w-[40%]">{t("ts")}</div>
                  <span className="bg-red-600 h-0.5 w-[60%]"> </span>
                </div>
              </div>
              <div className="top-stories-all-cards">
                {topStories
                  ?.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                  )
                  .map((data, index) => {
                    let title = data.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    if (title && index < 5) {
                      return (
                        <>
                          <div key={data._id} className="w-full">
                            <StoriesCard
                              data={data}
                              key={index}
                              OnPress={() =>
                                navigation(`/details/${title}?id=${data?._id}`)
                              }
                              image={data?.image}
                              wid="w-[45%]"
                              text={data?.title}
                            />
                          </div>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          </div>

          {/* forth */}
          <div className="main-conatiner container container3  border-t-2   border-gray-300 ">
            <div
              id="BigNews"
              className="main-left-side "
              style={{ flexDirection: "column", position: "relative" }}
            >
              <div className="mobileMainPageHeading">
                <div>{t("bn")}</div>
              </div>

              {/* Slider control buttons */}

              <div
                style={{
                  width: "100%",

                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  position: "absolute",
                  bottom: "75px",
                }}
              >
                <button
                  onClick={() => scrollLeft(breakingNewsRef)}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoChevronBack />
                </button>
                <button
                  onClick={() => scrollRight(breakingNewsRef)}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoChevronForward />
                </button>
              </div>
              {/* Big news container */}
              <div
                ref={breakingNewsRef}
                className="top-stories-all-cards"
                style={{
                  display: "flex",
                  overflowX: "auto",
                  // background: "red",
                  width: "100%",
                  height: "100%",
                  columnGap: "10px",
                  whiteSpace: "nowrap",
                  scrollBehavior: "smooth",
                }}
              >
                {breakingNews &&
                  breakingNews?.length > 0 &&
                  breakingNews.map((data, index) => {
                    let title = data.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    return (
                      <>
                        <div key={data._id} style={{ width: "100%", height: "100%" }}>
                          <BigNewsCard
                            data={data}
                            key={index}
                            OnPress={() =>
                              navigation(`/details/${title}?id=${data?._id}`)
                            }
                            image={data?.image}
                            text={data?.title}
                            style={{ width: "100%", height: "100%" }}
                            id="columnReverse"
                          />
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* fifth */}
          <div
            // id="Videos"
            style={{
              backgroundColor: "blue",
              padding: "0px 10px",
              width: "90%",
              display: "none",
            }}
            className="main-left-side"
          >
            <div
              style={{
                color: "white",
                backgroundColor: "transparent",
                padding: "0",
              }}
              className="mobileMainPageHeading"
            >
              Top {t("v")}
            </div>
            <div className="mobile-main-page-videos-container">
              {video?.map((item, index) => {
                let title = item.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (item.slug) {
                  title = item.slug;
                }
                if (index < 1) return;

                return (
                  <div key={index}>
                    <div
                      onClick={() => {
                        navigation(`/videos2/${title}?id=${item?._id}`, {
                          state: item,
                        });
                      }}
                      className="mobile-main-page-videos-items"
                    >
                      {item.image ? (
                        <video
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                          }}
                          src={item.image}
                        />
                      ) : (
                        <iframe
                          className="video video-card-img"
                          title="Youtube player"
                          sandbox="allow-same-origin allow-scripts allow-presentation"
                          src={item.link}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                          }}
                        ></iframe>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <AllSectionArticle data={allCategoriesData} priorityArticles={priorityArticles} />
          <div className="main-conatiner container  ">
            <div
              id="VisualStories"
              style={{ padding: "0px 10px" }}
              className="visual-stories-main-container container2 container3"
            >
              <div className="mobileMainPageHeading">{t("vs")}</div>

              <div className="main-page-visual-story-Ad-container ">
                <div className="main-page-visual-story-container">
                  {stories.map((story) => {
                    // console.log("story: ", story);

                    // Find the image with albumPeriority: true
                    const prioritizedImage = story.images.find(
                      (image) => image.albumPeriority === true
                    );
                    // console.log("prioritized: ", prioritizedImage);

                    // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                    const displayImage = prioritizedImage
                      ? prioritizedImage.img
                      : story.images[0]?.img;
                    const displayText = prioritizedImage
                      ? prioritizedImage.text
                      : story.images[0]?.text;

                    return (
                      <a
                        href={`/stories?id=${story._id}`}
                        target="_blank"
                        key={story._id}
                        rel="noreferrer"
                      >
                        <div className="visual-story-card">
                          <ImageCard
                            style={{
                              fontSize: "15px",
                              fontWeight: 400,
                              height: "80px",
                              borderRadius: 0,
                            }}
                            height="300px"
                            width="100"
                            img={displayImage}
                            id={story._id}
                            title={displayText}
                            text={story?.title}
                            fromVStrories={true}
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            id="Photos"
            className="main-video-gallery-main-container container2 container3"
            style={{ position: "relative" }}
          >
            <div className="main-page-video-heading2">{t("ph")}</div>

            {/* Arrow buttons for scrolling */}
            <div
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                position: "absolute",
                bottom: "186px",
              }}
            >
              <button
                onClick={() => scrollLeft(photosRef)}
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoChevronBack />
              </button>
              <button
                onClick={() => scrollRight(photosRef)}
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoChevronForward />
              </button>
            </div>

            <div
              ref={photosRef}
              className="main-page-photoGallery-container"
              style={{ display: "flex", overflowX: "auto", gap: "20px" }}
            >
              {photo &&
                photo.map((img, index) => {
                  // console.log("img to show in thumbnail: ", img);

                  // Find the image with albumPeriority: true
                  const prioritizedImage = img?.images.find(
                    (image) => image.albumPeriority === true
                  );
                  // console.log("prioritized: ", prioritizedImage);

                  // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                  const displayImage = prioritizedImage
                    ? prioritizedImage.img
                    : img?.images[0]?.img;

                  const displayText = prioritizedImage
                    ? prioritizedImage.text
                    : img?.images[0]?.text;

                  return (
                    <div key={index}>
                      <a
                        href={`/photos/${img?._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="photoGallery-card">
                          <img
                            src={displayImage}
                            alt={displayText}
                            style={{ width: "100%" }}
                          />
                        </div>
                      </a>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span className="pgt">{img?.title.toUpperCase()}</span>
                        <div
                          className="pgt-r"
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              lineHeight: "1",
                            }}
                          >
                            <IoCameraSharp />
                          </span>
                          <span style={{ lineHeight: "1" }}>
                            {img?.images?.length < 10
                              ? "0" + img?.images?.length
                              : img?.images?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* main mobile */}

        <div className="container3 webMainPagecomponent homepage-flashwala">
          <div className="main-page-flash-news container">
            <div className="flash-news-1 ">{t("fn")}</div>
            <div className="flash-news-2">
              <div className="flash-news-slider">
                <div className="flash-news-2-text">
                  {flashnews.length > 0 && (
                    <a
                      href={flashnews[currentIndex].link}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {flashnews[currentIndex].slugName}
                    </a>
                  )}
                </div>
                <div className="flash-news-2-icons">
                  <IoMdArrowDropleft size={25} onClick={handlePrevClick} />
                  <IoMdArrowDropright size={25} onClick={handleNextClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="main-conatiner container container3 homepage-container  webMainPagecomponent mainwebSecond">
          <div className="main-rigth-side">
            {/* <div className="image-conatiner">
              <div className="main-conatiner-image-1">
                <ImageCard
                  height="100%"
                  width="100%"
                  img={breakingNews?.[0]?.image}
                  text={breakingNews?.[0]?.title}
                  title={breakingNews?.[0]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  slug={breakingNews?.[0]?.slug}
                  id={breakingNews?.[0]?._id}
                />
              </div>
              <div
                className="main-conatiner-image-2"
                style={{
                  marginLeft: "10px",
                }}
              >
                <ImageCard
                  img={breakingNews?.[1]?.image}
                  text={breakingNews?.[1]?.title}
                  title={breakingNews?.[1]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  slug={breakingNews?.[1]?.slug}
                  id={breakingNews?.[1]?._id}
                  height="100%"
                  width="100%"
                />
              </div>
            </div> */}

            {/* Latest 01-07 */}
            <div className="image-conatiner">
              {customBannerSlider.length >= 2 ? (
                <>
                  <div className="main-conatiner-image-1">
                    <ImageCard
                      height="100%"
                      width="100%"
                      img={customBannerSlider[0]?.image}
                      text={customBannerSlider[0]?.title}
                      slug={customBannerSlider[0]?.slug}
                      id={customBannerSlider[0]?._id}
                      isFirstPosition={customBannerSlider[0]?.sequence === 1}
                    />
                  </div>
                  <div className="main-conatiner-image-2" style={{ marginLeft: "10px" }}>
                    <ImageCard
                      img={customBannerSlider[1]?.image}
                      text={customBannerSlider[1]?.title}
                      slug={customBannerSlider[1]?.slug}
                      id={customBannerSlider[1]?._id}
                      height="100%"
                      width="100%"
                      isSecondPosition={customBannerSlider[1]?.sequence === 2}
                    />
                  </div>
                </>
              ) : customBannerSlider.length === 1 ? (
                <>
                  <div className="main-conatiner-image-1">
                    <ImageCard
                      height="100%"
                      width="100%"
                      img={customBannerSlider[0]?.image}
                      text={customBannerSlider[0]?.title}
                      slug={customBannerSlider[0]?.slug}
                      id={customBannerSlider[0]?._id}
                      isFirstPosition={true}
                    />
                  </div>
                  <div className="main-conatiner-image-2 empty" style={{ marginLeft: "10px" }}>
                    <div>No secondary article</div>
                  </div>
                </>
              ) : (
                <div className="empty-slider">No featured articles</div>
              )}
            </div>

            {customSlider.length > 0 && (
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "3%",
                marginBottom: "10px",
              }}>
                {/* Left slider */}
                <div className="main-page-slider-setting">
                  {sliderItem % 2 === 0 && customSlider[sliderItem] && (
                    <div key={sliderItem}>
                      <ImageCard
                        img={customSlider[sliderItem].image}
                        text={customSlider[sliderItem].title}
                        slug={customSlider[sliderItem].slug}
                        title={customSlider[sliderItem].title}
                        id={customSlider[sliderItem]._id}
                        height="50vh"
                        width="100%"
                      />
                    </div>
                  )}

                  <div className="main-page-slider-items">
                    {customSlider
                      .map((_, i) => i)
                      .filter((i) => i % 2 === 0)
                      .map((item) => (
                        <div
                          key={item}
                          className={`slider-item ${sliderItem === item ? "slider-item-active" : ""}`}
                          onClick={() => {
                            setShowItem(false);
                            setTimeout(() => {
                              setShowItem(true);
                              setSliderItem(item);
                            }, 1000);
                          }}
                        ></div>
                      ))}
                  </div>
                </div>

                {/* Right slider */}
                <div className="main-page-slider-setting">
                  {sliderItem2 % 2 !== 0 && customSlider[sliderItem2] && (
                    <div key={sliderItem2}>
                      <ImageCard
                        img={customSlider[sliderItem2].image}
                        text={customSlider[sliderItem2].title}
                        slug={customSlider[sliderItem2].slug}
                        title={customSlider[sliderItem2].title}
                        id={customSlider[sliderItem2]._id}
                        height="50vh"
                        width="100%"
                      />
                    </div>
                  )}

                  <div className="main-page-slider-items">
                    {customSlider
                      .map((_, i) => i)
                      .filter((i) => i % 2 !== 0)
                      .map((item) => (
                        <div
                          key={item}
                          className={`slider-item ${sliderItem2 === item ? "slider-item-active" : ""}`}
                          onClick={() => {
                            setShowItem(false);
                            setTimeout(() => {
                              setShowItem(true);
                              setSliderItem2(item);
                            }, 1000);
                          }}
                        ></div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {/* <div
              className="more-text "
              onClick={() => {
                navigation(`/itempage2?newsType=topStories`);
              }}
            >
              {"और भी"}{" "}
              <FaGreaterThan
                style={{
                  marginLeft: "6px",
                }}
              />
            </div> */}
          </div>
          <div id="TopStories" className="main-left-side ">
            <div
              className="main-left-side-top "
              onClick={() => {
                navigation(`/itempage2?newsType=topStories`);
              }}
            >
              <div>{t("ts")}</div>
            </div>
            <div className="top-stories-all-cards ">
              {topStories
                ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((data, index) => {
                  let title = data.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (data.slug) {
                    title = data.slug;
                  }

                  if (title && index < 6) {
                    return (
                      <ShirshCard
                        data={data}
                        key={index}
                        OnPress={() =>
                          navigation(`/details/${title}?id=${data?._id}`)
                        }
                        image={data?.image}
                        wid="w-[45%]"
                        text={data?.title}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              <div
                className="more-text mt-4 "
                style={{ marginRight: "10px" }}
                onClick={() => {
                  navigation(`/itempage2?newsType=topStories`);
                }}
              >
                {"और भी"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="main-news-area webMainPagecomponent homepage-mainwala">
          <div
            id="LatestNews"
            // style={{ backgroundColor: "red" }}
            className="news-main-side-left  flex flex-col pt-3 p-6"
          >
            <div
              className="main-news-heading"
              onClick={() => {
                navigation(`/itempage2?newsType=upload`);
              }}
            >
              {t("ln")}
            </div>
            <div className="news-cards-area container3  w-full">
              {latestNews.slice(0, 6).map((data, index) => {
                let title = data?.title
                  ?.replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (data.slug) {
                  title = data.slug;
                }
                // Check if title is defined before rendering the NewsCard
                if (title) {
                  return (
                    <div className=" w-1/2" key={data?._id}>
                      <NewsCard
                        data={data}
                        onPress={() =>
                          navigation(`/details/${title}?id=${data._id}`)
                        }
                      />
                    </div>
                  );
                } else {
                  // Handle the case where title is undefined or null
                  return null; // or handle it in a way that makes sense for your application
                }
              })}
            </div>
            <div
              className="more-text "
              style={{ marginRight: "40px" }}
              onClick={() => {
                navigation(`/itempage2?newsType=upload`);
              }}
            >
              {"और भी"}{" "}
              <FaGreaterThan
                style={{
                  marginLeft: "6px",
                }}
              />
            </div>
          </div>
          <div className="news-main-side-rigth">
            <div id="BigNews" className="news-main-rigth-part1 ">
              <div
                className="main-news-heading"
                onClick={() => {
                  navigation(`/itempage2?newsType=breakingNews`);
                }}
              >
                {t("bn")}
              </div>
              <div
                className="news-cards-area container3"
              // style={{ backgroundColor: "yellow" }}
              >
                {breakingNews &&
                  breakingNews.length > 2 &&
                  // breakingNews.map((data, index) => {
                  breakingNews.slice(2, 5).map((data, index) => {
                    let title = data?.title
                      ?.replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    // Check if title is defined before rendering the NewsCard
                    // if (title && index > 1 && index < 5) {
                    if (title) {
                      return (
                        <div className="news-card-items-area" key={data?._id}>
                          <NewsCard
                            data={data}
                            onPress={() =>
                              navigation(`/details/${title}?id=${data._id}`)
                            }
                          />
                        </div>
                      );
                    } else {
                      // Handle the case where title is undefined or null
                      // console.error("No title ")
                      return null; // or handle it in a way that makes sense for your application
                    }
                  })}

                {/* {breakingNews.length > 0 &&
                  breakingNews.map((data) => {
                    let title = data?.title
                      ?.replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }
                    return (
                      <div className="news-card-items-area" key={data?._id}>
                        <NewsCard
                          data={data}
                          onPress={() =>
                            navigation(`/details/${title}?id=${data._id}`)
                          }
                        />
                      </div>
                    );
                  })} */}
              </div>
              <div
                className="more-text"
                onClick={() => {
                  navigation(`/itempage2?newsType=breakingNews`);
                }}
              >
                {"और भी"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
            <div className="news-main-rigth-part2">
              {/* {midAd.length > 0 && (
                <div>
                  {midAd?.slice(0, 4).map((midAd) => {
                    return (
                      <a
                        key={midAd._id}
                        href={midAd.link}
                        target="_blank"
                        onClick={() => {
                          onClickAd(midAd._id);
                        }}
                        rel="noreferrer"
                      >
                        <img
                          src={midAd.imgLink}
                          style={{ width: "100%", marginBottom: "10px" }}
                        />
                        <p
                          style={{ fontSize: "16px", fontFamily: "Poppins" }}
                        ></p>
                      </a>
                    );
                  })}
                </div>
              )} */}

              <div className=" w-full ">
                <AdCard type={"mid"} />
              </div>

              <div
                style={{
                  width: "100%",
                  // height: "100%",
                  background: "White",
                  marginTop: 10,
                  borderRadius: 10,
                  padding: 10,
                  paddingBottom: 50,
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: 18,
                    textAlign: "start",
                    fontFamily: "Poppins",
                  }}
                >
                  {currentPoll?.question}
                </div>
                <Radio.Group
                  value={selectedOption}
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  <Row gutter={12}>
                    {pollOptions.map((option, index) => (
                      <Col xs={12} key={index}>
                        <div
                          style={{
                            width: "100%",
                            minHeight: "40px",
                            maxHeight: "60px",
                            overflow: "hidden",
                            borderRadius: 10,
                            border: "1px solid black",
                            marginBottom: 10,
                            alignItems: "center",
                            display: "flex",
                            paddingLeft: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          <Radio
                            onClick={() => {
                              if (selectedOption === null) {
                                setSelectedOption(index);
                                submitVote(currentPoll._id, index);
                              }
                            }}
                            value={index}
                            disabled={selectedOption !== null}
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                marginTop: "-10px",
                              }}
                            >
                              {option.optionText}
                            </div>
                          </Radio>

                          {selectedOption !== null && (
                            <Progress
                              percent={option.percentage.toFixed(0)} // Adjust the decimal places as needed
                              size="small"
                            />
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        <div
          className="all-videos"
          style={{
            backgroundColor: "blue",
            padding: "1rem 2.5rem",
            height: "content-fit",
          }}
        >
          <h1 className="main-page-video-heading2" id="Videos">
            {" "}
            Videos
          </h1>
          <div className="video-containerr ">
            <div className="left-columnn">
              {video.slice(0, 2).map((vdo, index) => {
                return <VdoThumb key={index} data={vdo} />;
              })}
            </div>
            <div className=" w-[1px] bg-white "></div>
            <div className="middle-columnn  flex justify-center items-center">
              <VdoThumb height={true} data={video[2]} />
            </div>
            <div className=" w-[1px] bg-white "></div>
            <div className="right-columnn">
              {video.slice(3, 5).map((vdo, index) => {
                return <VdoThumb key={index} data={vdo} />;
              })}
            </div>
          </div>
          {/* see more btn */}
          <div
            className="-mt-4 sm:mt-[25px] more-text"
            onClick={() => navigate("/itempage2?newsType=videos")}
          >
            {"और भी"}{" "}
            <FaGreaterThan
              style={{
                marginLeft: "6px",
              }}
            />
          </div>
        </div>

        <div className="webMainPagecomponent all-category-data ">
          <AllSectionArticle data={allCategoriesData} priorityArticles={priorityArticles} />
        </div>

        {stories && stories.length > 0 && (
          <div
            id="VisualStories"
            className="visual-stories-main-container container2 container3  webMainPagecomponent"
          >
            <div
              className="main-page-technology-heading"
              onClick={() => {
                navigation(`/story`);
              }}
            >
              {t("vs")}
            </div>

            <div className="main-page-visual-story-Ad-container">
              <div className="main-page-visual-story-container">
                {stories.map((story) => {
                  // console.log("story: ", story);

                  // Find the image with albumPeriority: true
                  const prioritizedImage = story.images.find(
                    (image) => image.albumPeriority === true
                  );
                  // console.log("prioritized: ", prioritizedImage);

                  // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                  const displayImage = prioritizedImage
                    ? prioritizedImage.img
                    : story.images[0]?.img;
                  const displayText = prioritizedImage
                    ? prioritizedImage.text
                    : story.images[0]?.text;

                  return (
                    <a
                      href={`/stories?id=${story._id}`}
                      target="_blank"
                      key={story._id}
                      rel="noreferrer"
                    >
                      <div className="visual-story-card">
                        <ImageCard
                          style={{
                            fontSize: "15px",
                            fontWeight: 400,
                            height: "80px",
                            borderRadius: 0,
                          }}
                          height="300px"
                          width="100"
                          img={displayImage}
                          id={story._id}
                          text={story.title}
                          title={displayText}
                          fromVStrories={true}
                        />
                      </div>
                    </a>
                  );
                })}
              </div>
              <div className="main-page-Ad-container-visualStory">
                {bottomAd && (
                  <a
                    href={bottomAd.link}
                    target="_blank"
                    onClick={() => {
                      onClickAd(bottomAd._id);
                    }}
                    rel="noreferrer"
                  >
                    <img
                      src={bottomAd.imgLink}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                      {/* {bottomAd.slugName} */}
                    </p>
                  </a>
                )}
              </div>
            </div>

            {/* ... (your existing JSX code) */}
          </div>
        )}

        {/* <div
          id="Photos"
          className="main-video-gallery-main-container container2 container3 webMainPagecomponent"
        >
          <div className="main-page-video-heading2">{t("ph")}</div>
          <div className="main-page-photoGallery-container">
            {photo &&
              photo.map((img, index) => {
                // Find the image with albumPeriority: true
                const prioritizedImage = img?.images.find(
                  (image) => image.albumPeriority === true
                );

                // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                const displayImage = prioritizedImage
                  ? prioritizedImage.img
                  : img?.images[0]?.img;

                const displayText = prioritizedImage
                  ? prioritizedImage.text
                  : img?.images[0]?.text;

                return (
                  <div key={index}>
                    <a
                      href={`/photos/${img?._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="photoGallery-card">
                        <img src={displayImage} alt={displayText} />
                      </div>
                    </a>
                    <div
                      className=""
                      style={{
                        // background: "red",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        // marginTop: "0.5rem",
                        alignItems: "center",
                        padding: "0px 3px",
                      }}
                    >
                      <span className="pgt">{img?.title.toUpperCase()}</span>

                      <div className="pgt-r">
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center", // This aligns items vertically
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              lineHeight: "1",
                            }}
                          >
                            <IoCameraSharp />
                          </span>
                          <span style={{ lineHeight: "1" }}>
                            {img?.images?.length < 10
                              ? "0" + img?.images?.length
                              : img?.images?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div> */}
        <div
          id="Photos"
          className="main-video-gallery-main-container container2 container3 webMainPagecomponent"
        >
          <div className="main-page-video-heading2">{t("ph")}</div>
          <div className="main-page-photoGallery-container">
            {photo &&
              [...photo].reverse().map((img, index) => {  // Added [...photo].reverse()
                // Find the image with albumPeriority: true
                const prioritizedImage = img?.images.find(
                  (image) => image.albumPeriority === true
                );

                // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                const displayImage = prioritizedImage
                  ? prioritizedImage.img
                  : img?.images[0]?.img;

                const displayText = prioritizedImage
                  ? prioritizedImage.text
                  : img?.images[0]?.text;

                return (
                  <div key={index}>
                    <a
                      href={`/photos/${img?._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="photoGallery-card">
                        <img src={displayImage} alt={displayText} />
                      </div>
                    </a>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 3px",
                      }}
                    >
                      <span className="pgt">{img?.title.toUpperCase()}</span>
                      <div className="pgt-r">
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              lineHeight: "1",
                            }}
                          >
                            <IoCameraSharp />
                          </span>
                          <span style={{ lineHeight: "1" }}>
                            {img?.images?.length < 10
                              ? "0" + img?.images?.length
                              : img?.images?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
