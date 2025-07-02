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
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../../../API";
import { render } from "react-dom";
const Comments = ({ isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");
  const [currentComment, setCurrentComment] = useState({}); //while deleting
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const onFilter = () => {
    axios
      .get(`${API_URL}/comment?${filterItem}=${filterItemResponse}`)
      .then((poll) => {
        setComments(poll.data);
      })
      .catch((err) => {
        message.error("Error in Filtering");
      });
  };
  const onReset = () => {
    setfilterItem("");
    setfilterItemResponse("");
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments(params) {
    try {
      // Fetch comments from your API
      const response = await fetch(`${API_URL}/comment`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to fetch comments. Please try again.");
    }
  }
  // Generate serial number (sno) for each comment
  const commentsWithSno = comments.map((comment, index) => ({
    ...comment,
    sno: index + 1,
  }));

  // Prepare data for chart
  const chartData = {
    labels: commentsWithSno.map((comment) => `Comment ${comment.sno}`),
    datasets: [
      {
        label: "Comments",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: commentsWithSno.map((comment) => comment.likes), // Assuming 'likes' is the property representing the data for the chart
      },
    ],
  };
  const ShowDeleteModal = (comment) => {
    // console.log(comment);
    setCurrentComment(comment);
    setIsModalDeleteOpen(true);
  };
  const OnDelete = () => {
    axios
      .delete(`${API_URL}/comment?id=${currentComment._id}`)
      .then(() => {
        message.success("Comment Has Successfully Deleted");
        setCurrentComment("");
        fetchComments();
        setIsModalDeleteOpen(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Comment Has Not Deleted");
        setCurrentComment("");
        setIsModalDeleteOpen(false);
      });
  };
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
    setCurrentComment({});
  };

  // Columns configuration for Ant Design Table
  const columns = [
    {
      title: "Sno.",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Name",
      dataIndex: "name", // Assuming 'text' is the property representing the comment
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email", // Assuming 'likes' is the property representing the likes
      key: "email",
    },
    {
      title: "Comment",
      dataIndex: "message", // Assuming 'likes' is the property representing the likes
      key: "message",
    },
    {
      title: "postId",
      dataIndex: "postId", // Assuming 'likes' is the property representing the likes
      key: "postId",
    },
    {
      title: "Actions",
      key: "action",
      render: (comment) => (
        <Space size="middle">
          <a
            onClick={() => {
              ShowDeleteModal(comment);
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
  ];
  function placeHolderString() {
    if (filterItem === "id") return "Id";
    if (filterItem === "comment") return "Comment";
    if (filterItem === "postId") return "postId";
    if (filterItem === "name") return "name";
    if (filterItem === "email") return "email";
  }

  return (
    <>
      <div>
        <h1
          style={{
            color: "rgba(0,0,0,0.8)",
            marginBottom: 10,
            textAlign: "left",
            fontFamily: "Poppins",
          }}
        >
          Comments
        </h1>
        <Row gutter={20}>
          <Col span={6}>
            <Select
              value={filterItem}
              style={{ width: "100%" }}
              defaultValue="id"
              onChange={(e) => setfilterItem(e)}
              options={[
                {
                  value: "commentID",
                  label: "By Id",
                },
                {
                  value: "email",
                  label: "By Email",
                },
                {
                  value: "name",
                  label: "By Name",
                },
                {
                  value: "comment",
                  label: "By Comment",
                },
                {
                  value: "id",
                  label: "By postID",
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
        <Table
          columns={columns}
          scroll={{ x: 1300 }}
          dataSource={commentsWithSno}
        />
      </div>
      <Modal
        title="Delete Comment"
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

export default Comments;
