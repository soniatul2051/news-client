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
  Switch,
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

const Photos = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parses the query string
  const edit = queryParams.get("edit");
  const { onEdit, setOnEdit, id, setId } = useContext(onEditContext);
  const navigation = useNavigate();
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [priority, setPriority] = useState(false);
  const [editPriority, setEditPriority] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");

  const [allPhotos, setAllPhoto] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState({}); //while deleting
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [imgTexts, setImgTexts] = useState({});
  const [imgUrl, setImgUrl] = useState({});

  const [loading, setLoading] = useState(false);
  // const [img, setImg] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [editImgs, setEditImgs] = useState([]);
  const [editPeriority, setEditPeriority] = useState(false);
  const [newImgs, setNewImgs] = useState([]);
  // console.log("editImgs : ", editImgs);
  useEffect(() => {
    // setSlug(createSlug(title));
    // console.log(id, "id");
    // console.log(onEdit, "onEdit");
    if (!edit) {
      setId(null);
      setOnEdit(false);
    }
    if (onEdit && edit) {
      axios.get(`${API_URL}/photo?id=${id}`).then((item) => {
        let data = item.data[0];
        // console.log("dataedit", data);
        setTitle(data.title);
        setEditImgs(data?.images);
        setEditPriority(data?.periority);
        setEditPeriority(
          data?.images.findIndex((img) => img.albumPeriority) // Find the index of the image with albumPeriority true
        );
      });
    }
  }, [onEdit]);

  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/photo?${filterItem}=${filterItemResponse}`)
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
  };

  const [thumbnail, setThumbnail] = useState({});
  // console.log("imgUrl,imgTexts,thumbnail : ", imgUrl, imgTexts, thumbnail);

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
      // Step 1: Upload Image
      // let formData = new FormData();
      // formData.append("file", img, img.name);
      // console.log("formData", formData);

      // const imageResponse = await axios.post(`${API_URL}/image`, formData);

      // Step 1: Upload Images
      const imageUploadPromises = imgs.map(async (img) => {
        let formData = new FormData();
        formData.append("file", img, img.name);
        const imageResponse = await axios.post(`${API_URL}/image`, formData);
        return imageResponse.data.image;
      });
      const images = await Promise.all(imageUploadPromises);
      // console.log("uploaded images", images);

      // // Step 2: Create Story
      // const storyResponse = await axios.post(`${API_URL}/photo`, {
      //   title,
      //   image: imageResponse.data.image,
      // });
      // Step 2: Create Story
      // console.log("title,priotity : ", title, priority);
      const storyResponse = await axios.post(`${API_URL}/photo`, {
        title,
        image: images, // Store array of image URLs
        imageTexts: imgTexts,
        url: imgUrl,
        albumPeriority: thumbnail,
        periority: priority,
      });

      // console.log("story upload res : ", storyResponse);
      message.success("Your Photo was successfully uploaded");
      setIsVerifyModalOpen(false);
      fetchAllPhotos();
      setPriority(false);
      setTitle("");
      setLoading(false);
      setImgs([]);
      setOnEdit(false); // Reset after upload
      setId(null); // Reset to empty array
    } catch (error) {
      //   message.error("Your Photo was not successfully uploaded");
      //   // Handle error
      //   setTitle("");
      //   setLoading(false);
      //   setImg(null);
      // }
      // setLoading(false);
      message.error("Your Photo was not successfully uploaded");
      // Handle error
      // setIsVerifyModalOpen(false);
      setTitle("");
      setLoading(false);
      setImgs([]); // Reset to empty array
    }
    setLoading(false);
  };

  const onUpdate = async () => {
    try {
      let imgWithText = [];
      setLoading(true);

      if (imgs?.length > 0) {
        // Step 1: Upload Images
        const imageUploadPromises = imgs.map(async (img) => {
          let formData = new FormData();
          formData.append("file", img, img.name);
          // console.log("formdata in edit photos: ", formData);

          // Upload each image and get the response
          const imageResponse = await axios.post(`${API_URL}/image`, formData);
          // console.log("imageResponse in edit photos: ", imageResponse);
          return imageResponse.data.image; // Return the uploaded image URL
        });

        // Wait for all image uploads to finish
        const images = await Promise.all(imageUploadPromises);
        // console.log("images in Photos in edit:", images);

        // Combine the uploaded images with their corresponding texts and URLs
        imgWithText = images?.map((img, index) => ({
          img: img,
          text: imgTexts[index],
          url: imgUrl[index],
        }));
        // console.log("imgWithText in Photos in edit:", imgWithText);
        setNewImgs(imgWithText); // Set the new images with text
      }

      // Step 2: Update Story
      // console.log(
      //   "imgWithText:",
      //   imgWithText,
      //   "title:",
      //   title,
      //   "editPhoto:",
      //   editPhoto
      // );

      // Send the update request with the new images and capture the response
      const res = await axios.put(`${API_URL}/photo/${id}`, {
        title: title,
        periority: editPriority,
        images: [...editImgs, ...imgWithText], // Merge existing and new images
      });

      // console.log("Photos Edit Response", res); // Now you can log the response
      message.success("Your Photo was successfully updated");
      setIsVerifyModalOpen(false);
      fetchAllPhotos();
      setTitle("");
      setLoading(false);
      setPriority(false);
      setEditImgs([]); // Reset to empty array
      setImgs([]);
      setOnEdit(false); // Reset after upload
      setId(null); // Reset to empty array
      navigation("/dashboard/photos");
    } catch (error) {
      console.log("error in edit image:", error);
      message.error("Your Photo was not successfully uploaded");
      // Handle error
      setTitle("");
      setLoading(false);
      setImgs([]); // Reset to empty array
    }
    setLoading(false); // Ensure loading is false at the end
  };

  // console.log("priority : ", priority);

  // .then((res) => {
  //   console.log("storyEditResponse", res);
  //   // Additional logic if needed after successful upload
  //   message.success("Your Photo was successfully updated");
  //   setTitle("");
  //   setEditPhoto("");
  //   setImg(null);
  //   setLoading(false);
  //   setIsVerifyModalOpen(false);
  //   navigation("/dashboard/photos");
  // });
  // }, 2000);
  //   } catch (error) {
  //     message.error("Your Photo was not successfully uploaded");
  //     // Handle error
  //     setTitle("");
  //     setEditPhoto("");
  //     setImg(null);
  //     setLoading(false);
  //   }
  //   setLoading(false);
  // };

  async function fetchAllPhotos() {
    try {
      // Fetch comments from your API
      const response = await fetch(`${API_URL}/photo`);
      const data = await response.json();
      // console.log("images from res : ", data);
      setAllPhoto(data);
    } catch (error) {
      console.error("Error fetching photo:", error);
      message.error("Failed to fetch photos. Please try again.");
    }
  }

  const handleToggleStatus = (photoId, currentStatus) => {
    const newStatus = currentStatus ? false : true;

    // Make an API call to update the status
    axios
      .put(`${API_URL}/photo/${photoId}`, { status: newStatus })
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

  const ShowDeleteModal = (photo) => {
    // console.log(photo);
    setCurrentPhoto(photo);
    setIsModalDeleteOpen(true);
  };
  const OnDelete = () => {
    axios
      .delete(`${API_URL}/photo?id=${currentPhoto._id}`)
      .then(() => {
        message.success("Photo has Successfully Deleted");

        setCurrentPhoto("");
        setIsModalDeleteOpen(false);
        fetchAllPhotos();
      })
      .catch((err) => {
        console.log(err);
        message.error("Photo has Not Deleted");
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
      dataIndex: "images", // Assuming 'likes' is the property representing the likes
      key: "images",
      // render: (_, { images }) => {
      render: (images) => {
        // console.log("image in image section : ", images);
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              // width: "500px",
            }}
          >
            {images.map((image, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "10px",
                }}
              >
                <img
                  key={index}
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

        // return (
        //   <>
        //     <img
        //       width={100}
        //       style={{
        //         width: "100px",
        //         height: "100px",
        //       }}
        //       src={image}
        //     />
        //   </>
        // );
      },
    },

    {
      title: "Actions",
      key: "action",
      render: (photo) => (
        <Space size="middle">
          <a
            onClick={() => {
              setOnEdit(true);
              setId(photo._id);

              navigation("/dashboard/photos?edit=true");
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
      render: (_, photo) => {
        return (
          <>
            <Tag color={photo.status ? "cyan" : "red"}>
              {photo.status ? "ONLINE" : "OFFLINE"}
            </Tag>
            <Button
              type="link"
              onClick={() => handleToggleStatus(photo._id, photo.status)}
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
        Photos
      </h1>
      <div style={{ paddingBottom: "15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {/* {editPhoto ? (
            <>
              <img
                style={{
                  width: "auto",
                  height: "200px",
                  borderRadius: "10px",
                }}
                src={editPhoto}
              />
              <FaTrashAlt
                // style={{ marginLeft: "7%", marginBottom: "-10%" }}
                size={"15"}
                color="red"
                onClick={() => setEditPhoto(null)}
              />
            </>
          ) : ( */}
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
                {imgs?.length === 0
                  ? "Upload images here"
                  : "Upload more images"}
              </div>
              {/* {img == null ? (
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
                    Upload image here
                  </div>
                ) : (
                  <img
                    style={{
                      width: "auto",
                      height: "200px",
                      borderRadius: "10px",
                    }}
                    src={URL.createObjectURL(img)}
                  />
                )} */}
            </div>
            <div
              style={{
                display: "flex",
                // backgroundColor: "red",
                // padding: "10px",
                flexDirection: "row",
              }}
            >
              {imgs?.length > 0 &&
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
                    <Input
                      style={{ height: "40px", width: "150px" }}
                      placeholder="Image Link"
                      value={imgUrl[index]}
                      onChange={(e) =>
                        setImgUrl((old) => ({
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
                        Thumbnail
                      </label>
                    </div>
                  </div>
                ))}
              {/* {console.log("edit images in photos : ", editImgs)} */}
              {editImgs?.length > 0 &&
                editImgs.map((img, index) => (
                  <div
                    key={index}
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
                      value={img.text}
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
                    <Input
                      style={{ height: "40px", width: "150px" }}
                      placeholder="Image Link"
                      value={img.url}
                      onChange={(e) =>
                        setEditImgs((prev) =>
                          prev.map((item, i) =>
                            i === index
                              ? { ...item, url: e.target.value }
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
          {/* )} */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "2%",
            }}
          >
            <Input
              style={{ height: "40px", width: "300px" }}
              placeholder="Photo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {edit ? (
              <div
                style={{
                  marginTop: "5%",
                  display: "flex",
                  // background: "red",
                  color: "black",
                  gap: "5px",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <span>priority</span>
                <Switch
                  size="small"
                  style={{ marginLeft: 5 }}
                  // value={priority}
                  checked={editPriority}
                  defaultChecked={editPriority}
                  onChange={(e) => {
                    setEditPriority(e);
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  marginTop: "5%",
                  display: "flex",
                  // background: "red",
                  color: "black",
                  gap: "5px",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <span>priority</span>
                <Switch
                  size="small"
                  style={{ marginLeft: 5 }}
                  // value={priority}
                  checked={priority}
                  defaultChecked={priority}
                  onChange={(e) => {
                    setPriority(e);
                  }}
                />
              </div>
            )}

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
        okButtonProps={{ disabled: loading }}
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

export default Photos;
