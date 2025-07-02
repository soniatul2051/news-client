import React, { useState, useRef, useEffect, useContext } from "react";
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
import { render } from "react-dom";
import { OnEdit as onEditContext } from "../../../Context";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const { TextArea } = Input;

const VisualStories = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parses the query string
  const edit = queryParams.get("edit");
  const { onEdit, setOnEdit, id, setId } = useContext(onEditContext);
  const navigation = useNavigate();

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");
  const [editPeriority, setEditPeriority] = useState(false);
  const [allPhotos, setAllPhoto] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState({});
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [editImgs, setEditImgs] = useState([]);
  const [newImgs, setNewImgs] = useState([]);

  const [imgTexts, setImgTexts] = useState({});

  useEffect(() => {
    // console.log(id, "id", edit);
    // console.log(onEdit, "onEdit");
    if (!edit) {
      setId(null);
      setOnEdit(false);
    }
    if (onEdit && edit) {
      axios.get(`${API_URL}/story?id=${id}`).then((item) => {
        let data = item.data[0];
        // console.log("dataedit", data);
        setTitle(data.title);
        setEditImgs(data.images);
        setEditPeriority(
          data?.images.findIndex((img) => img.albumPeriority) // Find the index of the image with albumPeriority true
        );
      });
    }
  }, [onEdit]);

  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/story?${filterItem}=${filterItemResponse}`)
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

  const showVerifyModal = () => {
    setIsVerifyModalOpen(true);
    document.getElementById("preview").innerHTML = photo;
  };

  const handleVerifyCancel = () => {
    setIsVerifyModalOpen(false);
    setOnEdit(false); // Reset onEdit when modal is closed
    setId(null); // Reset ID when modal is closed
  };

  const [thumbnail, setThumbnail] = useState({});
  // console.log("imgTexts,thumbnail : ", imgTexts, thumbnail);

  // Set initial state based on data length
  useEffect(() => {
    const initialState = imgs.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {});
    setThumbnail(initialState);
  }, [imgs]);

  const handleThumbnailChange = (index) => {
    setThumbnail((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false; // Set all to false
        return acc;
      }, {}),
      [index]: true, // Set the selected index to true
    }));
  };

  const handleEditChange = (index) => {
    setEditPeriority(index); // Set the selected index
    // Update the albumPeriority for each image
    setEditImgs((prev) =>
      prev.map((item, i) => ({
        ...item,
        albumPeriority: i === index, // Set true for the selected index, false for others
      }))
    );
  };
  const RemoveImage = (imgUrl) => {
    setEditImgs((prev) => prev.filter((img) => img.img !== imgUrl));
  };

  const onUpload = async () => {
    try {
      setLoading(true);

      // console.log("Images to upload:", imgs);

      // Upload images
      const imageUploadPromises = imgs.map(async (img) => {
        let formData = new FormData();
        formData.append("file", img, img.name);

        // console.log("Uploading image:", img.name);

        const imageResponse = await axios.post(`${API_URL}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // console.log("Image upload response:", imageResponse.data);
        return imageResponse.data.image;
      });

      const images = await Promise.all(imageUploadPromises);
      // console.log("Uploaded images:", images);

      // Create story
      const storyPayload = {
        title,
        image: images,
        albumPeriority: thumbnail,
        imageTexts: imgTexts,
      };

      // console.log("Creating story with payload:", storyPayload);

      const storyResponse = await axios.post(`${API_URL}/story`, storyPayload);
      // console.log("Story creation response:", storyResponse.data);

      message.success("Your Photo was successfully uploaded");
      setTitle("");
      fetchAllPhotos();
      setImgs([]);
      setIsVerifyModalOpen(false);
      setOnEdit(false);
      setId(null);
    } catch (error) {
      console.error("Error in upload process:", error);

      // Handle different error cases
      if (error.response) {
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );
        message.error(
          `Upload failed: ${error.response.data.message || "Server error"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        message.error("Upload failed: No response from server");
      } else {
        console.error("Unexpected error:", error.message);
        message.error("Upload failed: An unexpected error occurred");
      }

      setImgs([]);
      setTitle("");
      setIsVerifyModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    try {
      let imgWithText = [];
      setLoading(true);
      if (imgs.length > 0) {
        // Step 1: Upload Images
        const imageUploadPromises = imgs.map(async (img) => {
          let formData = new FormData();
          formData.append("file", img, img.name);
          // console.log("FormData in edit vs : ", formData);
          const imageResponse = await axios.post(`${API_URL}/image`, formData);
          // console.log("imageREsponse in edit vs : ", imageResponse);
          return imageResponse.data.image;
        });

        const images = await Promise.all(imageUploadPromises);
        // console.log("images in visual stories in edit", images);
        imgWithText = images?.map((img, index) => ({
          img: img,
          text: imgTexts[index],
        }));
        // console.log("imgwithtxt in vs in edit", imgWithText);
        setNewImgs(imgWithText);
      }

      // console.log("imgWithText", editImgs, imgWithText, title);
      // console.log(
      //   "title and editImage and imgwithtxt in vs edit  :",
      //   title,
      //   editImgs,
      //   imgWithText
      // );
      axios
        .put(`${API_URL}/story/${id}`, {
          title: title,
          images: [...editImgs, ...imgWithText],
        })
        .then((res) => {
          // console.log("visual story Edit Response", res);
          message.success("Your Photo was successfully updated");
          setTitle("");
          fetchAllPhotos();
          setLoading(false);
          setEditImgs([]); // Reset to empty array
          setImgs([]);
          setIsVerifyModalOpen(false);
          setOnEdit(false); // Reset after update
          setId(null); // Reset after update

          navigation("/dashboard/stories");
        });
    } catch (error) {
      console.log("error in edit vs:", error);
      message.error("Your Photo was not successfully uploaded");
      setIsVerifyModalOpen(false);
      setTitle("");
      setLoading(false);
      setImgs([]); // Reset to empty array
    }
    setLoading(false);
  };

  // const RemoveImage = (item) => {
  //   setEditImgs(editImgs.filter((img) => img.img !== item));
  // };

  async function fetchAllPhotos() {
    try {
      // Fetch comments from your API
      const response = await fetch(`${API_URL}/story`);
      const data = await response.json();
      // console.log("visual stories res : ", data);
      setAllPhoto(data);
    } catch (error) {
      console.error("Error fetching photo:", error);
      message.error("Failed to fetch photos. Please try again.");
    }
  }

  const ShowDeleteModal = (photo) => {
    // console.log(photo);
    setCurrentPhoto(photo);
    setIsModalDeleteOpen(true);
    setOnEdit(false);
  };

  const OnDelete = () => {
    axios
      .delete(`${API_URL}/story?id=${currentPhoto._id}`)
      .then(() => {
        message.success("Story has Successfully Deleted");
        setCurrentPhoto("");
        fetchAllPhotos();
        setIsModalDeleteOpen(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Story has Not Deleted");
        setCurrentPhoto("");
        setIsModalDeleteOpen(false);
      });
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
    setCurrentPhoto({});
  };

  const handleToggleStatus = (photoId, currentStatus) => {
    const newStatus = currentStatus ? false : true;

    // Make an API call to update the status
    axios
      .put(`${API_URL}/story/${photoId}`, { status: newStatus })
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
      dataIndex: "images", // Assuming 'images' is the property representing the images
      key: "images",
      render: (images) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index} // Key should be on the outermost element inside the map
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                }}
              >
                <img
                  width={100}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "5px",
                  }}
                  src={image?.img}
                />
                <p style={{ height: "40px", textAlign: "center" }}>
                  {image?.text}
                </p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (photo) => {
        // console.log("sssssssssssssssssssssssssssss",user)

        return (
          <Space size="middle">
            <a
              onClick={() => {
                setOnEdit(true);
                setId(photo._id);

                navigation("/dashboard/stories?edit=true");
              }}
            >
              edit
            </a>
            <a
              onClick={() => {
                ShowDeleteModal(photo);
              }}
            >
              Delete
            </a>
          </Space>
        );
      },
    },
    {
      title: "Online / Offline",
      key: "status",
      dataIndex: "status",
      render: (_, story) => {
        return (
          <>
            <Tag color={story.status ? "cyan" : "red"}>
              {story.status ? "ONLINE" : "OFFLINE"}
            </Tag>
            <Button
              type="link"
              onClick={() => handleToggleStatus(story._id, story.status)}
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

  // console.log("imgTexts", imgTexts);

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
        Visual Story
      </h1>
      <div style={{ paddingBottom: "15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <Input
              type="file"
              name="file"
              id="file-name"
              multiple // Allow multiple files
              onChange={(e) => {
                setImgs([...e.target.files]);
              }}
              style={{ display: "none" }}
              hidden={true}
            />
            <div
              onClick={() => {
                document.getElementById("file-name").click();
              }}
              style={{
                minWidth: "100px",
                width: "auto",
                height: "200px",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "10px",
                marginBottom: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  fontSize: "25px",
                  fontWeight: "600",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  color: "rgba(0,0,0,0.5)",
                  textAlign: "center",
                  alignSelf: "center",
                  margin: "auto",
                }}
              >
                {imgs.length === 0
                  ? "Upload images here"
                  : "Upload more images"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                // backgroundColor: "red",
                // padding: "10px",
                flexDirection: "row",
              }}
            >
              {imgs.length > 0 &&
                imgs.map((img, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                    }}
                  >
                    <img
                      key={index}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        alignSelf: "center",
                        margin: "2px",
                      }}
                      src={URL.createObjectURL(img)}
                    />
                    <Input
                      style={{ height: "40px", width: "150px" }}
                      placeholder="Image Text"
                      value={imgTexts[index]}
                      onChange={(e) =>
                        setImgTexts((old) => ({
                          ...old,
                          [index]: e.target.value,
                        }))
                      }
                    />
                    <div
                      style={{
                        color: "black",
                        display: "flex",
                        marginTop: "5px",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <label>
                        <Input
                          type="radio"
                          name="thumbnail"
                          value={index}
                          checked={!!thumbnail[index]}
                          onChange={() => handleThumbnailChange(index)}
                          style={{ width: "30px" }}
                        />
                        Thumbnail{" "}
                      </label>
                    </div>
                  </div>
                ))}
              {/* {console.log("edit images in vs: ", editImgs)} */}
              {editImgs.length > 0 &&
                editImgs.map((img, index) => (
                  <div
                    key={index} // Make sure 'key' is added to the root element in the map function
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                    }}
                  >
                    <FaTrashAlt
                      style={{ marginLeft: "7%", marginBottom: "-10%" }}
                      size={"15"}
                      color="red"
                      onClick={() => RemoveImage(img.img)}
                    />
                    <img
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        alignSelf: "center",
                        margin: "2px",
                      }}
                      src={img.img}
                    />
                    <Input
                      style={{ height: "40px", width: "150px" }}
                      placeholder="Image Text"
                      value={img.text} // Ensure this accesses the correct value from the array
                      onChange={(e) =>
                        setEditImgs((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, text: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <div
                      style={{
                        color: "black",
                        display: "flex",
                        marginTop: "5px",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <label>
                        <input
                          type="radio"
                          name="thumbnail"
                          checked={editPeriority === index}
                          onChange={() => handleEditChange(index)}
                          style={{ marginRight: "5px" }}
                        />
                        Thumbnail
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "2%",
            }}
          >
            <Input
              style={{ height: "40px", width: "300px" }}
              placeholder="Story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{ marginTop: "5%", display: "flex" }}>
              <Button onClick={showVerifyModal} type="primary">
                Preview
              </Button>
            </div>
          </div>
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
        onOk={id && onEdit ? onUpdate : onUpload}
        onCancel={handleVerifyCancel}
        okText={id && onEdit ? "Update" : "Upload"}
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
        title="Delete Photo"
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

export default VisualStories;
