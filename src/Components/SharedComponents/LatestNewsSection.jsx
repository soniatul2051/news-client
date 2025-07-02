import { useTranslation } from "react-i18next";
import DetailsVideoCard from "../DetailsPage/VideoCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../API";
import StoriesCard from "../MainPage/StoriesCard";
import { useNavigate } from "react-router-dom";

function LatesetNewsSection({ currentVideoId }) {
  const { t } = useTranslation();
  const [sliderArticles, setSliderArticles] = useState([]);
  const [topStories, setTopStories] = useState([]); // Initialize state as an empty array
  // console.log("top stories : ", topStories);
  useEffect(() => {
    fetchLatestVidData();
  }, []);

  async function fetchSliderArticles() {
    try {
      const response = await axios.get(
        `${API_URL}/article?pagenation=true&limit=8&type=img&status=online&slider=true`
      );

      // console.log("slider articles nk", response.data);

      // Filter to ensure only articles with status 'online'
      const onlineArticles = response?.data.filter(
        (article) => article.status === "online"
      );

      // Set the filtered data
      setSliderArticles(onlineArticles);
    } catch (error) {
      console.error("Error fetching slider articles:", error);
    }
  }
  const navigation = useNavigate();
  async function fetchLatestVidData() {
    try {
      const response = await axios.get(
        `${API_URL}/article?pagenation=true&limit=10&type=img&newsType=topStories&status=online&priority=true`
      );

      // console.log("response topstorieee: ", response);
      // Filter out articles that are already present in sliderArticles
      const uniqueTopStories = response.data.filter(
        (article) =>
          !sliderArticles?.data?.some(
            (sliderArticle) => sliderArticle._id === article._id
          )
      );

      // console.log("Top stories:", response.data, uniqueTopStories);
      setTopStories(uniqueTopStories); // Correct state setter (consistent camelCase)
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  }
  return (
    <>
      {topStories && (
        <div className="details-page-latest-news">
          <div className="details-main-related-new-area-heading">{t("ts")}</div>

          <div className="top-stories-all-cards">
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

                if (title && index < 5) {
                  return (
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
                } else {
                  return null;
                }
              })}
          </div>
        </div>
      )}
    </>
  );
}
export default LatesetNewsSection;
