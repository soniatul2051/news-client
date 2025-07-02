import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import axios from "axios";
import { OnEdit } from "../../Context";
import { API_URL } from "../../../API";
import { RiAdminFill } from "react-icons/ri";
import { BiRadioCircleMarked } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { MdOutlineArticle } from "react-icons/md";
import { FaRegWindowRestore } from "react-icons/fa";
import { LiaAdSolid } from "react-icons/lia";
import { AiOutlineComment } from "react-icons/ai";
import { CgPoll } from "react-icons/cg";
import { MdUploadFile, MdOutlineCreateNewFolder } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa6";
import { RiLiveLine, RiArticleFill, RiAdvertisementFill } from "react-icons/ri";
import { MdAutoStories, MdDashboard, MdCloudUpload } from "react-icons/md";
import { IoMdPhotos, IoMdVideocam } from "react-icons/io";
import { BiSolidReport, BiSolidCategoryAlt } from "react-icons/bi";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";
import { TiNews } from "react-icons/ti";
// Placeholder components for each route

const YourTopStoriesIconComponent = () => (
  <>
    <FaRegWindowRestore size={20} />
  </>
);
const YourBreakingNewsIconComponent = () => (
  <>
    <FaRegNewspaper size={20} />
  </>
);

const YourCommentIconComponent = () => (
  <>
    <AiOutlineComment size={25} />
  </>
);
const YourLiveIconComponent = () => (
  <>
    <RiLiveLine size={25} />
  </>
);
const YourPollIconComponent = () => (
  <>
    <CgPoll size={25} />
  </>
);

const SideBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState("");
  const [access, setAccess] = useState([]);
  const { setOnEdit } = useContext(OnEdit);
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`${API_URL}/user?id=${localStorage.getItem("id")}`)
      .then((user) => {
        setRole(user.data[0].role);
        setAccess(user?.data[0]?.acsses);
        if (user.data[0].role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [location]);

  const routeLabels = {
    dashboard: "Dashboard",
    articles: "Articles",
    users: "Users",
    topstories: "Top Stories",
    breakingnews: "Breaking News",
    upload: "Upload",
    creatuser: "Create User",
    content: "Tags&Category",
    ads: "Advertisement",
    comment: "Comments",
    live: "Live",
    poll: "Poll",
    flashnews: "Flash News",
    stories: "Visual Stories",
    photos: "Photos",
    videos: "Videos",
    report: "Report",
    newsletter: "News Letter",
  };

  const desiredOrder = [
    "dashboard",
    "articles",
    "users",
    "topstories",
    "breakingnews",
    "upload",
    "creatuser",
    "flashnews",
    "content",
    "ads",
    "comment",
    "live",
    "poll",
    "stories",
    "photos",
    "videos",
    "report",
    "newsletter",
  ];

  // const sortedAccess = access.filter((route) => desiredOrder.includes(route));
  const sortedAccess = access.sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });
  const renderMenuItem = (key, route, to, icon) => {
    return (
      <Menu.Item
        key={key}
        icon={icon}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          style={{
            textTransform: "uppercase",
            fontSize: 14,
            fontWeight: "600",
            fontFamily: "Poppins",
            textAlign: "center",
            marginTop: "5px",
          }}
          to={to}
        >
          {routeLabels[route] || route}
        </Link>
      </Menu.Item>
    );
  };

  return (
    <Menu theme="dark" mode="inline" style={{ padding: "20px 0" }}>
      {sortedAccess.map((route, index) => {
        let icon;
        switch (route) {
          case "dashboard":
            icon = <MdDashboard size={25} />;
            break;
          case "users":
            icon = <FaUsers size={20} />;
            break;
          case "topstories":
            icon = <YourTopStoriesIconComponent />;
            break;
          case "breakingnews":
            icon = <YourBreakingNewsIconComponent />;
            break;
          case "upload":
            icon = <MdCloudUpload size={25} />;
            break;
          case "creatuser":
            icon = <FaUserPlus size={20} />;
            break;
          case "flashnews":
            icon = <GiNewspaper size={25} />;
            break;
          case "content":
            icon = <BiSolidCategoryAlt size={25} />;
            break;
          case "ads":
            icon = <RiAdvertisementFill size={25} />;
            break;
          case "comment":
            icon = <YourCommentIconComponent />;
            break;
          case "live":
            icon = <YourLiveIconComponent />;
            break;
          case "poll":
            icon = <YourPollIconComponent />;
            break;
          case "Articles":
            icon = <RiArticleFill />;
            break;
          case "stories":
            icon = <MdAutoStories size={25} />;
            break;
          case "photos":
            icon = <IoMdPhotos size={25} />;
            break;

          case "videos":
            icon = <IoMdVideocam size={25} />;
            break;

          case "report":
            icon = <BiSolidReport size={25} />;
            break;
          case "newsletter":
            icon = <TiNews size={25} />;
            break;
          default:
            icon = <BiSolidReport size={25} />;
            break;
        }

        return renderMenuItem(index, route, `/dashboard/${route}`, icon);
      })}

      <Menu.Item
        // style={{
        //   position: "absolute",
        //   bottom: 40,
        // }}
        onClick={() => {
          localStorage.clear();
        }}
        key="four"
        icon={<CiLogout size={25} />}
      >
        <Link
          style={{ fontSize: 14, fontWeight: "600", fontFamily: "Poppins" }}
          to="/"
        >
          LogOut
        </Link>
      </Menu.Item>
      <Menu.Item key="ten" icon={<RiAdminFill size={22} />}>
        <div
          style={{
            textTransform: "uppercase",
            fontSize: 14,
            fontWeight: "600",
            fontFamily: "Poppins",
          }}
        >
          {role}
        </div>
      </Menu.Item>
    </Menu>
  );
};

export default SideBar;
