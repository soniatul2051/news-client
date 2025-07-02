import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCameraSharp,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { API_URL } from "../../../API";

const ImageGallery = () => {
  const scrollContainerRef = useRef(null);
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  axios
    .get(`${API_URL}/photo`)
    .then((data) => {
      setData(data.data);
      // setIsLoad(false);
    })
    .catch((err) => {
      // setIsLoad(false);
      console.log(err);
    });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -190, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 190, behavior: "smooth" });
    }
  };
  return (
    <div
      id="Photos"
      className="main-video-gallery-main-container container2 container3"
      style={{ position: "relative" }}
    >
      <div className="main-page-video-heading2">{t("ph")}</div>

      {/* Arrow buttons for scrolling */}
      <div
        style={{
          width: "92%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          position: "absolute",
          top: "320px",
        }}
        className="scrollinggallery"
      >
        <button
          onClick={scrollLeft}
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
          onClick={scrollRight}
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
        ref={scrollContainerRef}
        className="main-page-photoGallery-container"
        style={{ display: "flex", overflowX: "auto", gap: "20px" }}
      >
        {data &&
          data.map((img, index) => {
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
  );
};

export default ImageGallery;
