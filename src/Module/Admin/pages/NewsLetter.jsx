import React, { useState, useEffect } from "react";
import { Table, Spin, Alert, Modal, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { API_URL } from "../../../../API";

const { confirm } = Modal;

const NewsLetter = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${API_URL}/newsletter`); // Replace with your endpoint
        const data = await response.json();
        if (response.ok) {
          setSubscriptions(data.subscriptions);
        } else {
          setError(data.message || "Failed to fetch subscriptions");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDelete = async (email) => {
    try {
      const response = await fetch(`${API_URL}/newsletter`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Subscription deleted successfully!");

        setSubscriptions((prev) =>
          prev.filter((subscription) => subscription.email !== email)
        );
      } else {
        message.error(data.message || "Failed to delete subscription");
      }
    } catch (err) {
      message.error("An error occurred while deleting the subscription");
    }
  };

  const showDeleteConfirm = (email) => {
    confirm({
      title: "Are you sure you want to delete this subscription?",
      icon: <ExclamationCircleOutlined />,
      content: `Email: ${email}`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(email);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Active",
    //   dataIndex: "active",
    //   key: "active",
    //   render: (active) =>
    //     active ? (
    //       <span className="text-green-500 font-semibold">Active</span>
    //     ) : (
    //       <span className="text-red-500 font-semibold">Inactive</span>
    //     ),
    // },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => showDeleteConfirm(record.email)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="text-center pt-32">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        Subscribed Users
      </h1>
      <Table
        dataSource={subscriptions}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default NewsLetter;
