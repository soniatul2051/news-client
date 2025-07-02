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
import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../../../API";
import JoditEditor from "jodit-react";

const Live = () => {
  const [userData, setUserData] = useState([]);
  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [desc, setdesc] = useState("");

  const getAllLive = async () => {
    try {
      const response = await axios.get(`${API_URL}/live`);
      // console.log("live data res : ", response);
      const livesData = response.data;
      setUserData(livesData.reverse());
    } catch (error) {
      console.error("Error fetching polls:", error);
      message.error("Failed to fetch polls. Please try again.");
    }
  };

  // console.log("all live data : ", userData);
  useEffect(() => {
    getAllLive();
  }, []);

  const onAdd = () => {
    axios
      .post(`${API_URL}/live`, {
        link: link,
        title: text,
        discription: desc,
      })
      .then((users) => {
        setUserData(users.data);
        message.success("Successfully Added");
        handleCancel();
      })
      .catch((err) => {
        console.log(err);
        message.error("Successfully Not Added");
      });
  };

  // Delete Live video
  const handleDelete = (id) => {
    // console.log("id to live delete : ", id);
    fetch(`${API_URL}/live/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the live stream");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("delete live res : ", data);
        message.success("Live stream deleted successfully!");
        getAllLive();
        // Reload or update the table to reflect changes
      })
      .catch((error) => {
        console.log("error in delete live : ", error);
        message.error("Error deleting live stream: " + error.message);
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (value) => {
        return (
          <div
            style={{
              width: "70px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (_, { link }) => <a>{link}</a>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "delete",
      render: (id) => (
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => handleDelete(id)}
        >
          Delete
        </button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/live?${filterItem}=${filterItemResponse}`)
      .then((poll) => {
        setUserData(poll.data);
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
    getAllLive();
  };
  const editor = useRef(null);

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
        Live Streaming
      </h1>
      <Card style={{ height: "100%" }}>
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
                  label: "By Title",
                },
              ]}
            />
          </Col>
          <Col span={6}>
            <Input
              value={filterItemResponse}
              onChange={(e) => setfilterItemResponse(e.target.value)}
              placeholder={filterItem == "id" ? "Id" : "Title"}
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
        <Row>
          <Col style={{ marginTop: 20 }} span={4}>
            <Space>
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={showModal}
              >
                Add
              </Button>
            </Space>
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={userData} />
          </Col>
        </Row>
      </Card>
      <Modal
        title="Upload Link"
        open={isModalOpen}
        onOk={onAdd}
        onCancel={handleCancel}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Input
              value={text}
              style={{
                width: "100%",
                height: 50,
              }}
              placeholder="Enter Title"
              onChange={(e) => setText(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Input
              value={link}
              style={{
                width: "100%",
                height: 50,
              }}
              placeholder="Enter Youtube Live Link"
              onChange={(e) => setLink(e.target.value)}
            />
          </Col>
          <Col span={24} style={{ marginTop: "20px" }}>
            <JoditEditor
              // config={{}}
              ref={editor}
              value={desc}
              tabIndex={1}
              onBlur={(newContent) => setdesc(newContent)}
            />
            <div style={{ marginBottom: "20px" }}></div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Live;
