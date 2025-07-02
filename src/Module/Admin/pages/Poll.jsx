// Poll.js

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
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../API";
const Poll = () => {
  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);

  // console.log(userData);
  const handleDeletePoll = async (id) => {
    // console.log("delete btn clicked");
    // console.log("poll id : ", id);
    try {
      const res = await axios.delete(`${API_URL}/delete_pool/${id}`);
      // console.log("polls delete api response : ", res);
      if (res.data.status === 200) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
      getAllPolls();
    } catch (error) {
      console.log("error is delete ads : ", error);
      message.error(error.response.data.message);
    }
    getAllPolls();
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
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (_, record) => (
        <ul>
          {record.options.map((option, index) => (
            <li key={index}>
              {option.optionText} - Votes: {option.votes}, Percentage:{" "}
              {option.percentage.toFixed(0)}%
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Delete",
      dataIndex: "_id",
      key: "_id",
      render: (_, { _id }) => (
        <button
          onClick={() => handleDeletePoll(_id)}
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
  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/polls?${filterItem}=${filterItemResponse}`)
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
    getAllPolls();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createPoll = async () => {
    try {
      const response = await axios.post(`${API_URL}/polls`, {
        question,
        options: options.map((option) => ({
          optionText: option.text,
          votes: 0, // Assuming you want to initialize votes to 0
          percentage: 0, // Assuming you want to initialize percentage to 0
        })),
      });

      const polls = response.data;
      setUserData(polls.reverse());
      message.success("Successfully Added");
      handleCancel();

      // rest of the code
    } catch (error) {
      message.error("Poll Not Added");
      // error handling
    }
  };

  const getAllPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/polls`);
      const pollsData = response.data.reverse();
      setUserData(pollsData);
    } catch (error) {
      console.error("Error fetching polls:", error);
      message.error("Failed to fetch polls. Please try again.");
    }
  };

  useEffect(() => {
    getAllPolls();
  }, []);

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
        Poll
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
                  value: "question",
                  label: "By Question",
                },
              ]}
            />
          </Col>
          <Col span={6}>
            <Input
              value={filterItemResponse}
              onChange={(e) => setfilterItemResponse(e.target.value)}
              placeholder={filterItem == "id" ? "Id" : "Question"}
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
        title="Upload Poll"
        visible={isModalOpen}
        onOk={createPoll}
        onCancel={handleCancel}
      >
        <Input
          value={question}
          style={{ width: 310, height: 50 }}
          placeholder="Enter Your Question"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        {options.map((option, index) => (
          <Input
            key={index}
            value={option.text}
            style={{ width: 150, height: 50, marginTop: 10, marginRight: 10 }}
            placeholder={`Enter Option ${index + 1}`}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index].text = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}
        <br />
        <a
          onClick={() => setOptions([...options, { text: "" }])}
          href="javascript:void(0)"
        >
          Add New Option
        </a>
      </Modal>
    </>
  );
};

export default Poll;
