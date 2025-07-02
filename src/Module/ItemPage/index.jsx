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
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import SubCardSection from "../../Components/SharedComponents/SubCardSection";
import RelatedNewsCard from "../../Components/DetailsPage";
import { data } from "autoprefixer";
import StoriesCard from "../../Components/MainPage/StoriesCard";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import AdCard from "../../Components/Global/AdCard";

const ItemPage = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [topStories, settopStories] = useState();
  const [stories, setStories] = useState(null);
  const [bottomAd, setBottomAd] = useState({});

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
        // console.log("api response for visual stories : ", response);
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
  // console.log("i am stand on items2 page");
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
  const query = new URLSearchParams(search);
  const navigation = useNavigate();
  // console.log(query.get("item"));

  // console.log("data in item page  :", Data);

  useEffect(() => {
    setIsLoad(true);
    window.scroll(0, 0);
    setTimeout(() => {
      axios
        // .get(
        //   `${API_URL}/article?category=${query.get("item")}&search=${query.get(
        //     "item"
        //   )}&keyword=${query.get("item")}&pagenation&subCategory=${
        //     query.get("sub") ? query.get("sub") : ""
        //   }`
        // )
        // .then((data) => {
        //   console.log("DATA", data);
        //   setData(data.data);
        //   setIsLoad(false);
        .get(
          `${API_URL}/article?category=${query.get("item")}&search=${query.get(
            "item"
          )}&keyword=${query.get("item")}&pagenation&subCategory=${
            query.get("sub") ? query.get("sub") : ""
          }`
        )
        .then((data) => {
          // console.log("DATA", data);

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
    }, 2000);
  }, [effect, query.get("item"), query.get("sub")]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Calculate total pages
  const totalPages = Math.ceil(Data.length / itemsPerPage);

  // Calculate items for the current page
  const currentItems = Data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle next and previous buttons
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
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
          <Skeleton style={{ marginLeft: 10 }} active={true} />
        </div>
      ))}
    </>
  );
  return (
    <>
      <div className="container2 container3 ">
        <div className="item-page-heading  details-main-related-new-area-heading">
          <div className="w-fit flex items-center gap-1">
            <span>{query?.get("item")} </span>
            <span>
              {query?.get("sub") && <HiOutlineChevronDoubleRight />}
            </span>{" "}
          </div>
          <div>
            {query?.get("sub") && (
              // <span style={{ fontSize: 16 }}>/{query?.get("sub")}</span>
              <div className="-mt-2 text-gray-900">
                <span style={{ fontSize: 16 }}>{query?.get("sub")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="item-page-main-area">
          {/* <div
            style={{ backgroundColor: "red" }}
            className="item-page-main-area-1"
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
                let date = new Date(item.date);
                date = JSON.stringify(date).split("T")[0].split('"')[1];
                let title = item.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (item.slug) {
                  title = item.slug;
                }
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
                        image={item?.image}
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
                        image={item?.image}
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
          </div> */}
          <div
            // style={{ backgroundColor: "red" }}
            className="item-page-main-area-1"
          >
            {isLoad ? (
              <>
                <SkeletonLoader />
              </>
            ) : currentItems.length > 0 ? (
              <>
                {currentItems.map((item, index) => {
                  let date = new Date(item.date);
                  date = JSON.stringify(date).split("T")[0].split('"')[1];
                  let title = item.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (item.slug) {
                    title = item.slug;
                  }
                  return (
                    <div key={index}>
                      <div className="hidden sm:block">
                        <ItemPageCard1
                          onPress={() => {
                            if (item.type === "img") {
                              navigation(`/details/${title}?id=${item._id}`);
                            } else {
                              navigation(`/videos/${title}?id=${item._id}`);
                            }
                          }}
                          title={item?.title}
                          discription={item?.discription}
                          image={item?.image}
                          date={date}
                          type={item.type}
                        />
                      </div>
                      <div className="block sm:hidden">
                        <StoriesCard
                          data={data}
                          OnPress={() => {
                            if (item.type === "img") {
                              navigation(`/details/${title}?id=${item._id}`);
                            } else {
                              navigation(`/videos/${title}?id=${item._id}`);
                            }
                          }}
                          wid="w-[45%] h-[110px]"
                          image={item?.image}
                          text={item?.title}
                          date={date}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Pagination Controls */}
                <div className=" mt-5 flex flex-row justify-center items-center space-x-4">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Pre
                  </button>

                  {/* Page Numbers */}
                  <div className="flex flex-row space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 rounded ${
                          currentPage === index + 1
                            ? "bg-red-500 text-white font-bold"
                            : "bg-gray-300 text-black hover:bg-gray-400"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 50 }}>
                <Empty />
              </div>
            )}
          </div>
          <div className="w-full md:hidden">
            <AdCard type={"mid"} />
          </div>
          <div className="item-page-main-area-2  pt-0 -mt-4 lg:-mt-0">
            {/* <div className="item-page-main-area-2-header-strip">
              <div style={{ marginLeft: 10 }}>{t("rn")}</div>
            </div> */}

            <div className="item-page-main-area-2-news-cards w-full ">
              {/* {topStories && (
                <div className="details-page-related-news">
                  <div className="details-page-related-news-heading">
                    {t("rn")}
                  </div>
                </div>
              )} */}
              {/* <div className="detail-page-relate-new-cards">
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
                        navigation(`/details/${title}?id=${data?._id}`)
                      }
                      wid="w-[45%] h-[110px]"
                      image={data?.image}
                      text={data?.title}
                    />
                  );
                })}
              </div> */}
              <LatesetNewsSection />
            </div>
            {/* <SubCardSection /> */}
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
                  <>
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
                  </>
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
