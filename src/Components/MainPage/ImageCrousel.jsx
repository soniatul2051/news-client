import { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { API_URL } from "../../../API";
import { useParams } from "react-router-dom";
import ImageGallery from "../../Module/MainPage/ImageGallery";
import AdCardPopup from "../DetailsPage/AdCardPopup";

const ImageCrousel = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    axios
      .get(`${API_URL}/photo/${id}`)
      .then((response) => {
        setPhoto(response.data.images || []);
        setLoading(false); // Set loading to false when fetching completes
      })
      .catch((error) => {
        console.error(
          "Error fetching images:",
          error.response ? error.response.data : error.message
        );
        setError("There was an error fetching images. Please try again later.");
        setLoading(false); // Set loading to false even on error
      });
  }, [id]);
  const [adPopup, setAdPopup] = useState(false);

  useEffect(() => {
    setAdPopup(true);
  }, [photo]);
  return (
    <div className="ImageCarouselContainer relative ">
      <>
        {/* Ad Popup */}
        {adPopup && (
          <AdCardPopup type={"top"} adPopup={adPopup} setAdPopup={setAdPopup} />
        )}
      </>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div className="w-full bg-white h-full py-4 px-[1.2rem]">
        {/* Show loading text */}
        {loading ? (
          <h3
            style={{
              color: "gray",
              textAlign: "center",
              fontSize: "20px",
              margin: "30px 0",
              padding: "60px 0px",
            }}
          >
            Loading...
          </h3>
        ) : (
          <>
            {/* Phone flex col */}
            <div className="mt-16 mb-6 w-full sm:w-3/4 mx-auto">
              <div className="image-gallery flex flex-col gap-6">
                {photo.length > 0 ? (
                  photo.map((img) => {
                    const handleImageClick = () => {
                      const urlPattern = new RegExp(
                        "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})([\\/\\w\\.-]*)*\\/?$"
                      );
                      const isValidUrl = urlPattern.test(img?.url);
                      const redirectUrl = isValidUrl ? img.url : img.img;

                      window.open(redirectUrl, "_blank");
                    };

                    return (
                      <div
                        key={img._id}
                        className="image-card flex flex-col gap-2 bg-gray-100 p-4 rounded-lg"
                      >
                        <h3
                          className="main-page-video-heading2 text-[16px] sm:text-[24px] md:text-[30px] text-gray-950"
                          style={{
                            borderRadius: "10px",
                            overflow: "hidden",
                            marginBottom: "2px",
                          }}
                        >
                          {img?.text}
                        </h3>
                        <div
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                          className="photoGallery-card-crousel"
                          onClick={handleImageClick}
                        >
                          <img
                            src={img.img || "https://via.placeholder.com/150"}
                            alt={img.text || "Image"}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <h3
                      style={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                        margin: "30px 0",
                      }}
                    >
                      No images available
                    </h3>
                  </div>
                )}
              </div>
            </div>
            <ImageGallery />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCrousel;
