import { useEffect, useState } from "react";
import TopHeaderImg from "../../assets/TopHeader-img.svg";
import "./style/index.css";
import logo from "../../assets/Logo-new.PNG";
import { MdArrowDropDown } from "react-icons/md";
import { BiSolidSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import { LanguageSelect, Loading } from "../../Context";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../API";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Dropdown, Input, Select } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import MobileHeader from "./MobileHeader";
import { Option } from "antd/es/mentions";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HomeOutlined } from "@ant-design/icons";

const Header = () => {
  const [isHamBurger, setIsHamBurger] = useState(false);
  const [itsItem, setItsItem] = useState([]);
  const [AllcatgeoryData, setAllcatgeoryData] = useState([]);
  const [itsItem2, setItsItem2] = useState([]);
  const { lang, setLang } = useContext(LanguageSelect);
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const { t, i18n } = useTranslation();
  const [topAd, setTopAd] = useState({});
  const [search, setSearch] = useState(false);
  const [displayMore, setDisplayMore] = useState(false);
  const Navigation = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const categoryResponse = await axios.get(`${API_URL}/content?type=category`);
        const sortedData = categoryResponse.data?.sort((a, b) => {
          const seqA = a.sequence !== undefined ? a.sequence : Number.MAX_VALUE;
          const seqB = b.sequence !== undefined ? b.sequence : Number.MAX_VALUE;
          return seqA - seqB;
        }) || [];
  
        // Split into main items and overflow items
        const mainItems = sortedData.slice(0, 11);
        const extraItems = sortedData.slice(11);
  
        setItsItem(mainItems);
        setItsItem2(sortedData.map((item) => ({ value: item.text })));
  
        // Fetch subcategories for all categories
        const subcategoryMap = {};
        await Promise.all(
          sortedData.map(async (category) => {
            try {
              const res = await axios.get(`${API_URL}/subcategory?category=${category.text}`);
              subcategoryMap[category.text] = res.data.map((element) => ({
                key: element._id,
                label: (
                  <a
                    onClick={() => {
                      Navigation(`/itempage?item=${element.category}&sub=${element.text}`);
                      setEffect((prev) => !prev);
                    }}
                  >
                    {element.text}
                  </a>
                ),
              }));
            } catch (err) {
              subcategoryMap[category.text] = [];
              console.error("Failed to fetch subcategories for:", category.text, err);
            }
          })
        );
        setSubcategories(subcategoryMap);
  
        // Build "Display More" dropdown items
        const dynamicExtraItems = extraItems.map((item) => {
          const subItems = subcategoryMap[item.text] || [];
  
          return {
            key: item._id,
            label: subItems.length > 0 ? (
              <Dropdown
                menu={{ items: subItems }}
                placement="bottomLeft"
                arrow
              >
                <a
                  onClick={() => {
                    Navigation(`/itempage?item=${item.text}`);
                    setEffect((prev) => !prev);
                  }}
                  className="flex items-center"
                >
                  {item.text}
                  <MdArrowDropDown size={20} className="ml-1" />
                </a>
              </Dropdown>
            ) : (
              <a
                onClick={() => {
                  Navigation(`/itempage?item=${item.text}`);
                  setEffect((prev) => !prev);
                }}
              >
                {item.text}
              </a>
            ),
          };
        });
  
        setAllcatgeoryData(dynamicExtraItems);
  
        setLoading(false);
      } catch (err) {
        console.error("Error loading categories:", err);
        setLoading(false);
      }
    };
  
    fetchData();
  
    // Fetch top ad separately
    axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
      const activeAds = data.data.filter((data) => data.active);
      const topAdData = activeAds.filter((data) => data.device === "laptop");
      setTopAd(topAdData.reverse()[0]);
    });
  }, []);  

  useEffect(() => {
    if (topAd && topAd._id) {
      axios.get(`${API_URL}/ads/click?id=${topAd._id}`).then(() => {});
    }
  }, [topAd]);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  const [subcategories, setSubcategories] = useState({});

  useEffect(() => {
    const fetchSubcategories = async () => {
      const newSubcategories = {};
      for (const category of itsItem) {
        try {
          const response = await axios.get(
            `${API_URL}/subcategory?category=${category.text}`
          );
          newSubcategories[category.text] = response.data.map((element) => ({
            key: element._id,
            label: (
              <a
                target="_blank"
                onClick={() => {
                  Navigation(
                    `/itempage?item=${element.category}&sub=${element.text}`
                  );
                  setEffect(!effect);
                }}
              >
                {element.text}
              </a>
            ),
          }));
        } catch (error) {
          console.error("Error fetching subcategories: ", error);
          newSubcategories[category.text] = [];
        }
      }
      setSubcategories(newSubcategories);
    };

    if (itsItem.length > 0) {
      fetchSubcategories();
    }
  }, [itsItem, API_URL, setEffect, effect]);

  // console.log("its items : ", itsItem);
  return (
    <>
      <MobileHeader listitem={AllcatgeoryData} />

      {loading ? null : (
        <div className="header-main-area">
          {topAd && (
            <div className="">
              {/* <IoCloseCircleOutline
                onClick={() => setShowAd(false)}
                className="text-3xl md:text-5xl top-0 right-0 bg-gray-800 text-white rounded-full absolute"
              /> */}
              <a
                href={topAd?.link}
                target="_blank"
                onClick={() => {
                  onClickAd(topAd._id);
                }}
                rel="noreferrer"
              >
                <img
                  style={{
                    cursor: "pointer",
                    padding: "2px",
                  }}
                  className="top-header-img"
                  src={topAd?.imgLink}
                  alt=""
                />
                {/* top ad will show here */}
              </a>
              {/* <img src={TopHeaderImg} alt="" " /> */}
              {/* <select
                name="language"
                id=""
                style={{ width: 100, position: "absolute", right: 10, top: 10 }}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                }}
              >
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select> */}
            </div>
          )}

          <div className="header-contianer">
            <div
              onClick={() => Navigation("/")}
              style={{
                cursor: "pointer",
              }}
              className="header-logo-box"
            >
              <img src={logo} alt="" />
            </div>
            <div className="header-row-box">
              <ul
                style={{ flexWrap: "wrap" }}
                className="header-row-box-items "
              >
                <li
                  className="mr-2 flex gap-1 items-center"
                  onClick={() => {
                    Navigation(`/`);
                    setEffect(!effect);
                  }}
                >
                  <span>
                    <HomeOutlined />
                  </span>
                  <span>होम</span>
                </li>
                {
                  <>
                    {itsItem.length > 0 &&
                      itsItem.map((data) => (
                        <Dropdown
                          key={data._id}
                          menu={{
                            items: subcategories[data.text] || [],
                          }}
                          placement="bottom"
                          arrow
                        >
                          <li
                            onClick={() => {
                              Navigation(`/itempage?item=${data.text}`);
                              setEffect(!effect);
                            }}
                          >
                            {data.text} <MdArrowDropDown size={20} />
                          </li>
                        </Dropdown>
                      ))}
                  </>
                }
                <li onClick={() => Navigation("/live")}>{t("h14")}</li>

                {AllcatgeoryData.length > 0 && (
                  <Dropdown
                    menu={{
                      items: AllcatgeoryData,
                    }}
                    placement="bottom"
                    arrow
                  >
                    <li className="">
                      Display More <MdArrowDropDown size={20} />
                    </li>
                  </Dropdown>
                )}
                <li>
                  <BiSolidSearch
                    onClick={() => {
                      setSearch(true);
                    }}
                    size={30}
                    color="white"
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                </li>
              </ul>
              <GiHamburgerMenu
                className="ham-burger"
                size={30}
                color="white"
                onClick={() => setIsHamBurger(true)}
              />
            </div>
          </div>
          <div
            className={`ham-burger-area `}
            style={{ display: isHamBurger ? "block" : "none" }}
          >
            <div className="header-row2-icons">
              <BiSolidSearch size={30} color="white" />
              <RxCross1
                size={30}
                color="white"
                onClick={() => setIsHamBurger(false)}
                className="ham-burger-area-cross-child"
              />
            </div>
            <ul className="header-row-box-items2">
              {itsItem.length > 0 &&
                itsItem.map((data) => {
                  return (
                    <li
                      key={data._id}
                      onClick={() => {
                        setIsHamBurger(false);
                        Navigation(`/itempage?item=${data.text}`);
                        setEffect(!effect);
                      }}
                    >
                      {data.text} <MdArrowDropDown size={20} />
                    </li>
                  );
                })}
              <li>
                {t("key")} <MdArrowDropDown size={30} />
              </li>
            </ul>
          </div>
        </div>
      )}
      {search ? (
        <div
          onClick={() => {
            // setSearch(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",

            position: "absolute",
            zIndex: 9999,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Babloo Kannojia Maharajganj UP */}
          <div
            style={{
              width: "100%",
              // height: "100%",
              // backgroundColor: "red",
              padding: "10px",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                // backgroundColor: "yellow",
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <AutoComplete
                style={{
                  width: "70%",
                  marginTop: 88,
                  // marginLeft: 180,
                }}
                options={itsItem2}
                // placeholder="try to type `b`"
                filterOption={(inputValue, option) =>
                  option.value
                    ?.toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                <Input.Search
                  autoFocus
                  size="large"
                  placeholder="Search"
                  enterButton
                  onSearch={(e) => {
                    Navigation(`itempage?item=${e}`);
                    setSearch(false);
                  }}
                />
              </AutoComplete>
              <div style={{}}>
                <IoIosCloseCircle
                  onClick={() => setSearch(false)}
                  size={55}
                  style={{
                    // backgroundColor: "red",
                    padding: "10px",
                    marginLeft: 20,
                    // marginTop: 10,
                    marginTop: 79,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
