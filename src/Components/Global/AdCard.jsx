import { useEffect, useState } from "react";
// import img from "../../assets/Rectangle 73.png";
import "./style/index.css";
import axios from "axios";
import { API_URL } from "../../../API";

const AdCard = ({ type }) => {
  const [data, setData] = useState();
  const [laptopAd, setLaptopAd] = useState();
  const [mobileAd, setMobileAd] = useState();
  // console.log("ad data : ", data);

  useEffect(() => {
    if (laptopAd && laptopAd._id) {
      axios.get(`${API_URL}/ads/click?id=${laptopAd._id}`).then(() => {});
    }
    if (mobileAd && mobileAd._id) {
      axios.get(`${API_URL}/ads/click?id=${mobileAd._id}`).then(() => {});
    }
  }, [mobileAd, laptopAd]);

  useEffect(() => {
    if (type === "mid") {
      axios.get(`${API_URL}/ads?active=true&side=mid`).then((data) => {
        const activeAds = data.data.filter((data) => data.active);
        const mobAd = activeAds.filter((data) => data.device == "mobile");
        const lapAd = activeAds.filter((data) => data.device == "laptop");
        // console.log("mobad and lapad : ", mobAd, lapAd);
        setLaptopAd(lapAd.reverse()[0]);
        setMobileAd(mobAd.reverse()[0]);
      });
    } else if (type === "bottom") {
      axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
        const activeAds = data.data.filter((data) => data.active);
        const mobAd = activeAds.filter((data) => data.device == "mobile");
        const lapAd = activeAds.filter((data) => data.device == "laptop");
        // console.log("mobad and lapad : ", mobAd, lapAd);
        setLaptopAd(lapAd.reverse()[0]);
        setMobileAd(mobAd.reverse()[0]);
      });
    }
  }, []);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  return (
    <div>
      {/* Mobile Ad */}
      {mobileAd && (
        <div className="border block md:hidden border-gray-600 sm:border-none  overflow-hidden mx-2">
          {mobileAd ? (
            <a href={mobileAd?.link}>
              <div className="text-gray-600 flex w-full justify-center items-center text-xs">
                advertisement
              </div>
              <div
                className="ad-card-main-area"
                target="_blank"
                onClick={() => {
                  onClickAd(mobileAd._id);
                }}
              >
                <img src={mobileAd?.imgLink} alt="" className="h-full" />
                <div className="ad-card-main-area-text">
                  {mobileAd
                    ? mobileAd.slugName
                    : "New Health Campaign, ‘Ayushman Bhava’ To Reach Out..."}
                </div>
              </div>
            </a>
          ) : null}
        </div>
      )}

      {/* Laptop Ad */}
      {laptopAd && (
        <div className="border hidden md:block border-gray-600 sm:border-none  overflow-hidden mx-2">
          {laptopAd ? (
            <a href={laptopAd?.link}>
              <div className="text-gray-600 flex w-full justify-center items-center text-xs">
                advertisement
              </div>
              <div
                className="ad-card-main-area"
                target="_blank"
                onClick={() => {
                  onClickAd(laptopAd._id);
                }}
              >
                <img src={laptopAd?.imgLink} alt="" className="h-full" />
                <div className="ad-card-main-area-text">
                  {laptopAd
                    ? laptopAd.slugName
                    : "New Health Campaign, ‘Ayushman Bhava’ To Reach Out..."}
                </div>
              </div>
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdCard;
