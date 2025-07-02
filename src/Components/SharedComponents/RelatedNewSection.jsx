import { useTranslation } from "react-i18next";
import DetailsNewsCard from "../DetailsPage/NewsCard";
import { useEffect, useState } from "react";
import { API_URL } from "../../../API";
import axios from "axios";

function RelatedNewsSection({ currentNewId }) {
  const { t } = useTranslation();

  const [relatedNews, setRelatedNews] = useState();
  useEffect(() => {
    fetchrelatedNews();
  }, []);

  async function fetchrelatedNews() {
    const response = await axios.get(
      `${API_URL}/article?pagenation=true&limit=4&type=img&newsType=breakingNews&status=online`
    );
    const data = response.data;
    setRelatedNews(data);
  }
  return (
    <>
      {relatedNews && (
        <div className="details-main-related-new-area">
          <div className="details-main-related-new-area-heading">{t("rn")}</div>
          <div className="details-main-related-new-area-cards">
            {relatedNews?.map((relNews, index) => {
              if (!currentNewId) {
                if (index > 2) return;
                return <DetailsNewsCard key={relNews._id} data={relNews} />;
              } else {
                if (relNews._id === currentNewId) return;
                return <DetailsNewsCard key={relNews._id} data={relNews} />;
              }
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default RelatedNewsSection;
