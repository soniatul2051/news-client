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
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../API";

const TagsAndCategory = () => {
  const [userData, setUserData] = useState([]); // All data
  const [filteredData, setFilteredData] = useState([]); // Data to display after filtering
  const [filterItem, setFilterItem] = useState("all"); // Default to 'all'
  const [subCategory, setSubCategory] = useState("");
  const [cateGet, setCateGet] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [editSequence, setEditSequence] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("tag");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const contentRes = await axios.get(`${API_URL}/content`);
      const subCategoryRes = await axios.get(`${API_URL}/subcategory`);
      const allData = [
        ...contentRes.data.reverse(),
        ...subCategoryRes.data.reverse(),
      ];
      setUserData(allData); // Store all data
      setFilteredData(allData); // Also set filtered data to all initially
      const categoryRes = await axios.get(`${API_URL}/content?type=category`);
      const categories = categoryRes.data.map((item) => ({
        key: item._id,
        value: item.text,
        label: item.text,
      }));
      setCateGet(categories);
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  // Modified filtering logic
  const onFilter = () => {
    let filteredResults = userData; // Start with all data

    // Apply filtering based on filterItem selection (By Tag, By Category, By SubCategory)
    if (filterItem === "tag") {
      filteredResults = filteredResults.filter((item) => item.type === "tag");
    } else if (filterItem === "category") {
      filteredResults = filteredResults.filter(
        (item) => item.type === "category"
      );
    } else if (filterItem === "sub") {
      filteredResults = filteredResults.filter((item) => item.type === "sub");
    }

    // Apply search filtering if searchValue is not empty
    if (searchValue.trim() !== "") {
      filteredResults = filteredResults.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Update the filtered data state
    setFilteredData(filteredResults);
  };

  const onAdd = () => {
    if (type !== "sub") {
      axios
        .post(`${API_URL}/content?id=${localStorage.getItem("id")}`, {
          type,
          text,
          ...(type === "category" && { sequence: userData?.length + 1 }), // Include sequence only for 'category'
        })
        .then(() => {
          message.success("Successfully Added");
          setIsModalOpen(false);
          fetchData();
        })
        .catch((err) => {
          console.log(err);
          message.error(err.response?.data?.message || "Error adding item"); // Display backend error message if available
        });
    } else {
      axios
        .post(`${API_URL}/subcategory`, {
          adminId: localStorage.getItem("id"),
          category: subCategory,
          text,
        })
        .then(() => {
          message.success("Successfully Added");
          setIsModalOpen(false);
          fetchData();
        })
        .catch((err) => {
          console.log(err);
          message.error("Error adding subcategory");
        });
    }
  };

  const onEditSequence = () => {
    axios
      .put(`${API_URL}/content`, {
        id: selectedData?._id,
        sequence: editSequence,
      })
      .then(() => {
        message.success("Successfully Edited");
        setIsEditModalOpen(false);
        setSelectedData(null);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.err);
      });
  };

  const handleDeleteTagCategory = async (id) => {
    // console.log("id to delete tag&cat  : ", id);
    try {
      const res = await axios.delete(`${API_URL}/delete_content/${id}`);
      // console.log("delete res tag&cat : ", res);
      if (res.data.status === 200) {
        message.success(res.data.message);
        fetchData(); // Refresh data after deletion
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log("Error deleting tag/category", error);
      message.error("Error deleting item");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => <a>{record._id}</a>,
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {record.type === "category" ? (
            <>
              <p>{record.sequence}</p>
              <Space size="middle">
                <a
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setSelectedData(record); // Set selected record
                    setEditSequence(record.sequence); // Initialize with current sequence
                  }}
                >
                  Edit
                </a>
              </Space>
            </>
          ) : (
            <div></div> // Render an empty div for non-category types
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "text",
      key: "text",
    },
    {
      title: filterItem !== "sub" ? "Type" : "Category",
      key: filterItem !== "sub" ? "type" : "category",
      dataIndex: filterItem !== "sub" ? "type" : "category",
      render: (text, record) => {
        // console.log("record in sub category : ", record);
        return (
          <Tag color="geekblue">
            {filterItem !== "sub" ? record.type : record.category}
          </Tag>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => (
        <button
          onClick={() => handleDeleteTagCategory(record._id)}
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

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
        Tags & Category
      </h1>
      <Card style={{ height: "100%" }}>
        <Row gutter={20}>
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              defaultValue="all" // Default to 'all'
              onChange={(e) => {
                setFilterItem(e);
                if (e === "all") {
                  setFilteredData(userData); // Reset to all data when 'All' is selected
                }
              }}
              options={[
                { value: "all", label: "All" }, // Added "All" option
                { value: "tag", label: "By Tag" },
                { value: "category", label: "By Category" },
                { value: "sub", label: "By SubCategory" },
              ]}
            />
          </Col>
          <Col span={6}>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={onFilter} // Allow pressing Enter to trigger filter
              placeholder="Search..."
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={onFilter}>
              Filter
            </Button>
            <Space style={{ marginLeft: 10 }}>
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={() => {
                  setSearchValue(""); // Clear search input
                  setFilteredData(userData); // Reset to all data
                  setIsModalOpen(true); // Open the modal to add new item
                }}
              >
                Add
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          style={{ marginTop: 20 }}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }} // Add pagination
        />
      </Card>

      <Modal
        title="Add Tag or Category"
        open={isModalOpen}
        onOk={onAdd}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Select
              defaultValue="tag"
              style={{ width: "100%" }}
              onChange={(e) => setType(e)}
              options={[
                { value: "tag", label: "Tag" },
                { value: "category", label: "Category" },
                { value: "sub", label: "Sub Category" },
              ]}
            />
          </Col>
          <Col span={12}>
            {type === "sub" && (
              <Select
                placeholder="Select Category"
                style={{ width: "100%" }}
                onChange={(e) => setSubCategory(e)}
                options={cateGet}
              />
            )}
          </Col>
          <Col span={24} style={{ marginTop: 10 }}>
            <Input
              placeholder="Enter name"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Edit Sequence"
        open={isEditModalOpen}
        onOk={onEditSequence}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Input
              placeholder="Enter sequence number"
              value={editSequence}
              onChange={(e) => setEditSequence(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TagsAndCategory;
