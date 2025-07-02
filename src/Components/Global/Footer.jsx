import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import axios from "axios";

import "./style/index.css";
import logo from "../../assets/Logo-new-bg.png";
import { API_URL } from "../../../API";
import { Loading } from "../../Context";
import MobileFooter from "./AccordinList";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import SocialMediaContainer from "../common/SocialFooterContainer";

const Footer = () => {
  const { t } = useTranslation();
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const [itsItem, setItsItem] = useState([]);
  const [email, setEmail] = useState();
  const Navigation = useNavigate();
  const [mainObject, setMainObject] = useState({});

  // console.log("main objects footer category", mainObject);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/content?type=category`)
      .then((response) => {
        // const categories = response.data.slice(0, 5); // Only take the first 5 categories
        const categories = response?.data; // Only take the first 5 categories
        setItsItem(categories);
        const tempMainObject = {};
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );
        Promise.all(requests)
          .then((subcategoriesResponses) => {
            subcategoriesResponses.forEach((subcategoriesResponse, index) => {
              const categoryName = categories[index].text;
              // const subcategories = subcategoriesResponse.data.slice(0, 5); // Only take the first 5 subcategories
              const subcategories = subcategoriesResponse?.data; // Only take the first 5 subcategories
              tempMainObject[categoryName] = subcategories;
            });
            setMainObject(tempMainObject);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching subcategories:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  async function subscribeToNewsLetter() {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        message.error("Invalid email address");
        return; // Exit the function if the email is not valid
      }

      // Send a POST request to the backend
      const response = await axios.post(`${API_URL}/newsletter`, { email });
      console.log("newsletter res : ", response);
      if (response.status === 201) {
        message.success("Subcribed to News Letter");
        // alert(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter : ", error);
      message.error(error.response.data.message);
    }
  }

  return (
    !loading && (
      <div className="footer-main-container  py-0">
        <div className="footer-area-main-accordin">
          <MobileFooter />
        </div>
        <div className="footer-checkup-main-conatiner">
          <div
            className="footer-main mt-0"
            style={{
              // backgroundColor: "red",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "5px",
              flexWrap: "wrap",
              padding: "20px",
            }}
          >
            {Object.entries(mainObject).map(
              ([categoryName, subcategories], index) => (
                <div
                  key={index}
                  className="footer-item-box"
                  style={{
                    // backgroundColor: "yellow",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {/* Category Header */}
                  <div
                    className="footer-heading flex gap-2 items-center"
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                      // marginBottom: "10px",
                    }}
                    onClick={() => navigate(`/itempage?item=${categoryName}`)}
                  >
                    <span>{categoryName}</span>
                    <span>
                      <HiOutlineChevronDoubleRight className="text-lg" />
                    </span>
                  </div>

                  {/* Subcategories */}
                  <div className="footer-items pl-2 flex gap-2">
                    {subcategories.map((item, index) => (
                      <Link
                        key={index}
                        to={`/itempage?item=${categoryName}&sub=${item.text}`}
                        className="atag "
                      >
                        <div
                          className={`subtitle  text-sm text-gray-400 my-1 w-fit py-0 pr-3 ${
                            subcategories.length > 1 &&
                            index !== subcategories.length - 1
                              ? "border-r"
                              : ""
                          }`}
                        >
                          {item.text}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="footer-line mt-0 "></div>
        <div className="footer-middle-container">
          <div className="footer-middle-area">
            <div className="footer-img flex-col">
              <img src={logo} alt="" className="footer-img" />
              <SocialMediaContainer />
            </div>
            <div className="footer-middle-right ">
              <div className="footer-middle-right-heading">{t("list")}</div>
              <div className="footer-middle-right-text">
                Stay updated with our weekly newsletter, delivered to your
                inbox. Don't miss out on any updates, stories or events around
                the world.
              </div>
              <div
                style={{
                  display: "flex",
                }}
                className="footer-last-bottom"
              >
                <input
                  type="text"
                  className="footer-input"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <div
                  className="footer-input-button"
                  onClick={() => {
                    subscribeToNewsLetter();
                  }}
                >
                  Subscribe Now
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-line"></div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">Copyright @2025 Loksatya News</div>
          <div className="footer-bottom-text">All Rights Reserved | Designed: <a href="https://helptogethergroup.com" target="_blank">Help Together Group</a>
          <span className="developer d-none">Development by- Babloo Kannojia</span></div>
        </div>
      </div>
    )
  );
};

export default Footer;
