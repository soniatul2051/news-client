import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainPage from "./Module/MainPage";
import Header from "./Components/Global/Header";
import Footer from "./Components/Global/Footer";
import DetailsPage from "./Module/DetailsPage";
import VideoPage from "./Module/VideoPage";
import { Login } from "./Module/Registartion/Login";
import Signup from "./Module/Registartion/Signup";
import OtpVerify from "./Module/Registartion/OtpVerify";
import AdminLayout from "./Module/Admin/LayOut";
import axios from "axios";
import { useState } from "react";
import ForgotPassword from "./Module/Registartion/ForgotPassword";
import NewPassword from "./Module/Registartion/NewPassword";
import { LanguageSelect, Loading, OnEdit } from "./Context";
import ItemPage from "./Module/ItemPage";
import DetailsPage2 from "./Module/DetailsPage/Details2";
import VideoPage2 from "./Module/VideoPage/Video2";
import LivePage from "./Module/VideoPage/Live";
import VideoPage3 from "./Module/VideoPage/Video3";
import ReactGa from "react-ga";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { API_URL } from "../API";
import WebStory from "./Components/MainPage/WebStory";
import ImageCrousel from "./Components/MainPage/ImageCrousel";
import ItemPageCatSub from "./Module/ItemPage/itemPageCatSubCat";
import Gallerypage from "./Module/MainPage/Gallerypage";
import VisualStoryPage from "./Module/MainPage/visualstorypage";
import ProtectedRoute from "./Protected Routes";
import MenuBelowSlider from "./Components/Global/MenuBelowSlider";
const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState("ur");
  const [loading, setLoading] = useState(false);
  const [effect, setEffect] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      axios
        .get(`${API_URL}/user?id=${userId}`)
        .then((user) => {
          // If the user role is not 'user', mark as admin
          if (user.data[0].role !== "user") {
            setIsAdmin(true);
          }
        })
        .catch((err) => {
          console.error("Error fetching user data: ", err);
          // Optional: Redirect user to login page if there is an issue
        });
    }
  }, [location]);

  ReactGa.initialize("G-1CES7BYV2Q");

  return (
    <Loading.Provider value={{ loading, setLoading, effect, setEffect }}>
      <LanguageSelect.Provider value={{ lang, setLang }}>
        <OnEdit.Provider value={{ onEdit, setOnEdit, id, setId }}>
          <>
            {location.pathname.split("/")[1] == "dashboard" ||
            location.pathname.split("/")[1] == "stories" ? (
              <></>
            ) : (
              <>
                <Header />
                <MenuBelowSlider />
              </>
            )}

            <Routes>
              {/* <Route path="/mobile" element={<MoblieHeader />} /> */}
              <Route
                index
                element={
                  loading ? (
                    <div
                      style={{
                        width: "100vw",
                        height: "100vh",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Spin
                        indicator={
                          <>
                            <LoadingOutlined
                              color="rgba(255, 14, 14, 1)"
                              style={{
                                fontSize: 40,
                                color: "rgba(255, 14, 14, 1)",
                              }}
                              spin
                            />
                          </>
                        }
                      />
                    </div>
                  ) : (
                    <MainPage />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/stories" element={<WebStory />} />
              <Route path="/photos/:id" element={<ImageCrousel />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verfication/:id" element={<OtpVerify />} />
              <Route
                path="/details/:title"
                element={
                  loading ? (
                    <div
                      style={{
                        width: "100vw",
                        height: "100vh",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Spin
                        indicator={
                          <>
                            <LoadingOutlined
                              color="rgba(255, 14, 14, 1)"
                              style={{
                                fontSize: 40,
                                color: "rgba(255, 14, 14, 1)",
                              }}
                              spin
                            />
                          </>
                        }
                      />
                    </div>
                  ) : (
                    <DetailsPage />
                  )
                }
              />
              <Route path="/details2/*" element={<DetailsPage2 />} />
              <Route path="/itempage" element={<ItemPage />} />
              <Route path="/itempage2" element={<ItemPageCatSub />} />
              {/* <Route path="/itempage2" element={<ItemPage2 />} /> */}
              <Route path="/videos2/:id" element={<VideoPage />} />
              <Route path="/videos/:id" element={<VideoPage2 />} />
              <Route path="/videos3" element={<VideoPage3 />} />
              <Route path="/photos" element={<Gallerypage />} />
              <Route path="/story" element={<VisualStoryPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/newPassword" element={<NewPassword />} />
              {/* <Route
                path="/dashboard/*"
                // element={<ProtectedRoute isAdmin={isAdmin} />}
                element={<ProtectedRoute />}
              /> */}
              {/* <Route element={<ProtectedRoute/>}>
              <Route path="/dashboard/*" element={<AdminLayout />} />
              </Route> */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute isAdmin={isAdmin}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />{" "}
              <Route path="*" element={<>Not found</>} />
            </Routes>
            {location.pathname.split("/")[1] == "dashboard" ||
            location.pathname.split("/")[1] == "stories" ? (
              <></>
            ) : (
              <Footer />
            )}
          </>
        </OnEdit.Provider>
      </LanguageSelect.Provider>
    </Loading.Provider>
  );
};

export default App;
