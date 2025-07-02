import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import axios from "axios";
import { API_URL } from "../../../../API";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const { TextArea } = Input;

const Video = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const [photo, setPhoto] = useState("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");

  const [allPhotos, setAllPhoto] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState({}); //while deleting
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [reported, setreported] = useState("");
  // state for edit functionality
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const showEditModal = (video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingVideo(null);
  };

  // custom vdo upload dropdown
  const [dropdownUp, setDropdownUp] = useState(false);

  const handleDropdown = () => {
    setDropdownUp(!dropdownUp);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/video/${editingVideo._id}`, {
        title: editingVideo.title,
        link: editingVideo.link,
      });

      if (response.status === 200) {
        message.success("Video updated successfully");
        setIsEditModalOpen(false);
        fetchAllPhotos(); // Refresh the video list
        setIsVerifyModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating video:", error);
      message.error("Failed to update video");
    }
  };

  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/video?${filterItem}=${filterItemResponse}`)
      .then((poll) => {
        setAllPhoto(poll.data);
        // console.log(poll.data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Error in Filtering");
      });
  };
  const onReset = () => {
    setfilterItem("");
    setfilterItemResponse("");
    fetchAllPhotos();
  };

  useEffect(() => {
    fetchAllPhotos();
  }, []);
  // console.log("reportedby jn : ", reported);
  const showVerifyModal = () => {
    setIsVerifyModalOpen(true);
    document.getElementById("preview").innerHTML = photo;
  };

  const handleVerifyCancel = () => {
    setIsVerifyModalOpen(false);
  };
  useEffect(() => {
    if (img) {
      // If img is not null, create a new object URL for the file
      const objectURL = URL.createObjectURL(img);
      // Set the src attribute of the video element to the new object URL
      const videoSource = document.getElementById("video-element");
      videoSource.src = objectURL;
      // Force the video element to reload the new source
      videoSource.load();
    }
  }, [img]); // Run this effect whenever img changes

  const onUpload = async () => {
    try {
      setLoading(true);
      // Step 1: Upload Image
      let imageResponse = "";

      if (img) {
        let formData = new FormData();
        formData.append("file", img, img.name);
        // console.log("formData", formData);
        imageResponse = await axios.post(`${API_URL}/image`, formData);
      }

      // Step 2: Create Story
      const storyResponse = await axios.post(`${API_URL}/video`, {
        title,
        image: img ? imageResponse.data.image : "",
        link: link,
        reportedBy: "user",
      });

      // Additional logic if needed after successful upload
      message.success("Your Video was successfully uploaded");
      setIsVerifyModalOpen(false);
      fetchAllPhotos();
      setTitle("");
      setLoading(false);
      setImg(null);
      setLink(null);
      // setreported("");
      if (img) {
        document.getElementById("video-element").src = "";
      }
    } catch (error) {
      message.error("Your Video was not successfully uploaded");
      // Handle error
      setTitle("");
      setLoading(false);
      setImg(null);
      // setreported("");
      setIsVerifyModalOpen(false);
    }
    setLoading(false);
    setIsVerifyModalOpen(false);
  };

  async function fetchAllPhotos() {
    try {
      // Fetch comments from your API
      const response = await fetch(`${API_URL}/video`);
      const data = await response.json();
      // console.log("get all vdo res  : ", data);
      setAllPhoto(data);
    } catch (error) {
      console.error("Error fetching video:", error);
      message.error("Failed to fetch video. Please try again.");
    }
  }
  // console.log("all vdos in page : ", allPhotos);
  const ShowDeleteModal = (photo) => {
    // console.log(photo);
    setCurrentPhoto(photo);
    setIsModalDeleteOpen(true);
  };
  const OnDelete = () => {
    axios
      .delete(`${API_URL}/video?id=${currentPhoto._id}`)
      .then(() => {
        message.success("video has Successfully Deleted");
        setCurrentPhoto("");
        setIsModalDeleteOpen(false);
        setIsVerifyModalOpen(false);
        fetchAllPhotos();
      })
      .catch((err) => {
        console.log(err);
        message.error("video has Not Deleted");
        setCurrentPhoto("");
        setIsModalDeleteOpen(false);
      });
  };
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
    setCurrentPhoto({});
  };

  // Columns configuration for Ant Design Table
  const columns = [
    {
      title: "ID",
      dataIndex: "_id", // Assuming 'likes' is the property representing the likes
      key: "_id",
      render: (title) => {
        return (
          <div
            style={{
              width: "70px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
        );
      },
    },
    {
      title: "title",
      dataIndex: "title", // Assuming 'text' is the property representing the comment
      key: "title",
      render: (text) => {
        // console.log("text", text);
        return (
          <div
            style={{
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <a>{text.substring(0, 45) + "..."}</a>
          </div>
        );
      },
    },
    {
      title: "Image",
      dataIndex: "image", // Assuming 'likes' is the property representing the likes
      key: "image",
      render: (_, { image }) => {
        // console.log(image);

        return image ? (
          <video
            width={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            src={image}
          />
        ) : (
          <div></div>
        );
      },
    },
    {
      title: "link",
      dataIndex: "link",
      key: "link",
      render: (_, { link }) => {
        // console.log("yt vdo link in video section : ", link);

        // Function to extract video ID from various YouTube URL formats
        const extractVideoId = (url) => {
          const regex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?/\s]{11})/;
          const match = url?.match(regex);
          return match ? match[1] : null;
        };

        // Function to check if the link is already in embed format
        const isEmbedLink = (url) => {
          return url?.includes("youtube.com/embed/");
        };

        // Function to check if the link is a live stream link
        const isLiveLink = (url) => {
          return url?.includes("youtube.com/live/");
        };

        // If it's already an embed link, use it directly
        let embedLink = link;

        if (!isEmbedLink(link)) {
          const videoId = extractVideoId(link);

          if (videoId) {
            // If it's a live link, construct the embed URL for live videos
            if (isLiveLink(link)) {
              embedLink = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else {
              // Otherwise, it's a normal YouTube video, use the standard embed link
              embedLink = `https://www.youtube.com/embed/${videoId}`;
            }
          }
        }

        // Placeholder image when video is unavailable or live stream fails
        const unavailableThumbnail =
          "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145";

        // If no valid video ID is found, display a message or fallback thumbnail
        return embedLink ? (
          <>
            <iframe
              className="video"
              title="Youtube player"
              src={embedLink}
              width={"200px"}
              height={"100px"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onError={(e) => {
                e.target.style.display = "none"; // Hide the iframe if the video is unavailable
                e.target.nextElementSibling.style.display = "block"; // Show the placeholder thumbnail
              }}
            ></iframe>
            <img
              src={unavailableThumbnail}
              alt="Live stream unavailable"
              style={{ display: "none", width: "200px", height: "100px" }}
            />
          </>
        ) : (
          <div>
            <img
              src={unavailableThumbnail}
              alt="Default placeholder for unavailable video"
              width={"200px"}
              height={"100px"}
            />
            <div>No valid video link</div>
          </div>
        );
      },
    },

    {
      title: "Actions",
      key: "action",
      render: (photo) => (
        <Space size="middle">
          <a onClick={() => showEditModal(photo)}>Edit</a>
          <a
            onClick={() => {
              ShowDeleteModal(photo);
            }}
          >
            Delete
          </a>
          {/* {isAdmin ? (
            <a onClick={() => ShowReportedModal(user)}>Report Article</a>
          ) : (
            <></>
          )} */}
        </Space>
      ),
    },
    {
      title: "Online / Offline",
      key: "status",
      dataIndex: "status",
      render: (_, video) => {
        return (
          <>
            <Tag color={video.status ? "cyan" : "red"}>
              {video.status ? "ONLINE" : "OFFLINE"}
            </Tag>
            <Button
              type="link"
              onClick={() => handleToggleStatus(video._id, video.status)}
              style={{ padding: "auto 0px", margin: "10px 0px" }}
            >
              Change Status
            </Button>
          </>
        );
      },
    },
  ];
  function placeHolderString() {
    if (filterItem === "id") return "Id";
    if (filterItem === "title") return "Title";
  }

  const handleToggleStatus = (videoID, currentStatus) => {
    const newStatus = currentStatus ? false : true;

    // Make an API call to update the status
    axios
      .put(`${API_URL}/video/${videoID}`, { status: newStatus })
      .then(() => {
        // Handle success
        message.success(`Status  Changed `);
        fetchAllPhotos();
        // Refresh the article data
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating status", error);
        message.error("Failed to update  status");
      });
  };

  return (
    <>
      {loading ? (
        <p style={{ backgroundColor: "red" }}>Please wait ....</p>
      ) : null}
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        Video
      </h1>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <button
              style={{
                width: "content-fit",
                padding: "3px 6px",
                borderRadius: "10px",
                fontSize: "1.2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                marginBottom: "10px",
                border: "1px solid gray",
                marginRight: "10px",
              }}
            >
              <span onClick={handleDropdown}>Upload Custom Video</span>
              {dropdownUp ? (
                <IoMdArrowDropup
                  onClick={handleDropdown}
                  style={{ fontSize: "2.7rem" }}
                />
              ) : (
                <IoMdArrowDropdown
                  onClick={handleDropdown}
                  style={{ fontSize: "2.7rem" }}
                />
              )}
            </button>
            <div>
              {dropdownUp ? (
                <div>
                  <Input
                    type="file"
                    name="file"
                    id="file-name"
                    onChange={(e) => {
                      setImg(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                    hidden={true}
                  />
                  <div
                    onClick={() => {
                      document.getElementById("file-name").click();
                    }}
                    style={{
                      width: "auto",
                      height: "100px",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      marginBottom: 10,
                    }}
                  >
                    {img == null ? (
                      <div
                        style={{
                          height: "100%",
                          fontSize: "25px",
                          fontWeight: "600",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          color: "rgba(0,0,0,0.5)",
                        }}
                      >
                        Upload video here
                      </div>
                    ) : (
                      <video
                        id="video-element"
                        src=""
                        style={{
                          width: "auto",
                          height: "200px",
                          borderRadius: "10px",
                        }}
                      />
                      // <img
                      //   style={{
                      //     width: "auto",
                      //     height: "200px",
                      //     borderRadius: "10px",
                      //   }}
                      //   src={URL.createObjectURL(img)}
                      // />
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              // justifyContent: "space-evenly",
            }}
          >
            <Input
              style={{ height: "40px", width: "300px" }}
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              style={{ height: "40px", width: "300px", marginTop: "5%" }}
              placeholder="Video link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <div>
              {/* <Select
                placeholder="Reported By"
                value={reported ? reported : null}
                onChange={(e) => setreported(e)}
                style={{ height: "40px", width: "300px", marginTop: "5%" }}
                options={[
                  {
                    value: "LOKSATYA.AGENCIES",
                    label: "LOKSATYA.AGENCIES",
                  },
                  {
                    value: "PTI",
                    label: "PTI",
                  },
                  {
                    value: "UNIVARTI",
                    label: "UNIVARTI",
                  },
                  {
                    value: "BHASHA",
                    label: "BHASHA",
                  },
                ]}
              /> */}
            </div>

            <div
              style={{
                display: "flex",

                marginBottom: "5%",
                height: "40px",
                width: "300px",
                marginTop: "5%",
              }}
            >
              <Button onClick={showVerifyModal} type="primary">
                Preview
              </Button>
            </div>
          </div>

          <div id="dd"></div>
        </div>
      </div>
      <Row gutter={20}>
        <Col span={6}>
          <Select
            value={filterItem}
            style={{ width: "100%" }}
            defaultValue="id"
            onChange={(e) => setfilterItem(e)}
            options={[
              {
                value: "id",
                label: "By Id",
              },
              {
                value: "title",
                label: "By title",
              },
            ]}
          />
        </Col>
        <Col span={6}>
          <Input
            value={filterItemResponse}
            onChange={(e) => setfilterItemResponse(e.target.value)}
            placeholder={placeHolderString()}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={onFilter}>
            Filter
          </Button>
        </Col>
        <Col span={2}>
          <Button
            type="primary"
            style={{ backgroundColor: "red" }}
            onClick={onReset}
          >
            Reset
          </Button>
        </Col>
      </Row>
      <Table columns={columns} scroll={{ x: 500 }} dataSource={allPhotos} />
      <Modal
        title="Article Modal"
        visible={isVerifyModalOpen}
        onOk={onUpload}
        onCancel={handleVerifyCancel}
        okText="Upload"
      >
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          Headline:
        </h3>
        <div style={{ fontSize: 16, fontWeight: "400", color: "#5e5e5e" }}>
          {title}
        </div>
        <div id="preview" style={{ marginLeft: 20 }}></div>
      </Modal>
      <Modal
        title="Edit Video"
        visible={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        okText="Save"
      >
        <Input
          style={{ marginBottom: 16 }}
          value={editingVideo?.title}
          onChange={(e) =>
            setEditingVideo({ ...editingVideo, title: e.target.value })
          }
          placeholder="Video title"
        />
        <Input
          value={editingVideo?.link}
          onChange={(e) =>
            setEditingVideo({ ...editingVideo, link: e.target.value })
          }
          placeholder="Video link"
        />
      </Modal>
      <Modal
        title="Delete Video"
        open={isModalDeleteOpen}
        onOk={OnDelete}
        onCancel={handleDeleteCancel}
        okText="Yes"
      >
        <div
          style={{
            margin: "20px 0",
            textAlign: "center",
            color: "red",
            fontSize: 30,
            fontWeight: "700",
          }}
        >
          Are You Sure
        </div>
      </Modal>
    </>
  );
};

export default Video;
