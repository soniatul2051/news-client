import {
  Button,
  Card,
  Col,
  DatePicker,
  Image,
  Input,
  Layout,
  Row,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import Upload from "antd/es/upload/Upload";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";
import { API_URL } from "../../../../API";

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 100,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
  width: "100%",
};
const { RangePicker } = DatePicker;
const Ads = () => {
  const [img, setImg] = useState(null);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [Update, setUpdate] = useState(false);
  const [userData, setUserData] = useState([]);
  const [visible, setVisible] = useState("");
  const [date, setDate] = useState("");
  const [side, setSide] = useState("");
  const [device, setDevice] = useState("mobile");

  const [noOfImpression, setNoOfImpression] = useState("");
  const [Impression, setImpression] = useState(0);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setImpression((prevImpression) => prevImpression + 1);
  }, []);

  const fetchAds = () => {
    axios
      .get(`${API_URL}/ads`)
      .then((users) => {
        setUserData(users.data.reverse());
        setNoOfImpression(users.data[0].noOfImpression);
      })
      .catch((err) => {
        console.log("err=>>>", err);
      });
  };
  useEffect(() => {
    fetchAds();
  }, []);

  console.log("userData means ad : ", userData);
  console.log("device  : ", device);

  const onUpload = () => {
    setLoading(true);
    let formdata = new FormData();
    formdata.append("file", img, img.name);

    axios.post(`${API_URL}/image`, formdata).then(async (image) => {
      await axios
        .post(`${API_URL}/ads?id=${localStorage.getItem("id")}`, {
          imgLink: image.data.image,
          link: link,
          slugName: title,
          // Price: price,
          device: device,
          noOfImpression: Impression,
          StartAt: JSON.parse(date)[0].split("T")[0],
          EndAt: JSON.parse(date)[1].split("T")[0],
          side,
        })
        .then((data) => {
          message.success("Your Ad was successfully Uploaded");
          setImg(null);
          setLink("");
          setLoading(false);
          setDate("");
          setTitle("");
          // setPrice("");
          fetchAds();
        })

        .catch((err) => {
          message.error("Your Ad was not successfully Uploaded");
          console.log(err);
          setLoading(false);
        });
    });
    fetchAds();
  };
  // console.log("side of advdvvd : ", side);
  const handleDeleteAd = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/ads_delete/${id}`);

      if (res.data.data.status === 200) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
      fetchAds();
    } catch (error) {
      message.error(error.response.data.message);
    }
    fetchAds();
  };

  const handleToggleStatus = (adId, currentStatus) => {
    const newStatus = currentStatus ? false : true;

    // Make an API call to update the status
    axios
      .put(`${API_URL}/ads/${adId}`, { active: newStatus })
      .then(() => {
        // Handle success
        message.success(`Status  Changed `);
        fetchAds();
        // Refresh the article data
      })
      .catch((error) => {
        // Handle error

        message.error("Failed to update  status");
      });
    fetchAds();
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_, { _id }) => <a>{_id}</a>,
    },
    {
      title: "noOfImpression",
      dataIndex: "noOfImpression",
      key: "noOfImpression",
      render: (_, { noOfImpression }) => <a>{noOfImpression}</a>,
    },
    {
      title: "imgLink",
      dataIndex: "imgLink",
      key: "link",
      render: (_, { imgLink, _id }) => {
        return (
          <Image
            width={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            src={imgLink ? imgLink : ""}
            preview={{
              visible: _id == visible,
              src: imgLink,
              onVisibleChange: (value) => {
                setVisible(visible ? "" : _id);
              },
            }}
          />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "slugName",
      key: "slugName",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (_, { link }) => (
        <a href={link} target="_blank">
          {link}
        </a>
      ),
    },
    {
      title: "No. Of Clicks",
      dataIndex: "noAds",
      key: "noAds",
    },
    // {
    //   title: "Price",
    //   dataIndex: "Price",
    //   key: "Price",
    // },
    {
      title: "Start Date",
      dataIndex: "StartAt",
      key: "StartAt",
      render: (_, { StartAt }) => {
        const fullDate = new Date(StartAt);
        const trimmedDate = fullDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return <p>{trimmedDate}</p>;
      },
    },
    {
      title: "End Date",
      dataIndex: "EndAt",
      key: "EndAt",
      render: (_, { EndAt }) => {
        const fullDate = new Date(EndAt);
        const trimmedDate = fullDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return <p>{trimmedDate}</p>;
      },
    },
    {
      title: "Online / Offline",
      key: "status",
      dataIndex: "status",
      render: (_, ad) => {
        return (
          <>
            <Tag color={ad.active ? "cyan" : "red"}>
              {ad.active ? "ONLINE" : "OFFLINE"}
            </Tag>
            <Button
              type="link"
              onClick={() => handleToggleStatus(ad._id, ad.active)}
              style={{ padding: "auto 0px", margin: "10px 0px" }}
            >
              Change Status
            </Button>
          </>
        );
      },
    },

    {
      title: "Delete",
      dataIndex: "_id",
      key: "_id",
      render: (_, { _id }) => (
        <button
          onClick={() => handleDeleteAd(_id)}
          style={{
            padding: "3px 8px",
            backgroundColor: "#fadcd9",
            color: "red",
            font: "message-box",
            borderRadius: "5px",
            cursor: "pointer",
            border: "1px solid red",
          }}
        >
          Delete
        </button>
      ),
    },
  ];
  return (
    <>
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        Advertisement
      </h1>
      <Card style={{ width: "100%", height: "100%" }}>
        <Row>
          <Col span={12}>
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
                setUpdate(true);
              }}
              style={{
                width: "300px",
                height: "200px",
                backgroundColor: "rgba(0,0,0,0.1",
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
                  Upload Ad Image
                </div>
              ) : (
                <img
                  style={{
                    width: "300px",
                    height: "200px",
                    borderRadius: "10px",
                  }}
                  src={URL.createObjectURL(img)}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={6}>
            <Input
              placeholder="Enter Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>

          <Col span={6} className="">
            <Select
              placeholder="Select Device"
              value={device}
              style={{ width: "100%" }}
              onChange={(e) => setDevice(e)}
              options={[
                // { label: "Both", value: "both" },
                { label: "Mobile", value: "mobile" },
                { label: "Laptop", value: "laptop" },
              ]}
            />
          </Col>

          <Col span={6}></Col>
          <Col span={6} style={{ marginTop: 10 }}>
            <RangePicker
              onChange={(e) => {
                setDate(JSON.stringify(e));
                let d = JSON.stringify(e);
              }}
            />
          </Col>
          <Col span={6} style={{ marginTop: 10 }}>
            <Select
              value={side ? side : null}
              placeholder="Side"
              defaultValue="top"
              style={{ width: "100%" }}
              onChange={(e) => setSide(e)}
              options={[
                {
                  label: "Top",
                  value: "top",
                },
                {
                  label: "Middle",
                  value: "mid",
                },
                {
                  label: "Bottom",
                  value: "bottom",
                },
                {
                  label: "Popup",
                  value: "popup",
                },
              ]}
            />
          </Col>
          <Col style={{ marginTop: 10 }} span={6}>
            <Button
              style={{ width: "100%" }}
              loading={loading}
              type="primary"
              onClick={onUpload}
            >
              Upload{" "}
            </Button>
          </Col>
        </Row>

        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <Table
              scroll={{ x: 1300 }}
              columns={columns}
              dataSource={userData}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Ads;
