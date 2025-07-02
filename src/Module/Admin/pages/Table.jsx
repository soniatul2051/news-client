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
import Search from "antd/es/input/Search";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../../../API";
import ChangePasswordModal from "../../../Components/AdminComponets/ChangeUserPasswordModal";

const AdminTable = () => {
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [value, setValue] = useState("");
  const [filterItem, setfilterItem] = useState("id");
  const [filterItemResponse, setfilterItemResponse] = useState("");

  const getAllUsers = async () => {
    try {
      axios.get(`${API_URL}/user`).then((users) => {
        setUserData(users.data);
        // console.log(users);
      });
    } catch (error) {
      console.log("error in getting all users : ", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // console.log("users in user dashboard  : ", userData);

  const showModal = (user) => {
    // console.log(user);
    setCurrentUser(user);
    setIsModalOpen(true);
  };
  const showVerifyModal = (user) => {
    // console.log(user);
    setCurrentUser(user);
    setIsVerifyModalOpen(true);
  };

  const ShowDeleteModal = (user) => {
    // console.log(user);
    setCurrentUser(user);
    setIsModalDeleteOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentUser({});
    getAllUsers();
  };
  const handleVerifyCancel = () => {
    setIsVerifyModalOpen(false);
    setCurrentUser({});
    getAllUsers();
  };
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
    setCurrentUser({});
    getAllUsers();
  };
  const ChangeRole = () => {
    axios
      .put(`${API_URL}/role`, {
        id: currentUser._id,
        role: value,
      })
      .then(() => {
        message.success("Successfully role Changed");
      })
      .catch((err) => {
        message.error("Role was Not Changed");
      });
    setCurrentUser("");
    getAllUsers();
    setIsModalOpen(false);
  };

  // console.log("current user verff : ", currentUser);

  const Verify = () => {
    axios
      .put(`${API_URL}/register`, {
        id: currentUser._id,
      })
      .then((data) => {
        // console.log("verify user res : ", data);
        message.success("Successfully register Changed");
        getAllUsers();
      })
      .catch((err) => {
        console.log("error in verify user : ", err);
        message.error("Register was Not Changed");
      });
    setCurrentUser("");
    getAllUsers();
    setIsVerifyModalOpen(false);
  };

  const OnDelete = () => {
    axios
      .delete(`${API_URL}/user?id=${currentUser._id}`)
      .then(() => {
        message.success("User Has Successfully Deleted");
        setCurrentUser("");
        setIsModalDeleteOpen(false);
        getAllUsers();
      })
      .catch((err) => {
        console.log(err);
        message.error("User Has Not Deleted");
        setCurrentUser("");
        setIsModalDeleteOpen(false);
      });
  };

  const onFilter = () => {
    // console.log(filterItem, filterItemResponse);
    axios
      .get(`${API_URL}/user?${filterItem}=${filterItemResponse}`)
      .then((users) => {
        setUserData(users.data);
        // console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Change user password
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const openChangePasswordModal = (user) => {
    setCurrentUser(user);
    setIsChangePasswordOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordOpen(false);
    setCurrentUser(null);
    getAllUsers();
  };
  const columns = [
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      key: "registerd",
      dataIndex: "registerd",
      render: (_, { registerd }) => (
        <>
          <Tag color={registerd ? "green" : "volcano"}>
            {registerd ? "Verify" : "UnVerify"}
          </Tag>
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (user) => (
        <Space size="middle">
          <a
            className="border border-gray-400 rounded py-1 px-2"
            onClick={() => showModal(user)}
          >
            Change Role
          </a>
          <a
            className="border border-gray-400 rounded py-1 px-2"
            onClick={() => openChangePasswordModal(user)}
          >
            Change Password
          </a>
          <a
            className="border border-gray-400 rounded bg-red-300 py-1 px-2"
            onClick={
              user?.role == "admin" ? () => {} : () => ShowDeleteModal(user)
            }
          >
            Delete
          </a>
          <a
            className="border border-gray-400 rounded py-1 px-2"
            onClick={() => showVerifyModal(user)}
          >
            Verify
          </a>
        </Space>
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
        Users
      </h1>
      <Card style={{ height: "100%" }}>
        <Row gutter={20}>
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              defaultValue="id"
              onChange={(e) => setfilterItem(e)}
              options={[
                {
                  value: "id",
                  label: "By Id",
                },
                {
                  value: "registerd",
                  label: "By Registration",
                },
                {
                  value: "role",
                  label: "By Role",
                },
                {
                  value: "phone",
                  label: "By Phone Number",
                },
              ]}
            />
          </Col>
          <Col span={6}>
            {filterItem == "id" || filterItem == "phone" ? (
              <>
                <Input
                  onChange={(e) => setfilterItemResponse(e.target.value)}
                  placeholder={filterItem == "id" ? "Id" : "Phone Number"}
                  style={{ width: "100%" }}
                />
              </>
            ) : (
              <Select
                style={{ width: "100%" }}
                onChange={(e) => setfilterItemResponse(e)}
                options={
                  filterItem == "role"
                    ? [
                        {
                          value: "staff",
                          label: "Staff",
                        },
                        {
                          value: "admin",
                          label: "Admin",
                        },
                        {
                          value: "author",
                          label: "Author",
                        },
                        {
                          value: "journalist",
                          label: "Journalist",
                        },
                      ]
                    : [
                        {
                          value: "yes",
                          label: "Verify",
                        },
                        {
                          value: "no",
                          label: "UnVerify",
                        },
                      ]
                }
              />
            )}
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={onFilter}>
              Filter
            </Button>
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={userData} />
          </Col>
        </Row>
      </Card>
      <Modal
        title="Change Role"
        open={isModalOpen}
        onOk={ChangeRole}
        onCancel={handleCancel}
      >
        <Select
          onChange={(e) => setValue(e)}
          style={{
            width: 300,
            height: 50,
          }}
          options={[
            {
              value: "admin",
              label: "Admin",
              disabled: currentUser?.role == "admin" ? true : false,
            },
            {
              value: "staff",
              label: "Staff",
              disabled: currentUser?.role == "staff" ? true : false,
            },
            {
              value: "journalist",
              label: "Journalist",
              disabled: currentUser?.role == "journalist" ? true : false,
            },
            {
              value: "author",
              label: "Author",
              disabled: currentUser?.role == "author" ? true : false,
            },
          ]}
        />
      </Modal>
      <Modal
        title="Verify User"
        open={isVerifyModalOpen}
        onOk={Verify}
        onCancel={handleVerifyCancel}
      ></Modal>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={closeChangePasswordModal}
        user={currentUser}
      />
      <Modal
        title="Delete User"
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

export default AdminTable;
