import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { API_URL } from "../../../API";
import ImageCard from "../../Components/MainPage/ImageCard";

const VisualStories = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/story`)
      .then((data) => {
        setData(data.data);
        // setIsLoad(false);
      })
      .catch((err) => {
        // setIsLoad(false);
        console.log(err);
      });
  }, []);

  return (
    <div className="">
      <div
        id="VisualStories"
        style={{ padding: "0px 10px" }}
        className="visual-stories-main-container container2 container3"
      >
        <div className="mobileMainPageHeading">{t("vs")}</div>

        <div className="main-page-visual-story-Ad-container ">
          <div className="main-page-visual-story-container vsfw">
            {data.map((story) => {
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
  );
};

export default VisualStories;
