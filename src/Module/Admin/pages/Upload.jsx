import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  message,
} from "antd";
import axios from "axios";
import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import JoditEditor from "jodit-react";
import { OnEdit as onEditContext } from "../../../Context";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../../API";
const { TextArea } = Input;
const Upload = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parses the query string
  const edit = queryParams.get("edit");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [Topic, setTopic] = useState("");
  const [desc, setdesc] = useState("");
  const [reported, setreported] = useState("");
  const [publish, setpublish] = useState("");
  const [type, setType] = useState("img");
  // const [Language, setLanguage] = useState("English");
  const [Language, setLanguage] = useState("Hindi");
  const [newType, setNewType] = useState("upload");
  const [keyword, setKeyword] = useState([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [dataImage, setdataImage] = useState(null);
  const [options, setOptions] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryData, setSubCategoryData] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [role, setRole] = useState("");
  const [usercategoryData, setuserCategoryData] = useState([]);
  const [admincategoryData, setadminCategoryData] = useState([]);
  const { onEdit, setOnEdit, id } = useContext(onEditContext);
  const [Update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState(false);
  const [priority, setPriority] = useState(false);
  const [slider, setSlider] = useState(false);
  const navigation = useNavigate();
  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");

  const inputRef = useRef(null);
  // const onNameChange = (event) => {
  //   setName(event.target.value);
  // };
  // console.log("tag name : ", name);
  // Handle input change for new tag
  const onNameChange = (e) => {
    setName(e.target.value);
  };

  // const addItem = (e) => {
  //   e.preventDefault();
  //   setOptions([...options, { value: name, label: name, key: name }]);
  //   setName("");
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 0);
  // };

  const addItem = async () => {
    // Check if the input is not empty
    if (!name.trim()) {
      message.warning("Please enter a tag.");
      return;
    }

    try {
      // Here you should call your API to save the new tag
      const response = await axios.post(
        `${API_URL}/content?id=${localStorage.getItem("id")}`,
        {
          type: "tag",
          text: name,
        }
      );

      // console.log("Tag added successfully:", response);

      // Update the options with the new tag received from the API
      const newTag = {
        value: response.data.text, // Assuming API returns the created tag object
        label: response.data.text,
        key: response.data._id, // Assuming the API returns an ID for the tag
      };

      // Update local state with the new tag
      setOptions((prevOptions) => [...prevOptions, newTag]);
      setKeyword((prevKeywords) => [...prevKeywords, newTag.value]);

      // Clear the input field
      setName("");
      inputRef.current.focus(); // Focus back on the input field

      // Success message
      message.success("Tag added successfully!");
    } catch (error) {
      console.error("Error adding tag:", error);
      message.error("Failed to add tag.");
    }
  };
  const categoryOptions = categoryData.map((items) => ({
    label: items.text,
    value: items.text,
  }));
  // console.log(categoryOptions);

  const userCategoryOptions = usercategoryData.map((item) => ({
    label: item,
    value: item,
  }));

  console.log(
    "form data in upload article : ",
    title,
    desc,
    "topic is  :",
    Topic,
    keyword,
    Language,
    reported,
    publish,
    newType,
    // image: image.data.image,
    type,
    subCategory,
    slug,
    comment,
    priority,
    slider
  );
  useEffect(() => {
    // setSlug(createSlug(title));
    // console.log(id, "id");
    // console.log(onEdit, "onEdit");
    if (!edit) {
      setOnEdit(false);
    }
    if (onEdit && edit) {
      axios.get(`${API_URL}/article?id=${id}`).then((item) => {
        let data = item.data[0];
        console.log("upload data", data);
        setTitle(data.title);
        setTopic(data.topic);
        setdesc(data.discription);
        setKeyword(data.keyWord);
        setImg(data.image);
        setSubCategory(data.subCategory);
        setSlug(data.slug);
        setComment(data.comment);
        setPriority(data.priority);
        setSlider(data.slider);
        // setdataImage(data.image);
        setLanguage(data?.language);
        setpublish(data?.publishBy);
        setreported(data?.reportedBy);
        setNewType(data?.newsType);
        setType(data?.type);
      });
    }
    axios
      .get(`${API_URL}/content?type=tag`)
      .then((content) => {
        let arr = [];
        for (let i = 0; i < content.data.length; i++) {
          const element = content.data[i];
          arr.push({
            key: element._id,
            value: element.text,
            label: element.text,
          });
        }
        setOptions(arr);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${API_URL}/content?type=category`)
      .then((content) => {
        let arr = [];
        for (let i = 0; i < content.data.length; i++) {
          const element = content.data[i];
          arr.push({
            key: element._id,
            value: element.text,
            label: element.text,
          });
        }
        // let values = arr.map((item) => item?.label);
        setCategoryData(arr);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${API_URL}/user?id=${localStorage.getItem("id")}`)
      .then((user) => {
        setpublish(user.data[0].email);
        setRole(user.data[0].role);
        setuserCategoryData(user.data[0].selectedKeywords || []);
        // console.log("usercategoryData", usercategoryData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [onEdit, useState]);

  useEffect(() => {
    axios
      .get(`${API_URL}/subcategory?category=${Topic}`)
      .then((content) => {
        let arr = [];
        for (let i = 0; i < content.data.length; i++) {
          const element = content.data[i];
          arr.push({
            key: element._id,
            value: element.text,
            label: element.text,
          });
        }
        setSubCategoryData(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [Topic]);


  // Custom Add Babloo Kannojia 
  const loadTwitterScript = () => {
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };
  useEffect(() => {
    loadTwitterScript();
  }, [desc]);

  function createSlug(title) {
    return title
      .toLowerCase() // Convert the title to lowercase
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w-]+/g, "") // Remove non-word characters except dashes
      .replace(/^-+/, "") // Remove leading dashes
      .replace(/-+$/, ""); // Remove trailing dashes
  }

  let tempSlug = slug; // Copy the initial slug value

  tempSlug = tempSlug
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w-]+/g, "") // Remove non-word characters except dashes
    .replace(/^-+/, "") // Remove leading dashes
    .replace(/-+$/, ""); // Remove trailing dashes

  useEffect(() => {
    if (tempSlug) {
      setSlug(tempSlug);
    }
  }, [tempSlug]);
  console.log("slug value : ", slug); // Original slug (unchanged)
  console.log("temp slug: ", tempSlug); // Transformed slug

  const showVerifyModal = () => {
    if (!img) {
      message.warning("Please upload an image.");
    } else if (!title.trim()) {
      message.warning("Please enter a title.");
    } else if (!desc.trim()) {
      message.warning("Please enter a description.");
    } else if (!Topic) {
      message.warning("Please select a category.");
    } else if (!keyword || keyword.length === 0) {
      message.warning("Please enter at least one tag.");
    } else if (!Language) {
      message.warning("Please select a language.");
    } else if (!reported) {
      message.warning("Please enter the reported by field.");
    } else if (!publish) {
      message.warning("Please enter the publish by field.");
    } else if (!newType) {
      message.warning("Please select the news type.");
    } else if (!type) {
      message.warning("Please select the content type (e.g., image or video).");
    } else if (!slug.trim()) {
      message.warning("Please generate a slug.");
    } else {
      // If all fields are valid, open the modal and set the preview content
      setIsVerifyModalOpen(true);
      setTimeout(() => {
        const previewElement = document.getElementById("perview");
        if (previewElement) {
          previewElement.innerHTML = desc;
        } else {
          console.error('Element with ID "perview" not found.');
        }
      }, 0);
    }
  };

  const handleVerifyCancel = () => {
    setIsVerifyModalOpen(false);
  };
  const editor = useRef(null);
  // const onUpload = (publishAt) => {
  //   // console.log(
  //   //   { title: title,
  //   //     discription: desc,
  //   //     topic: Topic,
  //   //     keyWord: keyword,}
  //   // )
  //   setLoading(true);
  //   let formdata = new FormData();
  //   formdata.append("file", img, img.name);
  //   // console.log(formdata);

  //   axios.post(`${API_URL}/image`, formdata).then(async (image) => {
  //     // console.log("upload image response ", image);
  //     await axios
  //       .post(`${API_URL}/article/${localStorage.getItem("id")}`, {
  //         title: title,
  //         discription: desc,
  //         topic: Topic,
  //         keyWord: keyword,
  //         language: Language,
  //         reportedBy: reported,
  //         publishBy: publish,
  //         newsType: newType,
  //         image: image.data.image,
  //         type: type,
  //         subCategory: subCategory,
  //         slug: slug,
  //         comment: comment,
  //         priority: priority,
  //         slider: slider,
  //         publishAt: publishAt || new Date(), // Use scheduled time or current time
  //         status: publishAt ? 'scheduled' : 'published'
  //       })
  //       .then((data) => {
  //         // console.log("upload article response : ", data);
  //         // console.log(data.data);
  //         // console.log(
  //         //   {
  //         //     title: title,
  //         //     discription: desc,
  //         //     topic: Topic,
  //         //     keyWord: keyword,
  //         //     language: Language,
  //         //     reportedBy: reported,
  //         //     publishBy: publish,
  //         //     newsType: newType,
  //         //     image: image.data.image,
  //         //     subCategory: subCategory,
  //         //     comment: comment,
  //         //     priority: priority,
  //         //     slider: slider,
  //         //   },
  //         //   "dddata"
  //         // );
  //         message.success(
  //           publishAt
  //             ? `Article scheduled for ${new Date(publishAt).toLocaleString()}`
  //             : "Article published successfully!"
  //         );

  //         setTitle("");
  //         setTopic("");
  //         setdesc("");
  //         setKeyword([]);
  //         setImg(null);
  //         setLanguage("Hindi");
  //         // setpublish("");
  //         setreported("");
  //         setNewType("upload");
  //         setType("img");
  //         setLoading(false);
  //         setSubCategory("");
  //         setSlug("");
  //         setComment(false);
  //         setPriority(false);
  //         setSlider(false);
  //         setIsVerifyModalOpen(false);
  //       })
  //       .catch(() => {
  //         message.error("Your article was not successfully Uploaded");
  //         setLoading(false);
  //       });
  //     setIsVerifyModalOpen(false);
  //   });
  // };
  const onChange = (checked) => {
    setComment(checked);
  };
  const onUpload = () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append("file", img, img.name);

    // Get the schedule time if it exists
    const scheduleInput = document.getElementById('scheduleDateTime');
    const publishAt = scheduleInput?.value || null;

    axios.post(`${API_URL}/image`, formdata).then(async (image) => {
      try {
        const payload = {
          title: title,
          discription: desc,
          topic: Topic,
          keyWord: keyword,
          language: Language,
          reportedBy: reported,
          publishBy: publish,
          newsType: newType,
          image: image.data.image,
          type: type,
          subCategory: subCategory,
          slug: slug,
          comment: comment,
          priority: priority,
          slider: slider,
          publishAt: publishAt,
          status: publishAt ? 'scheduled' : 'published'
        };

        await axios.post(`${API_URL}/article/${localStorage.getItem("id")}`, payload);

        message.success(
          publishAt
            ? `Article scheduled for ${new Date(publishAt).toLocaleString()}`
            : "Article published successfully!"
        );

        // Reset form
        setTitle("");
        setTopic("");
        setdesc("");
        setKeyword([]);
        setImg(null);
        setLanguage("Hindi");
        setreported("");
        setNewType("upload");
        setType("img");
        setSubCategory("");
        setSlug("");
        setComment(false);
        setPriority(false);
        setSlider(false);
        setIsVerifyModalOpen(false);
      } catch (error) {
        console.error("Upload error:", error);
        message.error("Failed to upload article");
      } finally {
        setLoading(false);
      }
    }).catch((error) => {
      console.error("Image upload error:", error);
      message.error("Failed to upload image");
      setLoading(false);
    });
  };

  // const onEditHandle = async () => {
  //   setLoading(true);
  //   if (Update) {
  //     let formdata = new FormData();
  //     formdata.append("file", img, img.name);
  //     // console.log(formdata);

  //     axios.post(`${API_URL}/image`, formdata).then(async (image) => {
  //       setdataImage(image.data.image);
  //       // console.log(image.data.image);
  //       await axios
  //         .put(`${API_URL}/article/${id}`, {
  //           title: title,
  //           discription: desc,
  //           topic: Topic,
  //           keyWord: keyword,
  //           language: Language,
  //           reportedBy: reported,
  //           publishBy: publish,
  //           newsType: newType,
  //           image: image.data.image,
  //           type: type,
  //           subCategory: subCategory,
  //           slug: slug,
  //           comment: comment,
  //           priority: priority,
  //           slider: slider,
  //         })
  //         .then((data) => {
  //           // console.log(data.data);
  //           message.success("Your article was successfully Edit");
  //           setTitle("");
  //           setTopic("");
  //           setdesc("");
  //           setKeyword([]);
  //           setImg(null);
  //           setLanguage("Hindi");
  //           setType("img");
  //           // setpublish("");
  //           setreported("");
  //           setNewType("upload");
  //           setComment(false);
  //           setPriority(false);
  //           setSlider(false);
  //           setUpdate(false);
  //           setOnEdit(false);
  //           setSlug("");
  //           setLoading(false);
  //           setIsVerifyModalOpen(false);
  //           navigation("/dashboard/articles");
  //         })
  //         .catch(() => {
  //           setLoading(false);
  //           message.error("Your article was not successfully Edit");
  //         });
  //     });
  //   } else {
  //     axios
  //       .put(`${API_URL}/article/${id}`, {
  //         title: title,
  //         discription: desc,
  //         topic: Topic,
  //         keyWord: keyword,
  //         language: Language,
  //         reportedBy: reported,
  //         publishBy: publish,
  //         newsType: newType,
  //         image: img,
  //         type: type,
  //         subCategory: subCategory,
  //         slug: slug,
  //         comment: comment,
  //         priority: priority,
  //         slider: slider,
  //       })
  //       .then((data) => {
  //         // console.log(data.data);
  //         message.success("Your article was successfully Edit");
  //         setTitle("");
  //         setTopic("");
  //         setdesc("");
  //         setKeyword([]);
  //         setImg(null);
  //         setLanguage("Hindi");
  //         // setpublish("");
  //         setType("img");
  //         setreported("");
  //         setNewType("upload");
  //         setComment(false);
  //         setPriority(false);
  //         setSlider(false);
  //         setUpdate(false);
  //         setOnEdit(false);
  //         setSlug("");
  //         setLoading(false);
  //         setIsVerifyModalOpen(false);
  //         navigation("/dashboard/articles");
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //         message.error("Your article was not successfully Edit");
  //       });
  //   }

  //   setIsVerifyModalOpen(false);
  // };
  const onEditHandle = async () => {
    setLoading(true);

    try {
      let imageUrl = img; // Default to existing image URL

      // If a new image was uploaded (Update is true)
      if (Update && img instanceof File) {
        const formdata = new FormData();
        formdata.append("file", img, img.name);

        const imageResponse = await axios.post(`${API_URL}/image`, formdata);
        imageUrl = imageResponse.data.image;
      }

      const payload = {
        title: title,
        discription: desc,
        topic: Topic,
        keyWord: keyword,
        language: Language,
        reportedBy: reported,
        publishBy: publish,
        newsType: newType,
        image: imageUrl,
        type: type,
        subCategory: subCategory,
        slug: slug,
        comment: comment,
        priority: priority,
        slider: slider,
      };

      await axios.put(`${API_URL}/article/${id}`, payload);

      message.success("Your article was successfully edited");
      resetForm();
      navigation("/dashboard/articles");
    } catch (error) {
      console.error("Edit error:", error);
      message.error("Your article was not successfully edited");
    } finally {
      setLoading(false);
      setIsVerifyModalOpen(false);
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setTitle("");
    setTopic("");
    setdesc("");
    setKeyword([]);
    setImg(null);
    setLanguage("Hindi");
    setType("img");
    setreported("");
    setNewType("upload");
    setComment(false);
    setPriority(false);
    setSlider(false);
    setUpdate(false);
    setOnEdit(false);
    setSlug("");
  };
  const [key, setKey] = useState(0); // Key to force re-render

  const handleBlur = (newContent) => {
    setdesc(newContent); // Update the embed content
    setKey((prevKey) => prevKey + 1); // Trigger re-render of the embed div
  };

  useEffect(() => {
    const processEmbeds = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process(); // Process Instagram embeds
      } else {
        console.warn("Instagram embed script not loaded yet.");
      }
    };

    // Check if Instagram script is loaded and process the embed
    const interval = setInterval(() => {
      if (window.instgrm && window.instgrm.Embeds) {
        clearInterval(interval); // Stop the interval once the script is ready
        processEmbeds(); // Process Instagram embeds
      }
    }, 100); // Check every 100ms until the script is available

    return () => clearInterval(interval); // Clean up the interval
  }, [key]); // Run whenever `key` changes

  return (
    <>
      {loading ? (
        <p style={{ color: "white", backgroundColor: "red" }}>
          Please wait ....
        </p>
      ) : null}
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        {onEdit ? "Edit Article" : "Upload"}
      </h1>
      {onEdit ? (
        <Button
          onClick={() => {
            setOnEdit(false);
            window.location.reload();
          }}
          type="primary"
        >
          Cancel Edit
        </Button>
      ) : null}
      <Row gutter={24}>
        <Col span={24}>
          <Card style={{ minHeight: "80vh", height: "100%" }}>
            {/* {onEdit && (
              <Col span={6}>
                <Input
                  type="file"
                  name="file"
                  id="file-name"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    console.log(e.target.files[0]);
                    setUpdate(true);
                  }}
                  style={{ display: "none", overflow: "hidden" }}
                  hidden={true}
                />
                <div
                  onClick={() => {
                    document.getElementById("file-name").click();
                    
                  }}
                  style={{
                    width: "auto",
                    height: "200px",
                    backgroundColor: "rgba(0,0,0,0.1",
                    borderRadius: "10px",
                    marginBottom: 10,
                    overflow: "hidden",
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
                        overflow: "hidden",
                      }}
                    >
                      Upload Image or Video here
                    </div>
                  ) : (
                    <img
                      style={{
                        width: "auto",
                        height: "200px",
                        borderRadius: "10px",
                      }}
                      src={Update?URL.createObjectURL(img):img}
                    />
                  )}
                </div>
              </Col>
            )} */}

            {/* {onEdit ? (
              <>
                <Col span={8}>
                  <img
                    style={{
                      width: "auto",
                      height: "200px",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                    src={dataImage}
                  />
                </Col>
              </>
            ) : (
              <></>
            )} */}
            <Row gutter={24}>
              {/* {!onEdit && ( */}
              <Col span={6}>
                <Input
                  type="file"
                  name="file"
                  id="file-name"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    // console.log(e.target.files[0]);
                    setUpdate(true);
                  }}
                  style={{ display: "none", overflow: "hidden" }}
                  hidden={true}
                />
                <div
                  onClick={() => {
                    document.getElementById("file-name").click();
                  }}
                  style={{
                    width: "auto",
                    height: "200px",
                    backgroundColor: "rgba(0,0,0,0.1",
                    borderRadius: "10px",
                    marginBottom: 10,
                    overflow: "hidden",
                  }}
                >
                  {
                    img == null ? (
                      <div
                        style={{
                          height: "100%",
                          fontSize: "25px",
                          fontWeight: "600",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          color: "rgba(0,0,0,0.5)",
                          overflow: "hidden",
                        }}
                      >
                        Upload Image or Video here
                      </div>
                    ) : type === "img" ? (
                      <>
                        <img
                          style={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                          src={Update ? URL.createObjectURL(img) : img}
                        />
                      </>
                    ) : (
                      <>
                        <video
                          style={{
                            objectFit: "fit",
                            width: "100%",
                            height: "200px",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                          src={Update ? URL.createObjectURL(img) : img}
                        />
                      </>
                    )
                    // <img
                    //   style={{
                    //     width: "auto",
                    //     height: "200px",
                    //     borderRadius: "10px",
                    //     overflow: "hidden",
                    //   }}
                    //   src={Update?URL.createObjectURL(img):img}
                    // />
                  }
                </div>
              </Col>
              {/* )} */}
              <Col span={18}>
                <Row gutter={20}>
                  <Col span={12}>
                    <Select
                      // onChange={(e) => setValue(e)}
                      placeholder="Select Language"
                      onChange={(e) => setType(e)}
                      defaultValue="img"
                      value={type}
                      style={{
                        width: "100%",
                        // height: 50,
                        marginBottom: "20px",
                      }}
                      options={[
                        {
                          value: "img",
                          label: "Image",
                        },
                        {
                          value: "vid",
                          label: "Video",
                        },
                      ]}
                    />
                  </Col>
                  <Col span={12}>
                    <Select
                      // onChange={(e) => setValue(e)}
                      placeholder="Select Language"
                      onChange={(e) => setLanguage(e)}
                      value={Language}
                      style={{
                        width: "100%",
                        // height: 50,
                        marginBottom: "20px",
                      }}
                      options={[
                        // {
                        //   value: "English",
                        //   label: "English",
                        // },
                        // {
                        //   value: "Urdu",
                        //   label: "Urdu",
                        // },
                        {
                          value: "Hindi",
                          label: "Hindi",
                        },
                      ]}
                    />
                  </Col>
                  <Col span={24}>
                    <Input
                      placeholder="Headline"
                      value={title}
                      onChange={(e) => {
                        setSlug(createSlug(e.target.value));
                        setTitle(e.target.value);
                      }}
                    />
                    <div style={{ marginBottom: "20px" }}></div>
                  </Col>
                  <Col span={12}>
                    <Select
                      value={Topic ? Topic : null}
                      placeholder="Category"
                      onChange={(e) => {
                        setTopic(e);
                        setSubCategory("");
                      }}
                      style={{
                        width: "100%",
                      }}
                      options={
                        role === "admin" ? categoryData : userCategoryOptions
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <Select
                      placeholder="Sub Category"
                      value={subCategory ? subCategory : null}
                      onChange={(e) => setSubCategory(e)}
                      style={{
                        width: "100%",
                      }}
                      // dropdownRender={}
                      options={subCategoryData}
                    />
                    <div style={{ marginBottom: "20px" }}></div>
                  </Col>
                </Row>
              </Col>

              <Col span={24} style={{ marginTop: "20px" }}>
                <JoditEditor
                  // config={{}}
                  ref={editor}
                  value={desc}
                  tabIndex={1}
                  onBlur={handleBlur}
                />
                <div style={{ marginBottom: "20px" }}></div>
              </Col>

              <Col span={6}>
                <Select
                  mode="multiple"
                  placeholder="Tags"
                  value={keyword}
                  onChange={(e) => setKeyword(e)}
                  style={{
                    width: "100%",
                  }}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Input
                          placeholder="Please enter item"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                          onKeyDown={(e) => e.stopPropagation()} // Prevent closing the dropdown on key press
                        />
                        <Button type="primary" onClick={addItem}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                >
                  {options.map((option) => (
                    <Option key={option.key} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
                <div style={{ marginBottom: "20px" }}></div>
              </Col>

              <Col span={6}>
                <Select
                  placeholder="Reported By"
                  value={reported ? reported : null}
                  onChange={(e) => setreported(e)}
                  style={{
                    width: "100%",
                  }}
                  options={[
                    {
                      value: "लोकसत्य",
                      label: "लोकसत्य",
                    },
                    // {
                    //   value: "PTI",
                    //   label: "PTI",
                    // },
                    // {
                    //   value: "UNIVARTI",
                    //   label: "UNIVARTI",
                    // },
                    // {
                    //   value: "BHASHA",
                    //   label: "BHASHA",
                    // },
                  ]}
                />
                <div style={{ marginBottom: "20px" }}></div>
              </Col>
              <Col span={6}>
                <Input
                  placeholder="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <div style={{ marginBottom: "20px" }}></div>
              </Col>
              <Col span={6}>
                <Input readOnly placeholder="Publish By" value={publish} />
                <div style={{ marginBottom: "20px" }}></div>
              </Col>
              {/* {console.log("comment", comment)} */}
              <Col span={6}>
                Comment
                <Switch
                  size="small"
                  style={{ marginLeft: 5 }}
                  // value={comment}
                  checked={comment}
                  defaultChecked={comment}
                  onChange={(e) => {
                    setComment(e);
                  }}
                />
              </Col>
              {/* {console.log("priority", priority)} */}
              <Col span={6}>
                priority
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
              </Col>
              {/* {console.log("slider", slider)} */}
              <Col span={6}>
                slider
                <Switch
                  size="small"
                  style={{ marginLeft: 5 }}
                  // value={slider}
                  checked={slider}
                  defaultChecked={slider}
                  onChange={(e) => {
                    setSlider(e);
                  }}
                />
              </Col>
              <Col span={6}>
                <Button onClick={showVerifyModal} type="primary">
                  Preview
                </Button>
              </Col>
            </Row>
            <div id="dd"></div>
          </Card>
        </Col>
      </Row>
      <Modal
        confirmLoading={loading}
        title="Article Modal"
        open={isVerifyModalOpen}
        onOk={onEdit ? onEditHandle : onUpload}
        onCancel={handleVerifyCancel}
        style={{
          overflow: "auto",
          height: 500,
        }}
        okText={onEdit ? "Save" : "Upload"}
        afterOpenChange={(open) => {
          if (open) {
            const previewElement = document.getElementById("perview");
            if (previewElement) {
              previewElement.innerHTML = desc;
            }
          }
        }}
        // footer={[
        //   <Button key="back" onClick={handleVerifyCancel}>
        //     Cancel
        //   </Button>,
        //   <Button 
        //     key="schedule" 
        //     type="default"
        //     onClick={() => {
        //       // Handle schedule logic here
        //       const publishAt = document.getElementById('scheduleDateTime').value;
        //       if (onEdit) {
        //         onEditHandle(publishAt);
        //       } else {
        //         onUpload(publishAt);
        //       }
        //     }}
        //   >
        //     Schedule
        //   </Button>,
        //   <Button 
        //     key="submit" 
        //     type="primary" 
        //     onClick={onEdit ? onEditHandle : onUpload}
        //   >
        //     {onEdit ? "Save" : "Publish Now"}
        //   </Button>,
        // ]}
        footer={[
          <Button key="back" onClick={handleVerifyCancel}>
            Cancel
          </Button>,
          <Button
            key="schedule"
            type="default"
            onClick={() => {
              const publishAt = document.getElementById('scheduleDateTime').value;
              if (!publishAt) {
                message.warning("Please select a schedule time");
                return;
              }
              onUpload(); // The onUpload function will now handle both cases
            }}
          >
            Schedule
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              // Clear any schedule time when publishing immediately
              const scheduleInput = document.getElementById('scheduleDateTime');
              if (scheduleInput) scheduleInput.value = '';
              if (onEdit) {
                onEditHandle();
              } else {
                onUpload();
              }
            }}
          >
            {onEdit ? "Save" : "Publish Now"}
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e", marginBottom: 8 }}>
            Schedule Publication (optional):
          </h3>
          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)} // Prevent selecting past dates
            id="scheduleDateTime"
            style={{
              padding: 8,
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              width: '100%'
            }}
          />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          Headline:
        </h3>

        <div style={{ fontSize: 16, fontWeight: "400", color: "#5e5e5e" }}>
          {title}
        </div>
        <hr />
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          News:
        </h3>
        <div id="perview" style={{ marginLeft: 20 }}></div>
        <hr />
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          Topic:
        </h3>
        <div style={{ fontSize: 16, fontWeight: "400", color: "#5e5e5e" }}>
          {Topic}
        </div>
        <hr />
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          Language:
        </h3>
        <div style={{ fontSize: 16, fontWeight: "400", color: "#5e5e5e" }}>
          {Language}
        </div>
        <hr />
        <h3 style={{ fontSize: 20, fontWeight: "600", color: "#2e2e2e" }}>
          keyWord:
        </h3>
        <div
          style={{
            fontSize: 16,
            fontWeight: "400",
            color: "#5e5e5e",
            flexDirection: "row",
          }}
        >
          {keyword.map((e) => {
            return <div>{e},</div>;
          })}
        </div>
      </Modal>
    </>
  );
};

export default Upload;
