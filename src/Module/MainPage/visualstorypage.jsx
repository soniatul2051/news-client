import { useEffect, useState } from "react";
import VisualStories from "./visualStory";
import axios from "axios";
import { API_URL } from "../../../API";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import { t } from "i18next";
import RelatedNewsCard from "../../Components/DetailsPage";
import AdCard from "../../Components/Global/AdCard";

const VisualStoryPage = () => {
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

  return (
    <div style={{ marginTop: "80px" }}>
      <VisualStories />
      <div className="w-full md:hidden mt-5">
        <AdCard type={"mid"} />
      </div>
      <div className="pl-2">
        <div className="container-detail-page-rigth-side">
          <LatesetNewsSection />
        </div>
      </div>
    </div>
  );
};
export default VisualStoryPage;
