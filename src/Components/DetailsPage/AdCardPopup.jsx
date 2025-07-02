import { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./style/index.css";
import { API_URL } from "../../../API";
import { useLocation } from "react-router-dom";

const AdCardPopup = ({ type, adPopup, setAdPopup }) => {
  const [mobileData, setMobileData] = useState();
  const [laptopData, setLaptopData] = useState();
  // console.log("mobila popup and laptop : ", mobileData, laptopData);
  useEffect(() => {
    if (mobileData && mobileData._id) {
      axios.get(`${API_URL}/ads/click?id=${mobileData._id}`).then(() => {});
    }
    if (laptopData && laptopData._id) {
      axios.get(`${API_URL}/ads/click?id=${laptopData._id}`).then(() => {});
    }
  }, [mobileData, laptopData]);

  useEffect(() => {
    axios
      .get(`${API_URL}/ads`)
      .then((response) => {
        // console.log("ads in popup : ", response);

        const activeAds = response.data.filter((data) => data.active);
        // console.log("active ads in popup: ", activeAds);

        // Reverse data array to ensure latest entries come first
        const reversedData = activeAds.reverse();
        const popupAds = reversedData.filter((data) => data.side == "popup");
        // console.log("reverse active data popup ads : ", popupAds);
        // Find the latest entry for mobile and laptop devices
        const latestMobileData = popupAds.find((ad) => ad.device === "mobile");
        const latestLaptopData = popupAds.find((ad) => ad.device === "laptop");

        // Set states with the latest data
        setMobileData(latestMobileData);
        setLaptopData(latestLaptopData);
      })
      .catch((error) => {
        console.error("Error fetching ads data:", error);
      });
  }, []);
  // console.log("mobile data : ", mobileData);
  // console.log("laptop data : ", laptopData);
  async function onClickAd(id) {
    try {
      await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  const location = useLocation();
  return (
    <div className="relative z-[3000]">
      {/* Display only mobile ad */}

      {mobileData && (
        <div className={`adCardPopup `}>
          <div
            className="fixed px-2 md:hidden lg:px-0 top-0 left-0 w-full h-full flex items-center justify-center z-50 inset-0 bg-black bg-opacity-40 backdrop-blur-sm "
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full ${
                location.pathname === "/" ? "mt-28" : ""
              }  h-[70vh] flex md:hidden  lg:h-[500px]   lg:w-[800px] overflow-hidden bg-white rounded-md`}
            >
              <div className="h-full w-full">
                <div className=" w-full flex mt-2 font-semibold  justify-center items-center text-lg text-black">
                  Advertisement
                </div>

                <button
                  onClick={() => setAdPopup(false)}
                  className="absolute top-2 right-0  rounded-full"
                >
                  <IoCloseCircleOutline className="text-3xl md:text-6xl" />
                </button>
                {mobileData ? (
                  <a href={mobileData?.link} className="h-full w-full">
                    <div
                      className="w-full h-full"
                      onClick={() => onClickAd(mobileData._id)}
                    >
                      <img
                        className="object-cover h-full w-full"
                        src={mobileData?.imgLink}
                        alt=""
                      />
                    </div>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display only desktop ad */}
      {laptopData && (
        <div
          className={`adCardPopup ${location.pathname === "/" ? "mt-28" : ""}`}
        >
          <div
            className="fixed px-2 md:flex hidden lg:px-0 top-0 left-0 w-full h-full  items-center justify-center z-50 inset-0 bg-black bg-opacity-40 backdrop-blur-sm "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] hidden md:flex  lg:h-[500px]   lg:w-[800px] overflow-hidden bg-white rounded-md">
              <div className="h-full w-full">
                <div className=" w-full flex mt-2 font-semibold  justify-center items-center text-lg text-black">
                  Advertisement
                </div>

                <button
                  onClick={() => setAdPopup(false)}
                  className="absolute top-2 right-0  rounded-full"
                >
                  <IoCloseCircleOutline className="text-3xl md:text-6xl" />
                </button>
                {laptopData ? (
                  <a href={laptopData?.link} className="h-full">
                    <div
                      className="w-full h-full"
                      onClick={() => onClickAd(laptopData._id)}
                    >
                      <img
                        className="object-cover h-full  w-full"
                        src={laptopData?.imgLink}
                        alt=""
                      />
                    </div>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdCardPopup;
